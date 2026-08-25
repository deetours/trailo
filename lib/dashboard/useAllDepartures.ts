'use client';

import { useEffect, useState } from 'react';
import { departuresService } from '@/lib/api/departures/mock/mock-adapter';
import type { Departure } from '@/types/departure';

/**
 * Departures have no business-wide list endpoint (mock service is scoped to
 * a single tripId, matching every other trip-owned resource) — fetched here
 * per-trip and merged, reusing departuresService directly rather than adding
 * a new service method just for this read. Shared by useAttentionItems,
 * useUpcomingDepartures, and usePerformanceMetrics so they can't drift.
 */
export function useAllDepartures(tripIds: string[]) {
  const [result, setResult] = useState<{ departures: Departure[]; isLoading: boolean }>({
    departures: [],
    isLoading: true,
  });
  const key = tripIds.join(',');

  useEffect(() => {
    if (tripIds.length === 0) return;
    let cancelled = false;
    Promise.all(tripIds.map((id) => departuresService.listDepartures(id))).then((lists) => {
      if (!cancelled) setResult({ departures: lists.flat(), isLoading: false });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return tripIds.length === 0 ? { departures: [], isLoading: false } : result;
}
