export type DepartureStatus = 'scheduled' | 'confirmed' | 'full' | 'cancelled' | 'completed';

export interface Departure {
  id: string;
  tripId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  booked: number;
  priceOverride?: number;
  guideName?: string;
  vehicleDetails?: string;
  status: DepartureStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
