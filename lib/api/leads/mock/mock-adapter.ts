import type { LeadsService, LeadInput, LeadListFilters } from '../service';
import type { Lead, LeadStatus } from '@/types/lead';
import type { Customer } from '@/types/customer';
import { mockLeads } from './mock-data';
import { customersService } from '../../customers/mock/mock-adapter';

class MockLeadsAdapter implements LeadsService {
  private leads: Lead[] = [...mockLeads];
  private listSubscribers = new Map<string, Set<(l: Lead[]) => void>>();
  private leadSubscribers = new Map<string, Set<(l: Lead | null) => void>>();

  private notifyAllLists() {
    this.listSubscribers.forEach((subs, key) => {
      const { businessId, filters } = JSON.parse(key);
      this.listLeads(businessId, filters).then(res => subs.forEach(cb => cb(res)));
    });
  }

  private notifyLead(id: string) {
    const subs = this.leadSubscribers.get(id);
    if (subs) {
      const lead = this.leads.find(l => l.id === id) || null;
      subs.forEach(cb => cb(lead));
    }
  }

  async listLeads(businessId: string, filters?: LeadListFilters): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    let result = this.leads.filter(l => l.businessId === businessId);

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters?.source && filters.source !== 'all') {
      result = result.filter(l => l.source === filters.source);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l => l.name.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q));
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getLead(id: string): Promise<Lead | null> {
    return this.leads.find(l => l.id === id) || null;
  }

  async createLead(businessId: string, input: LeadInput): Promise<Lead> {
    const now = new Date().toISOString();
    const lead: Lead = {
      ...input,
      id: `lead_${Date.now()}`,
      businessId,
      status: 'new',
      timeline: [
        {
          id: `evt_${Date.now()}`,
          type: 'created',
          description: 'Lead created',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.leads.push(lead);
    this.notifyAllLists();
    return lead;
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    const previousStatus = lead.status;
    const now = new Date().toISOString();
    lead.status = status;
    lead.updatedAt = now;
    lead.timeline.push({
      id: `evt_${Date.now()}`,
      type: 'status-change',
      description: `Status changed from ${previousStatus} to ${status}`,
      createdAt: now,
    });
    this.notifyLead(id);
    this.notifyAllLists();
    return lead;
  }

  async addLeadNote(id: string, text: string): Promise<Lead> {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    const now = new Date().toISOString();
    lead.timeline.push({
      id: `evt_${Date.now()}`,
      type: 'note',
      description: text,
      createdAt: now,
    });
    lead.updatedAt = now;
    this.notifyLead(id);
    this.notifyAllLists();
    return lead;
  }

  async convertLead(id: string): Promise<{ lead: Lead; customer: Customer }> {
    const lead = this.leads.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');

    const customer = await customersService.findOrCreateByPhone(
      lead.businessId,
      { name: lead.name, phone: lead.phone, email: lead.email },
      lead.id
    );

    const now = new Date().toISOString();
    lead.customerId = customer.id;
    lead.status = 'converted';
    lead.updatedAt = now;
    lead.timeline.push({
      id: `evt_${Date.now()}`,
      type: 'status-change',
      description: `Converted to customer ${customer.name}`,
      createdAt: now,
    });

    this.notifyLead(id);
    this.notifyAllLists();
    return { lead, customer };
  }

  async bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<void> {
    const now = new Date().toISOString();
    this.leads.forEach(lead => {
      if (!ids.includes(lead.id)) return;
      const previousStatus = lead.status;
      lead.status = status;
      lead.updatedAt = now;
      lead.timeline.push({
        id: `evt_${Date.now()}_${lead.id}`,
        type: 'status-change',
        description: `Status changed from ${previousStatus} to ${status}`,
        createdAt: now,
      });
      this.notifyLead(lead.id);
    });
    this.notifyAllLists();
  }

  subscribeToLeads(businessId: string, filters: LeadListFilters, cb: (l: Lead[]) => void): () => void {
    const key = JSON.stringify({ businessId, filters });
    if (!this.listSubscribers.has(key)) this.listSubscribers.set(key, new Set());
    this.listSubscribers.get(key)!.add(cb);
    this.listLeads(businessId, filters).then(cb);
    return () => {
      const subs = this.listSubscribers.get(key);
      if (subs) subs.delete(cb);
    };
  }

  subscribeToLead(id: string, cb: (l: Lead | null) => void): () => void {
    if (!this.leadSubscribers.has(id)) this.leadSubscribers.set(id, new Set());
    this.leadSubscribers.get(id)!.add(cb);
    this.getLead(id).then(cb);
    return () => {
      const subs = this.leadSubscribers.get(id);
      if (subs) subs.delete(cb);
    };
  }
}

export const leadsService = new MockLeadsAdapter();
