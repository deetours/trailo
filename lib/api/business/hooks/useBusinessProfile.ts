import { useState, useEffect } from 'react';
import { businessService } from '../mock/mock-adapter';
import type { BusinessProfile } from '@/types/business';

export function useBusinessProfile(businessId: string | undefined) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = businessService.subscribeToBusinessProfile(businessId, (p) => {
      setProfile(p);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [businessId]);

  const updateProfile = async (patch: Partial<BusinessProfile>) => {
    if (!businessId) throw new Error('No business ID');
    return businessService.updateBusinessProfile(businessId, patch);
  };

  const updateBrandKit = async (brandKit: any) => {
    if (!businessId) throw new Error('No business ID');
    return businessService.updateBrandKit(businessId, brandKit);
  };

  return { profile, isLoading, updateProfile, updateBrandKit };
}
