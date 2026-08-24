import { useState, useEffect } from 'react';
import { customersService } from '../mock/mock-adapter';
import type { Customer } from '@/types/customer';

export function useCustomers(businessId: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = customersService.subscribeToCustomers(businessId, (c) => {
      setCustomers(c);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [businessId]);

  return { customers, isLoading };
}
