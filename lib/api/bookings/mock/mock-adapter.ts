import type { BookingsService, BookingInput, BookingListFilters } from '../service';
import type { Booking, BookingStatus } from '@/types/booking';
import { mockBookings } from './mock-data';
import { departuresService } from '../../departures/mock/mock-adapter';

class MockBookingsAdapter implements BookingsService {
  private bookings: Booking[] = [...mockBookings];
  private listSubscribers = new Map<string, Set<(b: Booking[]) => void>>();
  private bookingSubscribers = new Map<string, Set<(b: Booking | null) => void>>();

  private notifyAllLists() {
    this.listSubscribers.forEach((subs, key) => {
      const { businessId, filters } = JSON.parse(key);
      this.listBookings(businessId, filters).then(res => subs.forEach(cb => cb(res)));
    });
  }

  private notifyBooking(id: string) {
    const subs = this.bookingSubscribers.get(id);
    if (subs) {
      const booking = this.bookings.find(b => b.id === id) || null;
      subs.forEach(cb => cb(booking));
    }
  }

  async listBookings(businessId: string, filters?: BookingListFilters): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    let result = this.bookings.filter(b => b.businessId === businessId);

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(b => b.status === filters.status);
    }
    if (filters?.tripId) {
      result = result.filter(b => b.tripId === filters.tripId);
    }
    if (filters?.departureId) {
      result = result.filter(b => b.departureId === filters.departureId);
    }
    if (filters?.customerId) {
      result = result.filter(b => b.customerId === filters.customerId);
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getBooking(id: string): Promise<Booking | null> {
    return this.bookings.find(b => b.id === id) || null;
  }

  async createBooking(businessId: string, input: BookingInput): Promise<Booking> {
    const now = new Date().toISOString();
    const booking: Booking = {
      id: `bkg_${Date.now()}`,
      businessId,
      ...input,
      amountPaid: 0,
      status: 'intent',
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.push(booking);

    // Reserve capacity against the departure.
    await departuresService.adjustBookedCount(input.departureId, input.paxCount);

    this.notifyAllLists();
    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    const wasCancelled = booking.status === 'cancelled';
    const becomesCancelled = status === 'cancelled';

    // Cancelling releases reserved capacity back to the departure;
    // reversing a cancellation (edge case, not exposed in the UI today)
    // re-reserves it so the two stay in sync either direction.
    if (becomesCancelled && !wasCancelled) {
      await departuresService.adjustBookedCount(booking.departureId, -booking.paxCount);
    } else if (!becomesCancelled && wasCancelled) {
      await departuresService.adjustBookedCount(booking.departureId, booking.paxCount);
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.notifyBooking(id);
    this.notifyAllLists();
    return booking;
  }

  async adjustAmountPaid(id: string, delta: number): Promise<Booking> {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    booking.amountPaid = Math.max(0, booking.amountPaid + delta);
    booking.updatedAt = new Date().toISOString();
    this.notifyBooking(id);
    this.notifyAllLists();
    return booking;
  }

  subscribeToBookings(businessId: string, filters: BookingListFilters, cb: (b: Booking[]) => void): () => void {
    const key = JSON.stringify({ businessId, filters });
    if (!this.listSubscribers.has(key)) this.listSubscribers.set(key, new Set());
    this.listSubscribers.get(key)!.add(cb);
    this.listBookings(businessId, filters).then(cb);
    return () => {
      const subs = this.listSubscribers.get(key);
      if (subs) subs.delete(cb);
    };
  }

  subscribeToBooking(id: string, cb: (b: Booking | null) => void): () => void {
    if (!this.bookingSubscribers.has(id)) this.bookingSubscribers.set(id, new Set());
    this.bookingSubscribers.get(id)!.add(cb);
    this.getBooking(id).then(cb);
    return () => {
      const subs = this.bookingSubscribers.get(id);
      if (subs) subs.delete(cb);
    };
  }
}

export const bookingsService = new MockBookingsAdapter();
