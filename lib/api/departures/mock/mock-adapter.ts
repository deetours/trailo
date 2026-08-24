import type { DeparturesService, DepartureInput } from '../service';
import type { Departure, DepartureStatus } from '@/types/departure';
import { mockDepartures } from './mock-data';

class MockDeparturesAdapter implements DeparturesService {
  private departures: Departure[] = [...mockDepartures];
  private subscribers = new Map<string, Set<(d: Departure[]) => void>>();

  private notify(tripId: string) {
    const subs = this.subscribers.get(tripId);
    if (subs) {
      this.listDepartures(tripId).then(res => subs.forEach(cb => cb(res)));
    }
  }

  async listDepartures(tripId: string): Promise<Departure[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.departures
      .filter(d => d.tripId === tripId)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  async getDeparture(id: string): Promise<Departure | null> {
    return this.departures.find(d => d.id === id) || null;
  }

  async createDeparture(tripId: string, input: DepartureInput): Promise<Departure> {
    const now = new Date().toISOString();
    const departure: Departure = {
      id: `dep_${Date.now()}`,
      tripId,
      booked: 0,
      status: 'scheduled',
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    this.departures.push(departure);
    this.notify(tripId);
    return departure;
  }

  async updateDeparture(id: string, patch: Partial<DepartureInput>): Promise<Departure> {
    const departure = this.departures.find(d => d.id === id);
    if (!departure) throw new Error('Departure not found');
    Object.assign(departure, patch, { updatedAt: new Date().toISOString() });
    this.notify(departure.tripId);
    return departure;
  }

  async updateDepartureStatus(id: string, status: DepartureStatus): Promise<Departure> {
    const departure = this.departures.find(d => d.id === id);
    if (!departure) throw new Error('Departure not found');
    departure.status = status;
    departure.updatedAt = new Date().toISOString();
    this.notify(departure.tripId);
    return departure;
  }

  async adjustBookedCount(id: string, delta: number): Promise<Departure> {
    const departure = this.departures.find(d => d.id === id);
    if (!departure) throw new Error('Departure not found');
    departure.booked = Math.max(0, Math.min(departure.capacity, departure.booked + delta));
    departure.updatedAt = new Date().toISOString();
    this.notify(departure.tripId);
    return departure;
  }

  async deleteDeparture(id: string): Promise<void> {
    const departure = this.departures.find(d => d.id === id);
    if (!departure) return;
    this.departures = this.departures.filter(d => d.id !== id);
    this.notify(departure.tripId);
  }

  subscribeToDepartures(tripId: string, cb: (d: Departure[]) => void): () => void {
    if (!this.subscribers.has(tripId)) this.subscribers.set(tripId, new Set());
    this.subscribers.get(tripId)!.add(cb);
    this.listDepartures(tripId).then(cb);
    return () => {
      const subs = this.subscribers.get(tripId);
      if (subs) subs.delete(cb);
    };
  }
}

export const departuresService = new MockDeparturesAdapter();
