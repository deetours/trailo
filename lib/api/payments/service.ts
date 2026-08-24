import type { Payment, PaymentStatus, PaymentType } from '@/types/payment';

export interface PaymentLinkInput {
  amount: number;
  currency: string;
  type: PaymentType;
}

export interface PaymentListFilters {
  bookingId?: string;
  status?: PaymentStatus | 'all';
}

export interface PaymentsService {
  listPayments(businessId: string, filters?: PaymentListFilters): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | null>;
  listPaymentsForBooking(bookingId: string): Promise<Payment[]>;
  /**
   * Creates a pending payment request with a mock link. If this is the
   * booking's first payment, flips the booking from `intent` to
   * `pending-payment`.
   */
  createPaymentLink(businessId: string, bookingId: string, input: PaymentLinkInput): Promise<Payment>;
  /**
   * Demo-only simulation of a payment succeeding — there is no real payment
   * gateway or webhook wired into this codebase. Marks the payment `paid`,
   * credits the booking's `amountPaid`, and confirms the booking once the
   * 30% deposit threshold (see DEPOSIT_CONFIRM_THRESHOLD in the adapter) is
   * met.
   */
  markPaymentPaid(id: string): Promise<Payment>;
  /**
   * Records a refund as its own distinct, clearly-labeled `Payment`
   * (type: 'refund', status: 'refunded') and debits the booking's
   * `amountPaid`. Refunds should be admin-only in the real product — see the
   * one-line note in the adapter; there is no role/permission system yet so
   * this is not gated here.
   */
  refundPayment(id: string, amount: number): Promise<Payment>;
  subscribeToPayments(businessId: string, filters: PaymentListFilters, cb: (p: Payment[]) => void): () => void;
  subscribeToBookingPayments(bookingId: string, cb: (p: Payment[]) => void): () => void;
}
