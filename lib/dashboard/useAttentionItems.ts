'use client';

import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { usePayments } from '@/lib/api/payments/hooks/usePayments';
import { useAllDepartures } from './useAllDepartures';
import { useNow } from './useNow';

const PENDING_PAYMENT_HOURS = 48;
const UNTOUCHED_LEAD_HOURS = 24;
const DEPARTURE_CAPACITY_THRESHOLD = 0.95;
const UPCOMING_DEPARTURE_DAYS = 7;

export type AttentionSeverity = 'red' | 'orange' | 'yellow';

export interface AttentionItem {
  id: string;
  severity: AttentionSeverity;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

function hoursSince(iso: string, from: number): number {
  return (from - new Date(iso).getTime()) / (1000 * 60 * 60);
}

const SEVERITY_ORDER: Record<AttentionSeverity, number> = { red: 0, orange: 1, yellow: 2 };

/**
 * Only surfaces things that need a decision — not a general activity feed.
 * See docs/DASHBOARD_PLAN.md §9 for the tier rules; the "conversion rate
 * below rolling average" yellow rule from that section is intentionally
 * omitted here since there's no historical time series to average over yet.
 */
export function useAttentionItems(businessId: string) {
  const { result: tripsResult, isLoading: tripsLoading } = useTrips(businessId, { pageSize: 200 });
  const { leads, isLoading: leadsLoading } = useLeads(businessId);
  const { payments, isLoading: paymentsLoading } = usePayments(businessId);
  const trips = tripsResult.items;
  const { departures, isLoading: departuresLoading } = useAllDepartures(trips.map((t) => t.id));

  const now = useNow();
  const items: AttentionItem[] = [];

  for (const payment of payments) {
    if (payment.status === 'pending' && hoursSince(payment.createdAt, now) > PENDING_PAYMENT_HOURS) {
      items.push({
        id: `payment-pending-${payment.id}`,
        severity: 'red',
        title: 'Payment pending',
        description: `${payment.currency} ${payment.amount.toLocaleString()} has been pending for over 48 hours`,
        actionLabel: 'Review payment',
        actionHref: `/dashboard/bookings/${payment.bookingId}`,
      });
    }
  }

  for (const lead of leads) {
    if (
      lead.nextActionAt &&
      new Date(lead.nextActionAt).getTime() < now &&
      lead.status !== 'converted' &&
      lead.status !== 'lost'
    ) {
      items.push({
        id: `lead-overdue-${lead.id}`,
        severity: 'red',
        title: `Follow-up overdue — ${lead.name}`,
        description: lead.nextActionNote || 'A scheduled follow-up has passed',
        actionLabel: 'Follow up now',
        actionHref: `/dashboard/leads/${lead.id}`,
      });
    }
  }

  for (const departure of departures) {
    if (departure.capacity > 0 && departure.booked / departure.capacity >= DEPARTURE_CAPACITY_THRESHOLD && departure.status !== 'full') {
      const trip = trips.find((t) => t.id === departure.tripId);
      items.push({
        id: `departure-capacity-${departure.id}`,
        severity: 'orange',
        title: `${trip?.basicInfo.name || 'Departure'} is nearly full`,
        description: `${departure.booked}/${departure.capacity} booked — mark it full or open more seats`,
        actionLabel: 'Review departure',
        actionHref: `/dashboard/trips/${departure.tripId}`,
      });
    }
  }

  for (const trip of trips) {
    if (trip.status === 'draft' && trip.itinerary.length === 0) {
      items.push({
        id: `trip-incomplete-${trip.id}`,
        severity: 'orange',
        title: `${trip.basicInfo.name} has no itinerary`,
        description: "This draft trip can't be published without at least one itinerary day",
        actionLabel: 'Add itinerary',
        actionHref: `/dashboard/trips/${trip.id}`,
      });
    }
  }

  for (const lead of leads) {
    if (lead.status === 'new' && hoursSince(lead.createdAt, now) > UNTOUCHED_LEAD_HOURS) {
      items.push({
        id: `lead-untouched-${lead.id}`,
        severity: 'orange',
        title: `${lead.name} hasn't been contacted`,
        description: `New lead from ${lead.source.replace('-', ' ')} is still untouched after 24 hours`,
        actionLabel: 'Contact lead',
        actionHref: `/dashboard/leads/${lead.id}`,
      });
    }
  }

  for (const departure of departures) {
    const daysUntil = (new Date(departure.startDate).getTime() - now) / (1000 * 60 * 60 * 24);
    if (daysUntil >= 0 && daysUntil <= UPCOMING_DEPARTURE_DAYS) {
      const trip = trips.find((t) => t.id === departure.tripId);
      items.push({
        id: `departure-upcoming-${departure.id}`,
        severity: 'yellow',
        title: `${trip?.basicInfo.name || 'Departure'} leaves soon`,
        description: `Departs ${new Date(departure.startDate).toLocaleDateString()} — ${departure.booked}/${departure.capacity} booked`,
        actionLabel: 'View departure',
        actionHref: `/dashboard/trips/${departure.tripId}`,
      });
    }
  }

  items.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return {
    items,
    isLoading: tripsLoading || leadsLoading || paymentsLoading || departuresLoading,
  };
}
