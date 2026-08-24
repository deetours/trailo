import type { Booking, BookingStatus } from '@/types/booking';

export interface BookingInput {
  tripId: string;
  departureId: string;
  customerId: string;
  leadId?: string;
  paxCount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
}

export interface BookingListFilters {
  status?: BookingStatus | 'all';
  tripId?: string;
  departureId?: string;
  customerId?: string;
}

export interface BookingsService {
  listBookings(businessId: string, filters?: BookingListFilters): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | null>;
  createBooking(businessId: string, input: BookingInput): Promise<Booking>;
  updateBookingStatus(id: string, status: BookingStatus): Promise<Booking>;
  /**
   * Cross-domain hook for the payments adapter: keeps `amountPaid` in sync
   * whenever a payment flips to `paid` (positive delta) or a refund is
   * issued (negative delta). Not intended to be called from UI code — go
   * through the payments service instead, which drives this as a side effect.
   */
  adjustAmountPaid(id: string, delta: number): Promise<Booking>;
  subscribeToBookings(businessId: string, filters: BookingListFilters, cb: (b: Booking[]) => void): () => void;
  subscribeToBooking(id: string, cb: (b: Booking | null) => void): () => void;
}
