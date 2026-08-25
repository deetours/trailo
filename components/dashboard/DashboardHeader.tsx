'use client';

import { Plus, ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import type { BusinessStateFlags } from '@/lib/dashboard/useBusinessState';

interface DashboardHeaderProps {
  name: string;
  businessId: string;
  state: BusinessStateFlags;
}

export default function DashboardHeader({ name, businessId, state }: DashboardHeaderProps) {
  const { result: draftResult } = useTrips(businessId, {
    status: 'draft',
    pageSize: 1,
    sortBy: 'updatedAt',
    sortDir: 'desc',
  });
  const nextDraft = draftResult.items[0];

  let cta = { label: 'Plan new trip', href: '/dashboard/trips/new', icon: Plus };
  if (!state.hasTrips) {
    cta = { label: 'Create your first trip', href: '/dashboard/trips/new', icon: Plus };
  } else if (!state.hasPublishedTrip && nextDraft) {
    cta = { label: 'Publish your trip', href: `/dashboard/trips/${nextDraft.id}`, icon: ArrowRight };
  }

  const CtaIcon = cta.icon;

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
          Welcome back, {name}
        </h1>
        <p className="text-muted-foreground">Here is what&apos;s happening with your journeys.</p>
      </div>
      <MagneticButton href={cta.href} variant="primary" className="py-2.5 px-5">
        <span className="flex items-center gap-2">
          <CtaIcon size={16} /> {cta.label}
        </span>
      </MagneticButton>
    </header>
  );
}
