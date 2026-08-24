import { useState, useEffect } from 'react';
import { leadsService } from '../mock/mock-adapter';
import type { Lead, LeadStatus } from '@/types/lead';

export function useLead(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = leadsService.subscribeToLead(id, (l) => {
      setLead(l);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const updateStatus = (status: LeadStatus) => leadsService.updateLeadStatus(id, status);
  const addNote = (text: string) => leadsService.addLeadNote(id, text);
  const convert = () => leadsService.convertLead(id);

  return { lead, isLoading, updateStatus, addNote, convert };
}
