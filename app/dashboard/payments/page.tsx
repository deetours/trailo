'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import { usePayments } from '@/lib/api/payments/hooks/usePayments';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBooking } from '@/lib/api/bookings/hooks/useBooking';
import type { Payment, PaymentStatus } from '@/types/payment';
import { cn } from '@/lib/cn';

const STATUS_TABS: (PaymentStatus | 'all')[] = ['all', 'pending', 'paid', 'failed', 'refunded', 'partially-refunded'];

function statusBadgeClass(status: PaymentStatus) {
  switch (status) {
    case 'paid':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'failed':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'refunded':
    case 'partially-refunded':
      return 'bg-accent/10 text-accent border border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

function PaymentRow({ payment }: { payment: Payment }) {
  const { booking } = useBooking(payment.bookingId);

  return (
    <Card rounded="xl" className="p-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-bold text-foreground capitalize">{payment.type}</span>
          <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', statusBadgeClass(payment.status))}>
            {payment.status.replace('-', ' ')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{formatMoney(payment.amount, payment.currency)}</span>
          <Link href={`/dashboard/bookings/${payment.bookingId}`} className="text-accent hover:underline">
            {booking ? `Booking · ${booking.paxCount} pax` : 'View booking'}
          </Link>
          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}

function PaymentsLedger() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();

  const status = (searchParams.get('status') as PaymentStatus | 'all') || 'all';

  const { payments, isLoading } = usePayments(session?.businessId || '', { status });

  const updateFilters = (updates: { status?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) params.set('status', updates.status);
    router.replace(`/dashboard/payments?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
          Payments
        </h1>
        <p className="text-muted-foreground">Every payment request, collection, and refund across your bookings.</p>
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
        ) : payments.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No payments found</h3>
            <p className="text-muted-foreground">
              {status === 'all' ? 'No payments have been requested yet.' : `No payments with status "${status.replace('-', ' ')}".`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map(payment => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentsLedger />
    </Suspense>
  );
}
