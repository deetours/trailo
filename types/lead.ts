export type LeadSource = 'whatsapp' | 'website' | 'referral' | 'walk-in' | 'phone' | 'other';
export type LeadIntent = 'browsing' | 'ready-to-book' | 'price-sensitive' | 'group-booking';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'converted' | 'lost';

export interface LeadTimelineEvent {
  id: string;
  type: 'status-change' | 'note' | 'message' | 'created';
  description: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  tripId?: string;
  departureId?: string;
  source: LeadSource;
  intent?: LeadIntent;
  status: LeadStatus;
  nextActionAt?: string;
  nextActionNote?: string;
  conversationId?: string;
  customerId?: string;
  timeline: LeadTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
