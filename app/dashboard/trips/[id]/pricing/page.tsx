'use client';

import { use, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import type { TripPricing, PricingTier } from '@/types/trip';

const pricingTierSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label required'),
  price: z.number().min(0, 'Must be positive'),
  minPax: z.number().optional(),
  maxPax: z.number().optional(),
});

const pricingSchema = z.object({
  model: z.enum(['per-person', 'per-group', 'tiered']),
  currency: z.string(),
  basePrice: z.number().optional(),
  tiers: z.array(pricingTierSchema).optional(),
  depositRequired: z.boolean(),
  depositAmount: z.number().optional(),
  depositPercent: z.number().optional(),
  paymentNotes: z.string().optional(),
});

export default function TripPricingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading, updateSection } = useTrip(id);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors }, watch } = useForm<TripPricing>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      model: 'per-person',
      currency: 'INR',
      depositRequired: false,
      tiers: []
    }
  });

  const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({
    control,
    name: 'tiers'
  });

  const model = watch('model');

  useEffect(() => {
    if (trip?.pricing) {
      reset(trip.pricing);
    }
  }, [trip, reset]);

  const onSubmit = async (data: TripPricing) => {
    setIsSaving(true);
    await updateSection('pricing', data);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isLoading || !trip) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Pricing</h2>
        <p className="text-muted-foreground">Configure the pricing model for your trip.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Pricing Model</label>
              <select {...register('model')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize">
                <option value="per-person">Per Person</option>
                <option value="per-group">Per Group</option>
                <option value="tiered">Tiered</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Currency</label>
              <input {...register('currency')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent uppercase" placeholder="INR" />
            </div>
          </div>

          {model !== 'tiered' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Base Price</label>
              <input type="number" {...register('basePrice', { valueAsNumber: true })} className="w-full max-w-sm bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="0" />
            </div>
          )}
        </Card>

        {model === 'tiered' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Pricing Tiers</h3>
            {tierFields.map((field, index) => (
              <Card key={field.id} className="p-6 relative group">
                <button 
                  type="button" 
                  onClick={() => removeTier(index)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">Tier Label</label>
                    <input {...register(`tiers.${index}.label`)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. Standard" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">Price</label>
                    <input type="number" {...register(`tiers.${index}.price`, { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="0" />
                  </div>
                </div>
              </Card>
            ))}

            <button 
              type="button"
              onClick={() => appendTier({ id: `tier_${Date.now()}`, label: 'New Tier', price: 0 })}
              className="w-full py-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} /> Add Pricing Tier
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-border flex items-center gap-4">
          <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Pricing'}
          </MagneticButton>
          {isSaved && <span className="text-sm text-green-500 font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  );
}
