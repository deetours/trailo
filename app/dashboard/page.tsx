'use client';

import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import RouteEmptyState from '@/components/RouteEmptyState';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';

export default function DashboardPage() {
  const { session } = useSession();
  const { result } = useTrips(session?.businessId || '', { pageSize: 1, sortBy: 'updatedAt', sortDir: 'desc' });

  const nextTrip = result.items[0] || null;

  return (
    <div className="space-y-12">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Welcome back, {session?.user?.name || 'Organizer'}
          </h1>
          <p className="text-muted-foreground">Here is what&apos;s happening with your journeys.</p>
        </div>
        <MagneticButton href="/dashboard/trips/new" variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus size={16} /> Plan new trip
          </span>
        </MagneticButton>
      </header>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">Recently Updated</h2>
        
        {nextTrip ? (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col gap-4 items-start">
            <span className="text-xs uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1 rounded">
              {nextTrip.status}
            </span>
            <h3 className="text-2xl font-bold text-foreground">{nextTrip.basicInfo.name}</h3>
            <p className="text-muted-foreground">{nextTrip.basicInfo.destinationRegion} • {nextTrip.basicInfo.durationDays} Days</p>
            <Link href={`/dashboard/trips/${nextTrip.id}`} className="text-primary hover:underline flex items-center gap-2 mt-4 text-sm font-medium">
              Edit Trip <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <RouteEmptyState 
            className="min-h-[300px] rounded-2xl" 
            message="No trips planned yet" 
            action={
              <Link 
                href="/dashboard/trips/new"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                Start Planning <ArrowRight size={16} />
              </Link>
            }
          />
        )}
      </section>

    </div>
  );
}
