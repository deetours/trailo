'use client';

import { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Users, MapPin, X } from 'lucide-react';
import { useDepartures } from '@/lib/api/departures/hooks/useDepartures';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { cn } from '@/lib/cn';
import type { DepartureStatus } from '@/types/departure';

const departureSchema = z.object({
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  capacity: z.number().min(1, 'Must be at least 1'),
  priceOverride: z.number().optional(),
  guideName: z.string().optional(),
  vehicleDetails: z.string().optional(),
  notes: z.string().optional(),
});

type DepartureFormData = z.infer<typeof departureSchema>;

const statusStyles: Record<DepartureStatus, string> = {
  scheduled: 'bg-accent/10 text-accent border-accent/20',
  confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
  full: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-border',
};

export default function TripDeparturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { departures, isLoading, createDeparture, updateStatus, deleteDeparture } = useDepartures(id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepartureFormData>({
    resolver: zodResolver(departureSchema),
    defaultValues: { capacity: 10 },
  });

  const onSubmit = async (data: DepartureFormData) => {
    setIsSaving(true);
    await createDeparture(data);
    setIsSaving(false);
    reset({ capacity: 10 });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Departures</h2>
          <p className="text-muted-foreground">Dated instances of this trip — capacity, guide, and vehicle per departure.</p>
        </div>
        <MagneticButton variant="primary" className="py-2 px-4" onClick={() => setIsFormOpen(v => !v)}>
          <span className="flex items-center gap-2">
            {isFormOpen ? <X size={16} /> : <Plus size={16} />}
            {isFormOpen ? 'Cancel' : 'Add departure'}
          </span>
        </MagneticButton>
      </div>

      {isFormOpen && (
        <Card className="p-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Start Date</label>
                <input type="date" {...register('startDate')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
                {errors.startDate && <span className="text-destructive text-xs">{errors.startDate.message}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">End Date</label>
                <input type="date" {...register('endDate')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
                {errors.endDate && <span className="text-destructive text-xs">{errors.endDate.message}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Capacity</label>
                <input type="number" {...register('capacity', { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
                {errors.capacity && <span className="text-destructive text-xs">{errors.capacity.message}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Price Override</label>
                <input type="number" {...register('priceOverride', { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="Uses trip pricing" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Guide</label>
                <input {...register('guideName')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="Guide name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Vehicle</label>
              <input {...register('vehicleDetails')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. Tempo Traveller, KA-01-AB-1234" />
            </div>
            <div className="pt-2">
              <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Create departure'}
              </MagneticButton>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : departures.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No departures yet</h3>
            <p className="text-muted-foreground">Add a dated departure to open this trip for booking.</p>
          </div>
        ) : (
          departures.map(dep => (
            <Card key={dep.id} rounded="xl" className="p-6 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-foreground font-bold">
                    {new Date(dep.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(dep.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <select
                    value={dep.status}
                    onChange={(e) => updateStatus(dep.id, e.target.value as DepartureStatus)}
                    className={cn('text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-transparent focus:outline-none', statusStyles[dep.status])}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="full">Full</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Users size={14} /> {dep.booked}/{dep.capacity} booked</span>
                  {dep.guideName && <span>Guide: {dep.guideName}</span>}
                  {dep.vehicleDetails && <span className="flex items-center gap-1.5"><MapPin size={14} /> {dep.vehicleDetails}</span>}
                  {dep.priceOverride !== undefined && <span>Price override: {dep.priceOverride}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteDeparture(dep.id)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                aria-label="Delete departure"
              >
                <Trash2 size={18} />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
