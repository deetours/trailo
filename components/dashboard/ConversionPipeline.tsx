'use client';

import { ArrowRight } from 'lucide-react';
import Card from '@/components/Card';
import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { useBookings } from '@/lib/api/bookings/hooks/useBookings';

export default function ConversionPipeline({ businessId }: { businessId: string }) {
  const { leads, isLoading: leadsLoading } = useLeads(businessId);
  const { bookings, isLoading: bookingsLoading } = useBookings(businessId);

  if (leadsLoading || bookingsLoading || leads.length === 0) return null;

  const conversionPct = Math.round((bookings.length / leads.length) * 100);

  return (
    <Card rounded="2xl" className="p-6">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-5">Leads to bookings</h2>
      <div className="flex items-center gap-4">
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-3xl text-foreground">{leads.length}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Leads</p>
        </div>
        <ArrowRight size={20} className="text-muted-foreground shrink-0" />
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-3xl text-foreground">{bookings.length}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Bookings</p>
        </div>
        <div className="w-px h-10 bg-border shrink-0" />
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-3xl text-accent">{conversionPct}%</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Conversion</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.min(conversionPct, 100)}%` }} />
      </div>
    </Card>
  );
}
