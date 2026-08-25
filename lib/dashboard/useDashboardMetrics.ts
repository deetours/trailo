'use client';

import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';
import { usePayments } from '@/lib/api/payments/hooks/usePayments';
import { useNow } from './useNow';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export type TrendDirection = 'up' | 'down' | 'flat';

export interface MetricTrend {
  direction: TrendDirection;
  label: string;
}

export interface DashboardMetrics {
  revenue: { value: number; currency: string; trend: MetricTrend };
  bookings: { value: number; trend: MetricTrend };
  newLeads: { value: number; trend: MetricTrend };
  /** null when there are no leads yet — render "—", never "0%" or "Infinity%". */
  conversionRate: { value: number | null; label: string };
  isLoading: boolean;
}

function withinWindow(iso: string | undefined, from: number, windowMs: number): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t <= from && t > from - windowMs;
}

function computeTrend(current: number, previous: number): MetricTrend {
  if (previous === 0) {
    if (current === 0) return { direction: 'flat', label: '—' };
    return { direction: 'up', label: 'New' };
  }
  const pct = ((current - previous) / previous) * 100;
  if (Math.round(pct) === 0) return { direction: 'flat', label: '0%' };
  return {
    direction: pct > 0 ? 'up' : 'down',
    label: `${pct > 0 ? '+' : ''}${Math.round(pct)}%`,
  };
}

/**
 * Revenue/bookings/leads/conversion all derive from the same usePayments/
 * useBookings/useLeads hooks so the numbers can't drift between zones that
 * show related figures (metrics row vs. attention vs. performance later).
 */
export function useDashboardMetrics(businessId: string): DashboardMetrics {
  const { leads, isLoading: leadsLoading } = useLeads(businessId);
  const { bookings, isLoading: bookingsLoading } = useBookings(businessId);
  const { payments, isLoading: paymentsLoading } = usePayments(businessId);

  const now = useNow();

  const paidThisWeek = payments.filter((p) => p.status === 'paid' && withinWindow(p.paidAt, now, WEEK_MS));
  const paidPrevWeek = payments.filter((p) => p.status === 'paid' && withinWindow(p.paidAt, now - WEEK_MS, WEEK_MS));
  const revenueThisWeek = paidThisWeek.reduce((sum, p) => sum + p.amount, 0);
  const revenuePrevWeek = paidPrevWeek.reduce((sum, p) => sum + p.amount, 0);

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const bookingsCreatedThisWeek = activeBookings.filter((b) => withinWindow(b.createdAt, now, WEEK_MS));
  const bookingsCreatedPrevWeek = activeBookings.filter((b) => withinWindow(b.createdAt, now - WEEK_MS, WEEK_MS));

  const newLeadsThisWeek = leads.filter((l) => withinWindow(l.createdAt, now, WEEK_MS));
  const newLeadsPrevWeek = leads.filter((l) => withinWindow(l.createdAt, now - WEEK_MS, WEEK_MS));

  const currency = payments[0]?.currency || 'INR';
  const conversionPct = leads.length === 0 ? null : (bookings.length / leads.length) * 100;

  return {
    revenue: {
      value: revenueThisWeek,
      currency,
      trend: computeTrend(revenueThisWeek, revenuePrevWeek),
    },
    bookings: {
      value: activeBookings.length,
      trend: computeTrend(bookingsCreatedThisWeek.length, bookingsCreatedPrevWeek.length),
    },
    newLeads: {
      value: newLeadsThisWeek.length,
      trend: computeTrend(newLeadsThisWeek.length, newLeadsPrevWeek.length),
    },
    conversionRate: {
      value: conversionPct,
      label: conversionPct === null ? '—' : `${Math.round(conversionPct)}%`,
    },
    isLoading: leadsLoading || bookingsLoading || paymentsLoading,
  };
}
