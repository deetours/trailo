export type BookingStatus = 'intent' | 'pending-payment' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  businessId: string;
  tripId: string;
  departureId: string;
  customerId: string;
  leadId?: string;
  paxCount: number;
  totalAmount: number;
  currency: string;
  amountPaid: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
