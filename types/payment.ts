export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially-refunded';
export type PaymentType = 'deposit' | 'balance' | 'full' | 'refund';

export interface Payment {
  id: string;
  businessId: string;
  bookingId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  linkUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
