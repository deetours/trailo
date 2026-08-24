import { useState, useEffect } from 'react';
import { tripsService } from '../mock/mock-adapter';
import type { Trip, TripSection } from '@/types/trip';

export function useTrip(id: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = tripsService.subscribeToTrip(id, (t) => {
      setTrip(t);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const updateSection = async <K extends TripSection>(section: K, data: Trip[K]) => {
    return tripsService.updateTripSection(id, section, data);
  };

  return { trip, isLoading, updateSection };
}
