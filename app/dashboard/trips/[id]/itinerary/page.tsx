'use client';

import { use, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Copy, ChevronUp, ChevronDown, Mountain, Ruler } from 'lucide-react';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import type { ItineraryDay } from '@/types/trip';

const dayScheme = z.object({
  id: z.string(),
  dayNumber: z.number(),
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  activities: z.array(z.string()),
  meals: z.array(z.enum(['breakfast', 'lunch', 'dinner'])).optional(),
  accommodation: z.string().optional(),
  distanceKm: z.number().optional(),
  elevationM: z.number().optional(),
});

const itinerarySchema = z.object({
  days: z.array(dayScheme),
});

type ItineraryFormData = z.infer<typeof itinerarySchema>;

const MEAL_OPTIONS = ['breakfast', 'lunch', 'dinner'] as const;

function makeDay(dayNumber: number): ItineraryDay {
  return {
    id: `day_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    dayNumber,
    title: '',
    description: '',
    activities: [],
    meals: [],
  };
}

export default function TripItineraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading, updateSection } = useTrip(id);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { control, register, handleSubmit, reset, watch, setValue } = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: { days: [] },
  });

  const { fields, append, remove, insert, move } = useFieldArray({ control, name: 'days' });

  useEffect(() => {
    if (trip) {
      reset({ days: trip.itinerary.length ? trip.itinerary : [] });
    }
  }, [trip, reset]);

  const renumber = (days: ItineraryDay[]) => days.map((d, i) => ({ ...d, dayNumber: i + 1 }));

  const onSubmit = async (data: ItineraryFormData) => {
    setIsSaving(true);
    await updateSection('itinerary', renumber(data.days as ItineraryDay[]));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addDay = () => append(makeDay(fields.length + 1));

  const insertDayAfter = (index: number) => insert(index + 1, makeDay(index + 2));

  const duplicateDay = (index: number) => {
    const source = watch(`days.${index}`);
    insert(index + 1, { ...source, id: `day_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` });
  };

  const removeDay = (index: number) => remove(index);

  const moveDay = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    move(index, target);
  };

  const toggleMeal = (dayIndex: number, meal: (typeof MEAL_OPTIONS)[number]) => {
    const current = watch(`days.${dayIndex}.meals`) || [];
    const next = current.includes(meal) ? current.filter(m => m !== meal) : [...current, meal];
    setValue(`days.${dayIndex}.meals`, next);
  };

  if (isLoading || !trip) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Itinerary</h2>
          <p className="text-muted-foreground">Build the day-by-day plan for this trip.</p>
        </div>
        <MagneticButton variant="primary" className="py-2 px-4" onClick={addDay}>
          <span className="flex items-center gap-2"><Plus size={16} /> Add day</span>
        </MagneticButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No days yet</h3>
            <p className="text-muted-foreground mb-6">Add the first day to start building the itinerary.</p>
            <MagneticButton variant="primary" className="py-2 px-6" onClick={addDay}>
              <span className="flex items-center gap-2"><Plus size={16} /> Add day 1</span>
            </MagneticButton>
          </div>
        ) : (
          fields.map((field, index) => {
            const meals = watch(`days.${index}.meals`) || [];
            return (
              <Card key={field.id} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-muted text-foreground px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Day {index + 1}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <button type="button" onClick={() => moveDay(index, -1)} disabled={index === 0} className="p-1.5 hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors" aria-label="Move day up">
                      <ChevronUp size={16} />
                    </button>
                    <button type="button" onClick={() => moveDay(index, 1)} disabled={index === fields.length - 1} className="p-1.5 hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors" aria-label="Move day down">
                      <ChevronDown size={16} />
                    </button>
                    <button type="button" onClick={() => duplicateDay(index)} className="p-1.5 hover:text-foreground transition-colors" aria-label="Duplicate day">
                      <Copy size={16} />
                    </button>
                    <button type="button" onClick={() => insertDayAfter(index)} className="p-1.5 hover:text-foreground transition-colors" aria-label="Insert day after">
                      <Plus size={16} />
                    </button>
                    <button type="button" onClick={() => removeDay(index)} className="p-1.5 hover:text-destructive transition-colors" aria-label="Delete day">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Title</label>
                  <input {...register(`days.${index}.title`)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. Arrival & acclimatization" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Description</label>
                  <textarea {...register(`days.${index}.description`)} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none" placeholder="What happens on this day" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Activities <span className="text-muted-foreground font-normal">(one per line)</span></label>
                  <textarea
                    rows={3}
                    defaultValue={(watch(`days.${index}.activities`) || []).join('\n')}
                    onBlur={(e) => setValue(`days.${index}.activities`, e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none"
                    placeholder={'Morning trek to base camp\nAcclimatization walk'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">Meals included</label>
                    <div className="flex gap-2">
                      {MEAL_OPTIONS.map(meal => (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => toggleMeal(index, meal)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${meals.includes(meal) ? 'bg-accent/10 text-accent border-accent/30' : 'bg-background text-muted-foreground border-border hover:text-foreground'}`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">Accommodation</label>
                    <input {...register(`days.${index}.accommodation`)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="e.g. Mountain lodge" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Ruler size={14} /> Distance (km)</label>
                    <input type="number" {...register(`days.${index}.distanceKm`, { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Mountain size={14} /> Elevation gain (m)</label>
                    <input type="number" {...register(`days.${index}.elevationM`, { valueAsNumber: true })} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
                  </div>
                </div>
              </Card>
            );
          })
        )}

        {fields.length > 0 && (
          <div className="pt-4 border-t border-border flex items-center gap-4">
            <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save itinerary'}
            </MagneticButton>
            {isSaved && <span className="text-sm text-green-500 font-medium">Saved successfully!</span>}
          </div>
        )}
      </form>
    </div>
  );
}
