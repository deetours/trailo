import type { Departure, DepartureStatus } from '@/types/departure';

export interface DepartureInput {
  startDate: string;
  endDate: string;
  capacity: number;
  priceOverride?: number;
  guideName?: string;
  vehicleDetails?: string;
  notes?: string;
}

export interface DeparturesService {
  listDepartures(tripId: string): Promise<Departure[]>;
  getDeparture(id: string): Promise<Departure | null>;
  createDeparture(tripId: string, input: DepartureInput): Promise<Departure>;
  updateDeparture(id: string, patch: Partial<DepartureInput>): Promise<Departure>;
  updateDepartureStatus(id: string, status: DepartureStatus): Promise<Departure>;
  /**
   * Reserves or releases capacity against a departure. Bookings call this
   * with a positive delta when pax are reserved and a negative delta when a
   * booking is cancelled. Clamped to [0, capacity] — never goes negative or
   * over-books past capacity.
   */
  adjustBookedCount(id: string, delta: number): Promise<Departure>;
  deleteDeparture(id: string): Promise<void>;
  subscribeToDepartures(tripId: string, cb: (d: Departure[]) => void): () => void;
}
