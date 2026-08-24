import { useState, useEffect } from 'react';
import { leadsService } from '../mock/mock-adapter';
import type { Lead, LeadStatus } from '@/types/lead';
import type { LeadListFilters, LeadInput } from '../service';

export function useLeads(businessId: string, filters: LeadListFilters = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = leadsService.subscribeToLeads(businessId, filters, (l) => {
      setLeads(l);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [businessId, JSON.stringify(filters)]);

  const createLead = (input: LeadInput) => leadsService.createLead(businessId, input);
  const bulkUpdateStatus = (ids: string[], status: LeadStatus) => leadsService.bulkUpdateStatus(ids, status);

  return { leads, isLoading, createLead, bulkUpdateStatus };
}
