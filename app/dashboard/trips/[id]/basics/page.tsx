'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import type { TripBasicInfo } from '@/types/trip';

const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  destinationRegion: z.string().min(2, 'Region is required'),
  durationDays: z.number().min(1, 'At least 1 day'),
  durationNights: z.number().min(0, 'Cannot be negative'),
  tripType: z.enum(['road-trip', 'trek', 'expedition', 'tour', 'retreat', 'other']),
  difficultyLevel: z.enum(['easy', 'moderate', 'hard', 'expert']).optional(),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
});

export default function TripBasicsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading, updateSection } = useTrip(id);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripBasicInfo>({
    resolver: zodResolver(basicInfoSchema),
  });

  useEffect(() => {
    if (trip) {
      reset(trip.basicInfo);
    }
  }, [trip, reset]);

  const onSubmit = async (data: TripBasicInfo) => {
    setIsSaving(true);
    await updateSection('basicInfo', data);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isLoading || !trip) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Basic Info</h2>
        <p className="text-muted-foreground">The foundational details of your trip.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Trip Name</label>
              <input {...register('name')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
              {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Destination / Region</label>
                <input {...register('destinationRegion')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Duration (Days)</label>
                <input type="number" {...register('durationDays', { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Duration (Nights)</label>
                <input type="number" {...register('durationNights', { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Trip Type</label>
                <select {...register('tripType')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize">
                  <option value="road-trip">Road Trip</option>
                  <option value="trek">Trek</option>
                  <option value="expedition">Expedition</option>
                  <option value="tour">Tour</option>
                  <option value="retreat">Retreat</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Difficulty</label>
                <select {...register('difficultyLevel')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize">
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-4">
            <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Basics'}
            </MagneticButton>
            {isSaved && <span className="text-sm text-green-500 font-medium">Saved successfully!</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
