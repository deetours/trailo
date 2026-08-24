import type { BusinessProfile, TeamMember } from '@/types/business';

export const mockBusinessProfile: BusinessProfile = {
  id: 'b_existing',
  ownerUserId: 'u_existing',
  legalName: 'Acme Travels Ltd.',
  displayName: 'Acme Travels',
  slug: 'acme-travels',
  description: 'We organize the best trips.',
  contactEmail: 'hello@acmetravels.com',
  socialLinks: [],
  brandKit: {
    primaryColor: '#000000',
    secondaryColor: '#ffffff'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm_1',
    businessId: 'b_existing',
    name: 'Test Organizer',
    email: 'test@example.com',
    role: 'owner',
    status: 'active',
    invitedAt: new Date().toISOString(),
  }
];
