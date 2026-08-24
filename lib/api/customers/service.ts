import type { Customer } from '@/types/customer';

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
}

export type CustomerPatch = Partial<Pick<Customer, 'name' | 'phone' | 'email' | 'preferences'>>;

export interface CustomersService {
  listCustomers(businessId: string): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  findByPhone(businessId: string, phone: string): Promise<Customer | null>;
  findOrCreateByPhone(businessId: string, input: CustomerInput, leadId?: string): Promise<Customer>;
  addNote(customerId: string, text: string): Promise<Customer>;
  updateCustomer(id: string, patch: CustomerPatch): Promise<Customer>;
  subscribeToCustomers(businessId: string, cb: (c: Customer[]) => void): () => void;
  subscribeToCustomer(id: string, cb: (c: Customer | null) => void): () => void;
}
