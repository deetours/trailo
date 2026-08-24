import { useState, useEffect } from 'react';
import { tripsService } from '../mock/mock-adapter';
import type { TripListFilters, TripListResult } from '../service';

export function useTrips(businessId: string, filters: TripListFilters = {}) {
  const [result, setResult] = useState<TripListResult>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = tripsService.subscribeToTripList(businessId, filters, (res) => {
      setResult(res);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [businessId, JSON.stringify(filters)]);

  return { result, isLoading, bulkUpdateStatus: tripsService.bulkUpdateStatus.bind(tripsService) };
}
