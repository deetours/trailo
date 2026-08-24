'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Users, CalendarDays } from 'lucide-react';
import Card from '@/components/Card';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import { useCustomer } from '@/lib/api/customers/hooks/useCustomer';
import { useDepartures } from '@/lib/api/departures/hooks/useDepartures';
import type { Booking, BookingStatus } from '@/types/booking';
import { cn } from '@/lib/cn';

const STATUS_TABS: (BookingStatus | 'all')[] = ['all', 'intent', 'pending-payment', 'confirmed', 'completed', 'cancelled'];

function statusBadgeClass(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'completed':
      return 'bg-muted text-muted-foreground border border-border';
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'pending-payment':
      return 'bg-accent/10 text-accent border border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

function BookingRow({ booking }: { booking: Booking }) {
  const { trip } = useTrip(booking.tripId);
  const { customer } = useCustomer(booking.customerId);
  const { departures } = useDepartures(booking.tripId);
  const departure = departures.find(d => d.id === booking.departureId);

  return (
    <Card href={`/dashboard/bookings/${booking.id}`} rounded="xl" className="p-6 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-foreground mb-1 truncate">
          {trip?.basicInfo?.name || 'Trip'}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{customer?.name || 'Customer'}</span>
          {departure && (
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {new Date(departure.startDate).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users size={14} /> {booking.paxCount} pax
          </span>
        </div>
      </div>
      <div className="flex flex-col md:items-end gap-2 shrink-0">
        <span className="text-sm text-foreground font-medium">
          {formatMoney(booking.amountPaid, booking.currency)} / {formatMoney(booking.totalAmount, booking.currency)}
        </span>
        <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest', statusBadgeClass(booking.status))}>
          {booking.status.replace('-', ' ')}
        </span>
      </div>
      <ArrowRight size={16} className="text-muted-foreground shrink-0 hidden md:block" />
    </Card>
  );
}

function BookingsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();

  const status = (searchParams.get('status') as BookingStatus | 'all') || 'all';

  const { bookings, isLoading } = useBookings(session?.businessId || '', { status });

  const updateFilters = (updates: { status?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) params.set('status', updates.status);
    router.replace(`/dashboard/bookings?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
          Bookings
        </h1>
        <p className="text-muted-foreground">Track every booking from first intent through to payment.</p>
      </header>

      <div className="flex items-center gap-6 border-b border-border pb-4 overflow-x-auto">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => updateFilters({ status: t })}
            className={cn(
              'pb-4 -mb-4 text-sm font-medium capitalize relative transition-colors border-b-2 whitespace-nowrap',
              status === t ? 'text-foreground border-accent' : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
            )}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {status === 'all' ? 'No bookings have been created yet.' : `No bookings with status "${status.replace('-', ' ')}".`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(booking => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingsList />
    </Suspense>
  );
}
