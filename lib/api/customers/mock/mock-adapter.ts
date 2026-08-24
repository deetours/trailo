import type { CustomersService, CustomerInput, CustomerPatch } from '../service';
import type { Customer, CustomerNote } from '@/types/customer';
import { mockCustomers } from './mock-data';

class MockCustomersAdapter implements CustomersService {
  private customers: Customer[] = [...mockCustomers];
  private listSubscribers = new Map<string, Set<(c: Customer[]) => void>>();
  private customerSubscribers = new Map<string, Set<(c: Customer | null) => void>>();

  private notifyList(businessId: string) {
    const subs = this.listSubscribers.get(businessId);
    if (subs) {
      this.listCustomers(businessId).then(res => subs.forEach(cb => cb(res)));
    }
  }

  private notifyCustomer(id: string) {
    const subs = this.customerSubscribers.get(id);
    if (subs) {
      const customer = this.customers.find(c => c.id === id) || null;
      subs.forEach(cb => cb(customer));
    }
  }

  async listCustomers(businessId: string): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.customers
      .filter(c => c.businessId === businessId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.customers.find(c => c.id === id) || null;
  }

  async findByPhone(businessId: string, phone: string): Promise<Customer | null> {
    return this.customers.find(c => c.businessId === businessId && c.phone === phone) || null;
  }

  async findOrCreateByPhone(businessId: string, input: CustomerInput, leadId?: string): Promise<Customer> {
    const existing = await this.findByPhone(businessId, input.phone);
    if (existing) {
      if (leadId && !existing.leadId) {
        existing.leadId = leadId;
        existing.updatedAt = new Date().toISOString();
        this.notifyCustomer(existing.id);
        this.notifyList(businessId);
      }
      return existing;
    }

    const now = new Date().toISOString();
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      businessId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      leadId,
      notes: [],
      createdAt: now,
      updatedAt: now,
    };
    this.customers.push(customer);
    this.notifyList(businessId);
    return customer;
  }

  async addNote(customerId: string, text: string): Promise<Customer> {
    const customer = this.customers.find(c => c.id === customerId);
    if (!customer) throw new Error('Customer not found');
    const note: CustomerNote = {
      id: `note_${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
    };
    customer.notes.push(note);
    customer.updatedAt = new Date().toISOString();
    this.notifyCustomer(customer.id);
    this.notifyList(customer.businessId);
    return customer;
  }

  async updateCustomer(id: string, patch: CustomerPatch): Promise<Customer> {
    const customer = this.customers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    Object.assign(customer, patch, { updatedAt: new Date().toISOString() });
    this.notifyCustomer(customer.id);
    this.notifyList(customer.businessId);
    return customer;
  }

  subscribeToCustomers(businessId: string, cb: (c: Customer[]) => void): () => void {
    if (!this.listSubscribers.has(businessId)) this.listSubscribers.set(businessId, new Set());
    this.listSubscribers.get(businessId)!.add(cb);
    this.listCustomers(businessId).then(cb);
    return () => {
      const subs = this.listSubscribers.get(businessId);
      if (subs) subs.delete(cb);
    };
  }

  subscribeToCustomer(id: string, cb: (c: Customer | null) => void): () => void {
    if (!this.customerSubscribers.has(id)) this.customerSubscribers.set(id, new Set());
    this.customerSubscribers.get(id)!.add(cb);
    this.getCustomer(id).then(cb);
    return () => {
      const subs = this.customerSubscribers.get(id);
      if (subs) subs.delete(cb);
    };
  }
}

export const customersService = new MockCustomersAdapter();
