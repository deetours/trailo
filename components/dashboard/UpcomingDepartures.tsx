'use client';

import { CalendarDays, Users, Pencil } from 'lucide-react';
import Card from '@/components/Card';
import { cn } from '@/lib/cn';
import { useUpcomingDepartures } from '@/lib/dashboard/useUpcomingDepartures';
import type { DepartureStatus } from '@/types/departure';

function statusBadgeClass(status: DepartureStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'full':
      return 'bg-warning/10 text-warning border border-warning/20';
    case 'completed':
      return 'bg-muted text-muted-foreground border border-border';
    default:
      return 'bg-accent/10 text-accent border border-accent/20';
  }
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

export default function UpcomingDepartures({ businessId }: { businessId: string }) {
  const { departures, hasAnyTrips, isLoading } = useUpcomingDepartures(businessId);

  if (!hasAnyTrips) return null;

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Upcoming departures</h2>
      {isLoading ? (
        <div className="h-20 rounded-xl bg-card border border-border animate-pulse" />
      ) : departures.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No departures scheduled — add dates to your published trips.
        </div>
      ) : (
        <div className="grid gap-3">
          {departures.map((departure) => (
            <Card
              key={departure.id}
              href={`/dashboard/trips/${departure.tripId}`}
              rounded="xl"
              className="p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{departure.tripName}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatDateRange(departure.startDate, departure.endDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {departure.booked}/{departure.capacity} booked
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest', statusBadgeClass(departure.status))}>
                  {departure.status}
                </span>
                <Pencil size={14} className="text-muted-foreground hidden md:block" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
