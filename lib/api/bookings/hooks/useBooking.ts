import { useState, useEffect } from 'react';
import { bookingsService } from '../mock/mock-adapter';
import type { Booking, BookingStatus } from '@/types/booking';

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = bookingsService.subscribeToBooking(id, (b) => {
      setBooking(b);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const updateStatus = (status: BookingStatus) => bookingsService.updateBookingStatus(id, status);

  return { booking, isLoading, updateStatus };
}
