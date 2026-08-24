import { useState, useEffect } from 'react';
import { paymentsService } from '../mock/mock-adapter';
import type { Payment } from '@/types/payment';
import type { PaymentListFilters } from '../service';

export function usePayments(businessId: string, filters: PaymentListFilters = {}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = paymentsService.subscribeToPayments(businessId, filters, (p) => {
      setPayments(p);
      setIsLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, JSON.stringify(filters)]);

  return { payments, isLoading };
}
