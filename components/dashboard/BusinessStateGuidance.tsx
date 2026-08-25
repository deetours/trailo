'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Card from '@/components/Card';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import type { BusinessStateFlags } from '@/lib/dashboard/useBusinessState';

interface Guidance {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

/**
 * Picks the single most actionable gap rather than following a strict
 * A→F funnel — real data (leads arriving before a trip is published) can
 * skip steps a linear model assumes. See docs/DASHBOARD_PLAN.md §5.
 */
function pickGuidance(state: BusinessStateFlags, firstDraftId?: string): Guidance | null {
  if (state.hasEstablishedVolume) return null;

  if (!state.hasTrips) {
    return {
      title: 'Create your first trip',
      description: 'Trips are what customers browse and book. Build your first itinerary to get started.',
      actionLabel: 'Create a trip',
      actionHref: '/dashboard/trips/new',
    };
  }

  if (!state.hasPublishedTrip && state.hasLeads) {
    return {
      title: 'Leads are waiting on an unpublished trip',
      description: 'You already have interested leads, but nothing is published yet — publish your trip so you can convert them.',
      actionLabel: 'Publish your trip',
      actionHref: firstDraftId ? `/dashboard/trips/${firstDraftId}` : '/dashboard/trips',
    };
  }

  if (!state.hasPublishedTrip) {
    return {
      title: 'Publish your trip to start getting bookings',
      description: 'Your trip is still a draft — publish it so customers can find and book it.',
      actionLabel: 'Publish your trip',
      actionHref: firstDraftId ? `/dashboard/trips/${firstDraftId}` : '/dashboard/trips',
    };
  }

  if (!state.hasLeads) {
    return {
      title: 'Share your landing page to start getting leads',
      description: 'Your trip is live — share its page so inquiries can start coming in.',
      actionLabel: 'View trips',
      actionHref: '/dashboard/trips',
    };
  }

  if (!state.hasBookings) {
    return {
      title: 'Convert your leads into bookings',
      description: 'You have interested leads — follow up to turn them into confirmed bookings.',
      actionLabel: 'View leads',
      actionHref: '/dashboard/leads',
    };
  }

  return null;
}

export default function BusinessStateGuidance({ businessId, state }: { businessId: string; state: BusinessStateFlags }) {
  const { result: draftResult } = useTrips(businessId, {
    status: 'draft',
    pageSize: 1,
    sortBy: 'updatedAt',
    sortDir: 'desc',
  });

  const guidance = pickGuidance(state, draftResult.items[0]?.id);
  if (!guidance) return null;

  return (
    <Card rounded="2xl" className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">{guidance.title}</h3>
        <p className="text-muted-foreground text-sm">{guidance.description}</p>
      </div>
      <Link
        href={guidance.actionHref}
        className="shrink-0 inline-flex items-center gap-2 text-sm font-medium bg-accent text-accent-foreground px-4 py-2.5 rounded-full hover:opacity-90 transition-opacity"
      >
        {guidance.actionLabel} <ArrowRight size={14} />
      </Link>
    </Card>
  );
}
