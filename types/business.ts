export interface BrandKit {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface BusinessAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'youtube' | 'x' | 'other';
  url: string;
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  legalName: string;
  displayName: string;
  slug: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  socialLinks: SocialLink[];
  brandKit: BrandKit;
  address?: BusinessAddress;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TeamRole = 'owner' | 'admin' | 'editor';
export type TeamMemberStatus = 'invited' | 'active' | 'removed';

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: TeamRole;
  invitedAt: string;
  acceptedAt?: string;
  status: TeamMemberStatus;
}
