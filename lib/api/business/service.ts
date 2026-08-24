import type { BusinessProfile, BrandKit, TeamMember, TeamRole, BusinessEntityType, VerificationDocumentType } from '@/types/business';

export interface CreateBusinessProfileInput {
  id: string;
  ownerUserId: string;
  legalName: string;
  displayName: string;
  contactEmail: string;
  contactPhone?: string;
  entityType: BusinessEntityType;
  address?: BusinessProfile['address'];
}

export interface BusinessService {
  getBusinessProfile(businessId: string): Promise<BusinessProfile | null>;
  createBusinessProfile(input: CreateBusinessProfileInput): Promise<BusinessProfile>;
  updateBusinessProfile(businessId: string, patch: Partial<BusinessProfile>): Promise<BusinessProfile>;
  updateBrandKit(businessId: string, brandKit: BrandKit): Promise<BusinessProfile>;
  submitVerificationDocuments(businessId: string, documents: { type: VerificationDocumentType; fileName: string }[]): Promise<BusinessProfile>;
  listTeamMembers(businessId: string): Promise<TeamMember[]>;
  inviteTeamMember(businessId: string, email: string, role: TeamRole): Promise<TeamMember>;
  removeTeamMember(memberId: string): Promise<void>;
  subscribeToBusinessProfile(businessId: string, cb: (b: BusinessProfile | null) => void): () => void;
}
