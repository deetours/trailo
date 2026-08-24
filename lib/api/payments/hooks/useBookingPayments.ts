import { useState, useEffect } from 'react';
import { paymentsService } from '../mock/mock-adapter';
import type { Payment } from '@/types/payment';
import type { PaymentLinkInput } from '../service';

export function useBookingPayments(bookingId: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = paymentsService.subscribeToBookingPayments(bookingId, (p) => {
      setPayments(p);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [bookingId]);

  const createPaymentLink = (businessId: string, input: PaymentLinkInput) =>
    paymentsService.createPaymentLink(businessId, bookingId, input);
  const markPaid = (paymentId: string) => paymentsService.markPaymentPaid(paymentId);
  const refund = (paymentId: string, amount: number) => paymentsService.refundPayment(paymentId, amount);

  return { payments, isLoading, createPaymentLink, markPaid, refund };
}
