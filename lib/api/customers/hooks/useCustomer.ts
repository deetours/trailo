import { useState, useEffect } from 'react';
import { customersService } from '../mock/mock-adapter';
import type { Customer } from '@/types/customer';
import type { CustomerPatch } from '../service';

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = customersService.subscribeToCustomer(id, (c) => {
      setCustomer(c);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const addNote = (text: string) => customersService.addNote(id, text);
  const updateCustomer = (patch: CustomerPatch) => customersService.updateCustomer(id, patch);

  return { customer, isLoading, addNote, updateCustomer };
}
