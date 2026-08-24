import type { LandingPageService } from '../service';
import type { LandingPage, GenerationJob } from '@/types/landing-page';
import { mockLandingPages, mockGenerationJobs } from './mock-data';
import { tripsService } from '../../trips/mock/mock-adapter';

class MockLandingPagesAdapter implements LandingPageService {
  private pages: LandingPage[] = [...mockLandingPages];
  private jobs: GenerationJob[] = [...mockGenerationJobs];
  private jobSubscribers = new Map<string, Set<(j: GenerationJob) => void>>();
  private pageSubscribers = new Map<string, Set<(lp: LandingPage | null) => void>>();

  private notifyJob(id: string) {
    const subs = this.jobSubscribers.get(id);
    if (subs) {
      const job = this.jobs.find(j => j.id === id);
      if (job) subs.forEach(cb => cb(job));
    }
  }

  private notifyPage(tripId: string) {
    const subs = this.pageSubscribers.get(tripId);
    if (subs) {
      const page = this.pages.find(p => p.tripId === tripId) || null;
      subs.forEach(cb => cb(page));
    }
  }

  async getForTrip(tripId: string): Promise<LandingPage | null> {
    return this.pages.find(p => p.tripId === tripId) || null;
  }

  async getLandingPageBySlugs(businessSlug: string, tripSlug: string): Promise<{ theme: any; content: any; trip: any; businessName: string } | null> {
    const trip = await tripsService.getTripBySlug(tripSlug);
    if (!trip) return null;
    
    // In a real app we'd also check if the business slug matches
    // But for mock we just construct a response
    const page = await this.getForTrip(trip.id);
    if (!page || page.status !== 'published') return null;

    // mock theme and content
    const theme = { primaryColor: '#2A8AF6' };
    const content = { heroImage: trip.media?.find(m => m.isHero)?.url || null };

    return {
      theme,
      content,
      trip,
      businessName: 'Organizer Business'
    };
  }

  async generate(tripId: string): Promise<GenerationJob> {
    const trip = await tripsService.getTrip(tripId);
    if (!trip) throw new Error('Trip not found');

    let page = this.pages.find(p => p.tripId === tripId);
    if (!page) {
      page = {
        id: `lp_${Date.now()}`,
        tripId,
        status: 'not-generated',
        revisions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.pages.push(page);
    }
    
    page.status = 'generating';
    this.notifyPage(tripId);

    const job: GenerationJob = {
      id: `job_${Date.now()}`,
      tripId,
      landingPageId: page.id,
      steps: [
        { id: 'structuring', label: 'Structuring content', status: 'pending' },
        { id: 'selecting-layout', label: 'Selecting layout', status: 'pending' },
        { id: 'optimizing', label: 'Optimizing', status: 'pending' }
      ],
      status: 'queued',
      startedAt: new Date().toISOString(),
    };
    
    this.jobs.push(job);
    this.notifyJob(job.id);
    
    // Simulate generation job progression
    setTimeout(() => {
      job.status = 'running';
      job.steps[0].status = 'active';
      this.notifyJob(job.id);
      
      setTimeout(() => {
        job.steps[0].status = 'done';
        job.steps[1].status = 'active';
        this.notifyJob(job.id);
        
        setTimeout(() => {
          job.steps[1].status = 'done';
          job.steps[2].status = 'active';
          this.notifyJob(job.id);
          
          setTimeout(() => {
            job.steps[2].status = 'done';
            job.status = 'succeeded';
            job.finishedAt = new Date().toISOString();
            
            const revision = {
              id: `rev_${Date.now()}`,
              version: (page!.revisions.length || 0) + 1,
              createdAt: new Date().toISOString(),
              snapshotOfTripUpdatedAt: trip.updatedAt
            };
            page!.revisions.push(revision);
            page!.currentRevisionId = revision.id;
            page!.status = 'ready';
            page!.previewToken = `prev_${Date.now()}`;
            page!.updatedAt = new Date().toISOString();
            
            this.notifyJob(job.id);
            this.notifyPage(tripId);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 500);

    return job;
  }

  async getJob(jobId: string): Promise<GenerationJob | null> {
    return this.jobs.find(j => j.id === jobId) || null;
  }

  subscribeToJob(jobId: string, cb: (job: GenerationJob) => void): () => void {
    if (!this.jobSubscribers.has(jobId)) this.jobSubscribers.set(jobId, new Set());
    this.jobSubscribers.get(jobId)!.add(cb);
    this.getJob(jobId).then(j => { if (j) cb(j); });
    return () => {
      const subs = this.jobSubscribers.get(jobId);
      if (subs) subs.delete(cb);
    };
  }

  async publish(landingPageId: string): Promise<LandingPage> {
    const page = this.pages.find(p => p.id === landingPageId);
    if (!page) throw new Error('Not found');
    page.status = 'published';
    const rev = page.revisions.find(r => r.id === page.currentRevisionId);
    if (rev) rev.publishedAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();
    this.notifyPage(page.tripId);
    return page;
  }

  async unpublish(landingPageId: string): Promise<LandingPage> {
    const page = this.pages.find(p => p.id === landingPageId);
    if (!page) throw new Error('Not found');
    page.status = 'ready';
    page.updatedAt = new Date().toISOString();
    this.notifyPage(page.tripId);
    return page;
  }

  async regenerate(tripId: string): Promise<GenerationJob> {
    return this.generate(tripId);
  }

  subscribeToLandingPage(tripId: string, cb: (lp: LandingPage | null) => void): () => void {
    if (!this.pageSubscribers.has(tripId)) this.pageSubscribers.set(tripId, new Set());
    this.pageSubscribers.get(tripId)!.add(cb);
    this.getForTrip(tripId).then(cb);
    return () => {
      const subs = this.pageSubscribers.get(tripId);
      if (subs) subs.delete(cb);
    };
  }
}

export const landingPagesService = new MockLandingPagesAdapter();
