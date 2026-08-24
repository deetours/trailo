import { useState, useEffect } from 'react';
import { departuresService } from '../mock/mock-adapter';
import type { Departure, DepartureStatus } from '@/types/departure';
import type { DepartureInput } from '../service';

export function useDepartures(tripId: string) {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = departuresService.subscribeToDepartures(tripId, (d) => {
      setDepartures(d);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [tripId]);

  const createDeparture = (input: DepartureInput) => departuresService.createDeparture(tripId, input);
  const updateDeparture = (id: string, patch: Partial<DepartureInput>) => departuresService.updateDeparture(id, patch);
  const updateStatus = (id: string, status: DepartureStatus) => departuresService.updateDepartureStatus(id, status);
  const deleteDeparture = (id: string) => departuresService.deleteDeparture(id);

  return { departures, isLoading, createDeparture, updateDeparture, updateStatus, deleteDeparture };
}
