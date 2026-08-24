import { useState, useEffect, useCallback } from 'react';
import { businessService } from '../mock/mock-adapter';
import type { TeamMember } from '@/types/business';

export function useTeamMembers(businessId: string | undefined) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!businessId) return;
    setIsLoading(true);
    const data = await businessService.listTeamMembers(businessId);
    setMembers(data);
    setIsLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, inviteMember: businessService.inviteTeamMember.bind(businessService), removeMember: businessService.removeTeamMember.bind(businessService), refetch: fetchMembers };
}
