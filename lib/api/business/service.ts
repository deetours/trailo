import type { BusinessProfile, BrandKit, TeamMember, TeamRole } from '@/types/business';

export interface BusinessService {
  getBusinessProfile(businessId: string): Promise<BusinessProfile | null>;
  updateBusinessProfile(businessId: string, patch: Partial<BusinessProfile>): Promise<BusinessProfile>;
  updateBrandKit(businessId: string, brandKit: BrandKit): Promise<BusinessProfile>;
  listTeamMembers(businessId: string): Promise<TeamMember[]>;
  inviteTeamMember(businessId: string, email: string, role: TeamRole): Promise<TeamMember>;
  removeTeamMember(memberId: string): Promise<void>;
  subscribeToBusinessProfile(businessId: string, cb: (b: BusinessProfile | null) => void): () => void;
}
