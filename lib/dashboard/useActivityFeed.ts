'use client';

import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';
import { usePayments } from '@/lib/api/payments/hooks/usePayments';

const FEED_LIMIT = 10;

export type ActivityKind = 'lead' | 'booking' | 'payment';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  description: string;
  createdAt: string;
  href: string;
}

/**
 * Reuses the shape leads already model for their own history
 * (LeadTimelineEvent[] — types/lead.ts) as the pattern for this feed rather
 * than inventing a new activity-event type, per docs/DASHBOARD_PLAN.md §13.
 */
export function useActivityFeed(businessId: string) {
  const { leads, isLoading: leadsLoading } = useLeads(businessId);
  const { bookings, isLoading: bookingsLoading } = useBookings(businessId);
  const { payments, isLoading: paymentsLoading } = usePayments(businessId);

  const items: ActivityItem[] = [];

  for (const lead of leads) {
    for (const event of lead.timeline) {
      items.push({
        id: `lead-event-${event.id}`,
        kind: 'lead',
        description: event.type === 'created' ? `New lead: ${lead.name}` : `${lead.name} — ${event.description}`,
        createdAt: event.createdAt,
        href: `/dashboard/leads/${lead.id}`,
      });
    }
  }

  for (const booking of bookings) {
    items.push({
      id: `booking-created-${booking.id}`,
      kind: 'booking',
      description: `New booking — ${booking.paxCount} pax`,
      createdAt: booking.createdAt,
      href: `/dashboard/bookings/${booking.id}`,
    });
  }

  for (const payment of payments) {
    if (payment.status === 'paid' && payment.paidAt) {
      items.push({
        id: `payment-paid-${payment.id}`,
        kind: 'payment',
        description: `Payment received — ${payment.currency} ${payment.amount.toLocaleString()}`,
        createdAt: payment.paidAt,
        href: `/dashboard/bookings/${payment.bookingId}`,
      });
    }
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    items: items.slice(0, FEED_LIMIT),
    isLoading: leadsLoading || bookingsLoading || paymentsLoading,
  };
}
