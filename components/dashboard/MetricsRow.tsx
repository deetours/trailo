'use client';

import { Wallet, CalendarCheck, Users, Percent } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { STAGGER } from '@/lib/motion';
import { useDashboardMetrics } from '@/lib/dashboard/useDashboardMetrics';
import MetricCard from './MetricCard';

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function MetricsRow({ businessId }: { businessId: string }) {
  const metrics = useDashboardMetrics(businessId);

  if (metrics.isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[104px] rounded-2xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-4" stagger={STAGGER.base} y={16}>
      <MetricCard
        label="Revenue (this week)"
        value={formatMoney(metrics.revenue.value, metrics.revenue.currency)}
        trend={metrics.revenue.trend}
        icon={Wallet}
        href="/dashboard/payments"
      />
      <MetricCard
        label="Bookings"
        value={metrics.bookings.value.toLocaleString()}
        trend={metrics.bookings.trend}
        icon={CalendarCheck}
        href="/dashboard/bookings"
      />
      <MetricCard
        label="New leads"
        value={metrics.newLeads.value.toLocaleString()}
        trend={metrics.newLeads.trend}
        icon={Users}
        href="/dashboard/leads"
      />
      <MetricCard
        label="Conversion rate"
        value={metrics.conversionRate.label}
        icon={Percent}
        href="/dashboard/leads"
      />
    </Reveal>
  );
}
