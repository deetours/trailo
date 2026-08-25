'use client';

import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useAllDepartures } from './useAllDepartures';
import { useNow } from './useNow';
import type { Departure } from '@/types/departure';

const UPCOMING_LIMIT = 7;

export interface UpcomingDeparture extends Departure {
  tripName: string;
}

export function useUpcomingDepartures(businessId: string) {
  const { result: tripsResult, isLoading: tripsLoading } = useTrips(businessId, { pageSize: 200 });
  const trips = tripsResult.items;
  const { departures, isLoading: departuresLoading } = useAllDepartures(trips.map((t) => t.id));
  const now = useNow();

  const upcoming: UpcomingDeparture[] = departures
    .filter((d) => new Date(d.startDate).getTime() >= now && d.status !== 'cancelled')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, UPCOMING_LIMIT)
    .map((d) => ({
      ...d,
      tripName: trips.find((t) => t.id === d.tripId)?.basicInfo.name || 'Trip',
    }));

  return {
    departures: upcoming,
    hasAnyTrips: trips.length > 0,
    isLoading: tripsLoading || departuresLoading,
  };
}
