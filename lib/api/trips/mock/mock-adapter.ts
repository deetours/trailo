import type { TripsService, TripListFilters, TripListResult } from '../service';
import type { Trip, TripStatus, TripSection } from '@/types/trip';
import { mockTrips } from './mock-data';

class MockTripsAdapter implements TripsService {
  private trips: Trip[] = [...mockTrips];
  private listSubscribers = new Map<string, Set<(r: TripListResult) => void>>();
  private tripSubscribers = new Map<string, Set<(t: Trip | null) => void>>();

  private notifyList(businessId: string, filters: TripListFilters) {
    const key = JSON.stringify({ businessId, filters });
    const subs = this.listSubscribers.get(key);
    if (subs) {
      this.listTrips(businessId, filters).then(res => subs.forEach(cb => cb(res)));
    }
  }

  private notifyTrip(id: string) {
    const subs = this.tripSubscribers.get(id);
    if (subs) {
      const trip = this.trips.find(t => t.id === id) || null;
      subs.forEach(cb => cb(trip));
    }
  }
  
  private notifyAll() {
    this.listSubscribers.forEach((subs, key) => {
      const { businessId, filters } = JSON.parse(key);
      this.listTrips(businessId, filters).then(res => subs.forEach(cb => cb(res)));
    });
  }

  async listTrips(businessId: string, filters?: TripListFilters): Promise<TripListResult> {
    let result = this.trips.filter(t => t.businessId === businessId);
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.basicInfo.name.toLowerCase().includes(q));
    }
    
    // sort
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const start = (page - 1) * pageSize;
    
    await new Promise(resolve => setTimeout(resolve, 200));

    return {
      items: result.slice(start, start + pageSize),
      total: result.length,
      page,
      pageSize
    };
  }

  async getTrip(id: string): Promise<Trip | null> {
    const trip = this.trips.find(t => t.id === id);
    return trip ? { ...trip } : null;
  }

  async getTripBySlug(slug: string): Promise<Trip | null> {
    const trip = this.trips.find(t => t.slug === slug);
    return trip ? { ...trip } : null;
  }

  async createTrip(businessId: string, input: { name: string; tripType: Trip['basicInfo']['tripType']; destinationRegion: string; durationDays: number; durationNights: number; }): Promise<Trip> {
    const trip: Trip = {
      id: `t_${Date.now()}`,
      businessId,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'draft',
      basicInfo: { ...input },
      story: { overview: '', highlights: [] },
      itinerary: [],
      media: [],
      pricing: { model: 'per-person', currency: 'INR', depositRequired: false },
      logistics: { transportProvided: false, inclusions: [], exclusions: [] },
      policies: { cancellationPolicy: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.trips.push(trip);
    this.notifyAll();
    return trip;
  }

  async updateTripSection<K extends TripSection>(id: string, section: K, data: Trip[K]): Promise<Trip> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    trip[section] = data;
    trip.updatedAt = new Date().toISOString();
    this.notifyTrip(id);
    this.notifyAll();
    return trip;
  }

  async archiveTrip(id: string): Promise<Trip> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    trip.status = 'archived';
    trip.updatedAt = new Date().toISOString();
    this.notifyTrip(id);
    this.notifyAll();
    return trip;
  }

  async restoreTrip(id: string): Promise<Trip> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    trip.status = 'draft';
    trip.updatedAt = new Date().toISOString();
    this.notifyTrip(id);
    this.notifyAll();
    return trip;
  }

  async deleteTrip(id: string): Promise<void> {
    this.trips = this.trips.filter(t => t.id !== id);
    this.notifyTrip(id);
    this.notifyAll();
  }

  async duplicateTrip(id: string): Promise<Trip> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    const newTrip = { ...trip, id: `t_${Date.now()}`, basicInfo: { ...trip.basicInfo, name: `${trip.basicInfo.name} (Copy)` } };
    this.trips.push(newTrip);
    this.notifyAll();
    return newTrip;
  }

  async bulkUpdateStatus(ids: string[], status: TripStatus): Promise<void> {
    this.trips.forEach(t => {
      if (ids.includes(t.id)) {
        t.status = status;
        t.updatedAt = new Date().toISOString();
        this.notifyTrip(t.id);
      }
    });
    this.notifyAll();
  }

  subscribeToTripList(businessId: string, filters: TripListFilters, cb: (r: TripListResult) => void): () => void {
    const key = JSON.stringify({ businessId, filters });
    if (!this.listSubscribers.has(key)) this.listSubscribers.set(key, new Set());
    this.listSubscribers.get(key)!.add(cb);
    this.listTrips(businessId, filters).then(cb);
    return () => {
      const subs = this.listSubscribers.get(key);
      if (subs) subs.delete(cb);
    };
  }

  subscribeToTrip(id: string, cb: (t: Trip | null) => void): () => void {
    if (!this.tripSubscribers.has(id)) this.tripSubscribers.set(id, new Set());
    this.tripSubscribers.get(id)!.add(cb);
    this.getTrip(id).then(cb);
    return () => {
      const subs = this.tripSubscribers.get(id);
      if (subs) subs.delete(cb);
    };
  }
}

export const tripsService = new MockTripsAdapter();
