'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ArrowRight, Search, Clock, CheckSquare, Square, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import Card from '@/components/Card';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import type { TripStatus } from '@/types/trip';
import { cn } from '@/lib/cn';

function TripsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();

  const status = (searchParams.get('status') as TripStatus | 'all') || 'all';
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { result, isLoading, bulkUpdateStatus } = useTrips(session?.businessId || '', {
    status,
    search: q,
    page,
    pageSize: 10
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [status, q, page]);

  const updateFilters = (updates: { status?: string; q?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) params.set('status', updates.status);
    if (updates.q !== undefined) params.set('q', updates.q);
    if (updates.page !== undefined) params.set('page', updates.page.toString());
    else params.set('page', '1'); // reset page on filter change
    
    router.replace(`/dashboard/trips?${params.toString()}`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === result.items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(result.items.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = async (actionStatus: TripStatus) => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    await bulkUpdateStatus(ids, actionStatus);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-8">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Trips
          </h1>
          <p className="text-muted-foreground">Manage your trips and itineraries.</p>
        </div>
        <MagneticButton href="/dashboard/trips/new" variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus size={16} /> Plan new trip
          </span>
        </MagneticButton>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-6">
          {(['all', 'draft', 'published', 'archived'] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateFilters({ status: t })}
              className={cn(
                "pb-4 -mb-4 text-sm font-medium capitalize relative transition-colors border-b-2",
                status === t ? "text-foreground border-accent" : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search trips..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ q: searchInput });
            }}
            onBlur={() => updateFilters({ q: searchInput })}
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent w-full md:w-64"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-medium text-foreground px-2">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkAction('published')} className="text-xs font-medium px-3 py-1.5 rounded bg-background border border-border hover:bg-muted transition-colors text-foreground">Publish</button>
            <button onClick={() => handleBulkAction('draft')} className="text-xs font-medium px-3 py-1.5 rounded bg-background border border-border hover:bg-muted transition-colors text-foreground">Draft</button>
            <button onClick={() => handleBulkAction('archived')} className="text-xs font-medium px-3 py-1.5 rounded bg-background border border-border hover:bg-muted transition-colors text-foreground">Archive</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="pt-2">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : result.items.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6">
              {q ? 'Try adjusting your search or filters.' : 'You have no trips in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center px-6 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button onClick={toggleSelectAll} className="mr-6">
                {selectedIds.size === result.items.length ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>
              <div className="flex-1">Trip Details</div>
              <div className="w-24 text-right">Status</div>
            </div>

            {result.items.map(trip => (
              <Card
                key={trip.id}
                rounded="xl"
                className={cn(
                  "p-6 flex flex-col md:flex-row md:items-center gap-6 transition-colors",
                  selectedIds.has(trip.id) ? "border-accent bg-accent/5" : ""
                )}
              >
                <button onClick={() => toggleSelect(trip.id)} className="text-muted-foreground hover:text-foreground shrink-0">
                  {selectedIds.has(trip.id) ? <CheckSquare size={18} className="text-accent" /> : <Square size={18} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-muted text-foreground px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      {trip.basicInfo.tripType.replace('-', ' ')}
                    </span>
                  </div>
                  <Link href={`/dashboard/trips/${trip.id}`} className="group">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{trip.basicInfo.name}</h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {trip.basicInfo.durationDays} Days</span>
                    <span>{trip.basicInfo.destinationRegion}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                    trip.status === 'published' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                    trip.status === 'archived' ? "bg-muted text-muted-foreground border border-border" :
                    "bg-accent/10 text-accent border border-accent/20"
                  )}>
                    {trip.status}
                  </span>
                  <Link href={`/dashboard/trips/${trip.id}`} className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1">
                    Edit <ArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            ))}

            {/* Pagination */}
            {result.total > result.pageSize && (
              <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing {(page - 1) * result.pageSize + 1} to {Math.min(page * result.pageSize, result.total)} of {result.total}
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => updateFilters({ page: page - 1 })}
                    className="p-2 rounded border border-border bg-background disabled:opacity-50 text-foreground"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    disabled={page * result.pageSize >= result.total}
                    onClick={() => updateFilters({ page: page + 1 })}
                    className="p-2 rounded border border-border bg-background disabled:opacity-50 text-foreground"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TripsList />
    </Suspense>
  );
}
