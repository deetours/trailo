'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import type { TripPolicies } from '@/types/trip';

const policiesSchema = z.object({
  cancellationPolicy: z.string().min(1, 'Cancellation policy is required'),
  refundPolicy: z.string().optional(),
  ageRestriction: z.string().optional(),
  fitnessRequirement: z.string().optional(),
  safetyNotes: z.string().optional(),
  termsUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export default function TripPoliciesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading, updateSection } = useTrip(id);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripPolicies>({
    resolver: zodResolver(policiesSchema),
    defaultValues: { cancellationPolicy: '' },
  });

  useEffect(() => {
    if (trip?.policies) reset(trip.policies);
  }, [trip, reset]);

  const onSubmit = async (data: TripPolicies) => {
    setIsSaving(true);
    await updateSection('policies', data);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isLoading || !trip) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Policies</h2>
        <p className="text-muted-foreground">Cancellation, refund, and safety terms shown to travelers.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Cancellation Policy</label>
            <textarea {...register('cancellationPolicy')} rows={4} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none" placeholder="e.g. Full refund up to 14 days before departure..." />
            {errors.cancellationPolicy && <span className="text-destructive text-xs">{errors.cancellationPolicy.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Refund Policy</label>
            <textarea {...register('refundPolicy')} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none" />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Age Restriction</label>
              <input {...register('ageRestriction')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. 18+ only" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Fitness Requirement</label>
              <input {...register('fitnessRequirement')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. Moderate fitness required" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Safety Notes</label>
            <textarea {...register('safetyNotes')} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Terms URL</label>
            <input {...register('termsUrl')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="https://..." />
            {errors.termsUrl && <span className="text-destructive text-xs">{errors.termsUrl.message}</span>}
          </div>
        </Card>

        <div className="pt-4 border-t border-border flex items-center gap-4">
          <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save policies'}
          </MagneticButton>
          {isSaved && <span className="text-sm text-green-500 font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
