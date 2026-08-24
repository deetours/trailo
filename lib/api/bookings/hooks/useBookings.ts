import { useState, useEffect } from 'react';
import { bookingsService } from '../mock/mock-adapter';
import type { Booking } from '@/types/booking';
import type { BookingListFilters } from '../service';

export function useBookings(businessId: string, filters: BookingListFilters = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = bookingsService.subscribeToBookings(businessId, filters, (b) => {
      setBookings(b);
      setIsLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, JSON.stringify(filters)]);

  return { bookings, isLoading };
}
