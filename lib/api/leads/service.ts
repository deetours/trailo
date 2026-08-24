import type { Lead, LeadStatus, LeadSource, LeadIntent } from '@/types/lead';
import type { Customer } from '@/types/customer';

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  tripId?: string;
  departureId?: string;
  source: LeadSource;
  intent?: LeadIntent;
  nextActionAt?: string;
  nextActionNote?: string;
}

export interface LeadListFilters {
  status?: LeadStatus | 'all';
  source?: LeadSource | 'all';
  search?: string;
}

export interface LeadsService {
  listLeads(businessId: string, filters?: LeadListFilters): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createLead(businessId: string, input: LeadInput): Promise<Lead>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<Lead>;
  addLeadNote(id: string, text: string): Promise<Lead>;
  convertLead(id: string): Promise<{ lead: Lead; customer: Customer }>;
  bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<void>;
  subscribeToLeads(businessId: string, filters: LeadListFilters, cb: (l: Lead[]) => void): () => void;
  subscribeToLead(id: string, cb: (l: Lead | null) => void): () => void;
}
