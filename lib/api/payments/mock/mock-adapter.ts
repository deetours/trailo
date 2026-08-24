import type { PaymentsService, PaymentLinkInput, PaymentListFilters } from '../service';
import type { Payment } from '@/types/payment';
import { mockPayments } from './mock-data';
import { bookingsService } from '../../bookings/mock/mock-adapter';

// A booking is treated as confirmed once at least this fraction of its
// totalAmount has been collected — the deposit-confirms-booking threshold
// called out in the bookings state machine (see the domain README in the
// build spec: intent -> pending-payment -> confirmed at >=30% paid).
const DEPOSIT_CONFIRM_THRESHOLD = 0.3;

class MockPaymentsAdapter implements PaymentsService {
  private payments: Payment[] = [...mockPayments];
  private listSubscribers = new Map<string, Set<(p: Payment[]) => void>>();
  private bookingSubscribers = new Map<string, Set<(p: Payment[]) => void>>();

  private notifyAllLists() {
    this.listSubscribers.forEach((subs, key) => {
      const { businessId, filters } = JSON.parse(key);
      this.listPayments(businessId, filters).then(res => subs.forEach(cb => cb(res)));
    });
  }

  private notifyBookingPayments(bookingId: string) {
    const subs = this.bookingSubscribers.get(bookingId);
    if (subs) {
      this.listPaymentsForBooking(bookingId).then(res => subs.forEach(cb => cb(res)));
    }
  }

  async listPayments(businessId: string, filters?: PaymentListFilters): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    let result = this.payments.filter(p => p.businessId === businessId);

    if (filters?.bookingId) {
      result = result.filter(p => p.bookingId === filters.bookingId);
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPayment(id: string): Promise<Payment | null> {
    return this.payments.find(p => p.id === id) || null;
  }

  async listPaymentsForBooking(bookingId: string): Promise<Payment[]> {
    return this.payments
      .filter(p => p.bookingId === bookingId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPaymentLink(businessId: string, bookingId: string, input: PaymentLinkInput): Promise<Payment> {
    const now = new Date().toISOString();
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      businessId,
      bookingId,
      amount: input.amount,
      currency: input.currency,
      type: input.type,
      status: 'pending',
      linkUrl: '',
      createdAt: now,
      updatedAt: now,
    };
    payment.linkUrl = `https://pay.mock.trailo.app/${payment.id}`;
    this.payments.push(payment);

    const existingForBooking = this.payments.filter(p => p.bookingId === bookingId);
    if (existingForBooking.length === 1) {
      const booking = await bookingsService.getBooking(bookingId);
      if (booking && booking.status === 'intent') {
        await bookingsService.updateBookingStatus(bookingId, 'pending-payment');
      }
    }

    this.notifyAllLists();
    this.notifyBookingPayments(bookingId);
    return payment;
  }

  async markPaymentPaid(id: string): Promise<Payment> {
    const payment = this.payments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');
    if (payment.type === 'refund') throw new Error('Refund transactions cannot be marked paid');
    if (payment.status === 'paid') return payment;

    // Demo-only simulation of a payment succeeding. There is no real payment
    // gateway or webhook in this codebase — this is only ever triggered by
    // an explicit, honestly-labeled "Mark as paid (demo)" button in the UI.
    const now = new Date().toISOString();
    payment.status = 'paid';
    payment.paidAt = now;
    payment.updatedAt = now;

    const booking = await bookingsService.adjustAmountPaid(payment.bookingId, payment.amount);

    const isOpenStatus = booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'confirmed';
    if (isOpenStatus && booking.totalAmount > 0 && booking.amountPaid >= booking.totalAmount * DEPOSIT_CONFIRM_THRESHOLD) {
      await bookingsService.updateBookingStatus(booking.id, 'confirmed');
    }

    this.notifyAllLists();
    this.notifyBookingPayments(payment.bookingId);
    return payment;
  }

  async refundPayment(id: string, amount: number): Promise<Payment> {
    const original = this.payments.find(p => p.id === id);
    if (!original) throw new Error('Payment not found');
    if (original.status !== 'paid' && original.status !== 'partially-refunded') {
      throw new Error('Only paid payments can be refunded');
    }
    if (amount <= 0) throw new Error('Refund amount must be positive');

    // Refunds are meant to be admin-only in the real product per the audit
    // this phase was built for — there's no role/permission system in this
    // codebase yet, so the action is left available to everyone here. Gate
    // it on an approval role once one exists.
    const now = new Date().toISOString();
    const refund: Payment = {
      id: `pay_${Date.now()}`,
      businessId: original.businessId,
      bookingId: original.bookingId,
      amount,
      currency: original.currency,
      type: 'refund',
      status: 'refunded',
      paidAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.payments.push(refund);

    // Reflect the refund back on the original payment's own status. Payment
    // has no field linking a refund to the payment it came from, so this
    // compares only this single refund's amount against the original — not
    // a running total across multiple partial refunds of the same payment.
    original.status = amount >= original.amount ? 'refunded' : 'partially-refunded';
    original.updatedAt = now;

    await bookingsService.adjustAmountPaid(original.bookingId, -amount);

    this.notifyAllLists();
    this.notifyBookingPayments(original.bookingId);
    return refund;
  }

  subscribeToPayments(businessId: string, filters: PaymentListFilters, cb: (p: Payment[]) => void): () => void {
    const key = JSON.stringify({ businessId, filters });
    if (!this.listSubscribers.has(key)) this.listSubscribers.set(key, new Set());
    this.listSubscribers.get(key)!.add(cb);
    this.listPayments(businessId, filters).then(cb);
    return () => {
      const subs = this.listSubscribers.get(key);
      if (subs) subs.delete(cb);
    };
  }

  subscribeToBookingPayments(bookingId: string, cb: (p: Payment[]) => void): () => void {
    if (!this.bookingSubscribers.has(bookingId)) this.bookingSubscribers.set(bookingId, new Set());
    this.bookingSubscribers.get(bookingId)!.add(cb);
    this.listPaymentsForBooking(bookingId).then(cb);
    return () => {
      const subs = this.bookingSubscribers.get(bookingId);
      if (subs) subs.delete(cb);
    };
  }
}

export const paymentsService = new MockPaymentsAdapter();
