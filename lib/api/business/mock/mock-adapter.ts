import type { BusinessService, CreateBusinessProfileInput } from '../service';
import type { BusinessProfile, BrandKit, TeamMember, TeamRole, VerificationDocumentType } from '@/types/business';
import { mockBusinessProfile, mockTeamMembers } from './mock-data';

class MockBusinessAdapter implements BusinessService {
  private profiles = new Map<string, BusinessProfile>([[mockBusinessProfile.id, { ...mockBusinessProfile }]]);
  private teamMembers: TeamMember[] = [...mockTeamMembers];
  private profileSubscribers = new Map<string, Set<(b: BusinessProfile | null) => void>>();

  private notifyProfile(businessId: string) {
    const subs = this.profileSubscribers.get(businessId);
    if (subs) {
      const p = this.profiles.get(businessId) || null;
      subs.forEach(cb => cb(p));
    }
  }

  async getBusinessProfile(businessId: string): Promise<BusinessProfile | null> {
    return this.profiles.get(businessId) || null;
  }

  async createBusinessProfile(input: CreateBusinessProfileInput): Promise<BusinessProfile> {
    const now = new Date().toISOString();
    const profile: BusinessProfile = {
      id: input.id,
      ownerUserId: input.ownerUserId,
      legalName: input.legalName,
      displayName: input.displayName,
      slug: input.displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      socialLinks: [],
      brandKit: { primaryColor: '#000000', secondaryColor: '#ffffff' },
      address: input.address,
      entityType: input.entityType,
      verification: { status: 'unverified', documents: [] },
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(profile.id, profile);
    this.teamMembers.push({
      id: `tm_${Date.now()}`,
      businessId: profile.id,
      name: input.legalName,
      email: input.contactEmail,
      role: 'owner',
      status: 'active',
      invitedAt: now,
      acceptedAt: now,
    });
    return profile;
  }

  async updateBusinessProfile(businessId: string, patch: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const profile = this.profiles.get(businessId);
    if (!profile) throw new Error('Not found');
    const updated = { ...profile, ...patch, updatedAt: new Date().toISOString() };
    this.profiles.set(businessId, updated);
    this.notifyProfile(businessId);
    return updated;
  }

  async updateBrandKit(businessId: string, brandKit: BrandKit): Promise<BusinessProfile> {
    const profile = this.profiles.get(businessId);
    if (!profile) throw new Error('Not found');
    profile.brandKit = brandKit;
    profile.updatedAt = new Date().toISOString();
    this.notifyProfile(businessId);
    return profile;
  }

  async submitVerificationDocuments(businessId: string, documents: { type: VerificationDocumentType; fileName: string }[]): Promise<BusinessProfile> {
    const profile = this.profiles.get(businessId);
    if (!profile) throw new Error('Not found');
    const now = new Date().toISOString();
    profile.verification = {
      status: 'submitted',
      documents: documents.map((d, i) => ({ id: `doc_${Date.now()}_${i}`, type: d.type, fileName: d.fileName, uploadedAt: now })),
      submittedAt: now,
    };
    profile.updatedAt = now;
    this.notifyProfile(businessId);
    return profile;
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
