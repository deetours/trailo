'use client';

import { Gauge, Wallet } from 'lucide-react';
import Card from '@/components/Card';
import { usePerformanceMetrics } from '@/lib/dashboard/usePerformanceMetrics';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function PerformanceSection({ businessId }: { businessId: string }) {
  const { occupancyRate, averageBookingValue, hasData, isLoading } = usePerformanceMetrics(businessId);

  if (isLoading || !hasData) return null;

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card rounded="2xl" className="p-6 flex items-center gap-4">
          <span className="shrink-0 rounded-lg bg-muted p-3 text-foreground">
            <Gauge size={20} />
          </span>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Occupancy rate</p>
            <p className="font-display font-bold text-2xl text-foreground">
              {occupancyRate === null ? '—' : `${Math.round(occupancyRate)}%`}
            </p>
          </div>
        </Card>
        <Card rounded="2xl" className="p-6 flex items-center gap-4">
          <span className="shrink-0 rounded-lg bg-muted p-3 text-foreground">
            <Wallet size={20} />
          </span>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Average booking value</p>
            <p className="font-display font-bold text-2xl text-foreground">
              {averageBookingValue === null ? '—' : formatMoney(averageBookingValue.value, averageBookingValue.currency)}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
