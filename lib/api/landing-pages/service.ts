import type { LandingPage, GenerationJob } from '@/types/landing-page';

export interface LandingPageService {
  getForTrip(tripId: string): Promise<LandingPage | null>;
  generate(tripId: string): Promise<GenerationJob>;
  getJob(jobId: string): Promise<GenerationJob | null>;
  subscribeToJob(jobId: string, cb: (job: GenerationJob) => void): () => void;
  publish(landingPageId: string): Promise<LandingPage>;
  unpublish(landingPageId: string): Promise<LandingPage>;
  regenerate(tripId: string): Promise<GenerationJob>;
  subscribeToLandingPage(tripId: string, cb: (lp: LandingPage | null) => void): () => void;
}
