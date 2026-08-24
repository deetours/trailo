import type { Trip, TripStatus, TripSection } from '@/types/trip';

export interface TripListFilters {
  status?: TripStatus | 'all';
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'updatedAt' | 'name' | 'status';
  sortDir?: 'asc' | 'desc';
}

export interface TripListResult {
  items: Trip[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TripsService {
  listTrips(businessId: string, filters?: TripListFilters): Promise<TripListResult>;
  getTrip(id: string): Promise<Trip | null>;
  createTrip(businessId: string, input: {
    name: string;
    tripType: Trip['basicInfo']['tripType'];
    destinationRegion: string;
    durationDays: number;
    durationNights: number;
  }): Promise<Trip>;
  updateTripSection<K extends TripSection>(id: string, section: K, data: Trip[K]): Promise<Trip>;
  archiveTrip(id: string): Promise<Trip>;
  restoreTrip(id: string): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;
  duplicateTrip(id: string): Promise<Trip>;
  bulkUpdateStatus(ids: string[], status: TripStatus): Promise<void>;
  subscribeToTripList(businessId: string, filters: TripListFilters, cb: (r: TripListResult) => void): () => void;
  subscribeToTrip(id: string, cb: (t: Trip | null) => void): () => void;
}
