'use client';

import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';

const ESTABLISHED_VOLUME_THRESHOLD = 5;

export interface BusinessStateFlags {
  hasTrips: boolean;
  hasPublishedTrip: boolean;
  hasLeads: boolean;
  hasBookings: boolean;
  hasEstablishedVolume: boolean;
  isLoading: boolean;
}

/**
 * Independent flags rather than a linear A→F enum — real data (a draft trip
 * with leads already attached) breaks a strict published→leads→bookings
 * funnel. See docs/DASHBOARD_PLAN.md §5.
 */
export function useBusinessState(businessId: string): BusinessStateFlags {
  const { result: tripsResult, isLoading: tripsLoading } = useTrips(businessId, { pageSize: 200 });
  const { leads, isLoading: leadsLoading } = useLeads(businessId);
  const { bookings, isLoading: bookingsLoading } = useBookings(businessId);

  return {
    hasTrips: tripsResult.total > 0,
    hasPublishedTrip: tripsResult.items.some((t) => t.status === 'published'),
    hasLeads: leads.length > 0,
    hasBookings: bookings.length > 0,
    hasEstablishedVolume: bookings.length >= ESTABLISHED_VOLUME_THRESHOLD,
    isLoading: tripsLoading || leadsLoading || bookingsLoading,
  };
}
