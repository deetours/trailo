import type { BusinessService } from '../service';
import type { BusinessProfile, BrandKit, TeamMember, TeamRole } from '@/types/business';
import { mockBusinessProfile, mockTeamMembers } from './mock-data';

class MockBusinessAdapter implements BusinessService {
  private profile: BusinessProfile = { ...mockBusinessProfile };
  private teamMembers: TeamMember[] = [...mockTeamMembers];
  private profileSubscribers = new Map<string, Set<(b: BusinessProfile | null) => void>>();

  private notifyProfile(businessId: string) {
    const subs = this.profileSubscribers.get(businessId);
    if (subs) {
      const p = this.profile.id === businessId ? this.profile : null;
      subs.forEach(cb => cb(p));
    }
  }

  async getBusinessProfile(businessId: string): Promise<BusinessProfile | null> {
    return this.profile.id === businessId ? this.profile : null;
  }

  async updateBusinessProfile(businessId: string, patch: Partial<BusinessProfile>): Promise<BusinessProfile> {
    if (this.profile.id !== businessId) throw new Error('Not found');
    this.profile = { ...this.profile, ...patch, updatedAt: new Date().toISOString() };
    this.notifyProfile(businessId);
    return this.profile;
  }

  async updateBrandKit(businessId: string, brandKit: BrandKit): Promise<BusinessProfile> {
    if (this.profile.id !== businessId) throw new Error('Not found');
    this.profile.brandKit = brandKit;
    this.profile.updatedAt = new Date().toISOString();
    this.notifyProfile(businessId);
    return this.profile;
  }

  async listTeamMembers(businessId: string): Promise<TeamMember[]> {
    return this.teamMembers.filter(tm => tm.businessId === businessId);
  }

  async inviteTeamMember(businessId: string, email: string, role: TeamRole): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      businessId,
      name: email.split('@')[0],
      email,
      role,
      status: 'invited',
      invitedAt: new Date().toISOString(),
    };
    this.teamMembers.push(newMember);
    return newMember;
  }

  async removeTeamMember(memberId: string): Promise<void> {
    this.teamMembers = this.teamMembers.filter(tm => tm.id !== memberId);
  }

  subscribeToBusinessProfile(businessId: string, cb: (b: BusinessProfile | null) => void): () => void {
    if (!this.profileSubscribers.has(businessId)) this.profileSubscribers.set(businessId, new Set());
    this.profileSubscribers.get(businessId)!.add(cb);
    this.getBusinessProfile(businessId).then(cb);
    return () => {
      const subs = this.profileSubscribers.get(businessId);
      if (subs) subs.delete(cb);
    };
  }
}

export const businessService = new MockBusinessAdapter();
