'use client';

import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';
import { useAllDepartures } from './useAllDepartures';

export interface PerformanceMetrics {
  /** null when there are no departures with capacity to average — render "—". */
  occupancyRate: number | null;
  /** null when there are no bookings yet — render "—". */
  averageBookingValue: { value: number; currency: string } | null;
  hasData: boolean;
  isLoading: boolean;
}

export function usePerformanceMetrics(businessId: string): PerformanceMetrics {
  const { result: tripsResult, isLoading: tripsLoading } = useTrips(businessId, { pageSize: 200 });
  const trips = tripsResult.items;
  const { departures, isLoading: departuresLoading } = useAllDepartures(trips.map((t) => t.id));
  const { bookings, isLoading: bookingsLoading } = useBookings(businessId);

  const departuresWithCapacity = departures.filter((d) => d.capacity > 0);
  const occupancyRate =
    departuresWithCapacity.length === 0
      ? null
      : (departuresWithCapacity.reduce((sum, d) => sum + d.booked / d.capacity, 0) / departuresWithCapacity.length) * 100;

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const averageBookingValue =
    activeBookings.length === 0
      ? null
      : {
          value: activeBookings.reduce((sum, b) => sum + b.totalAmount, 0) / activeBookings.length,
          currency: activeBookings[0].currency,
        };

  return {
    occupancyRate,
    averageBookingValue,
    hasData: departuresWithCapacity.length > 0 || activeBookings.length > 0,
    isLoading: tripsLoading || departuresLoading || bookingsLoading,
  };
}
