'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Star, ChevronLeft, ChevronRight, Video, ImageIcon as ImageIconLucide } from 'lucide-react';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { cn } from '@/lib/cn';
import type { TripMediaAsset } from '@/types/trip';

const mediaSchema = z.object({
  url: z.string().url('Enter a valid URL'),
  type: z.enum(['image', 'video']),
  caption: z.string().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export default function TripMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading, updateSection } = useTrip(id);
  const [assets, setAssets] = useState<TripMediaAsset[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: { type: 'image' },
  });

  useEffect(() => {
    if (trip) setAssets([...trip.media].sort((a, b) => a.sortOrder - b.sortOrder));
  }, [trip]);

  const persist = async (next: TripMediaAsset[]) => {
    setAssets(next);
    setIsSaving(true);
    await updateSection('media', next);
    setIsSaving(false);
  };

  const onSubmit = async (data: MediaFormData) => {
    const asset: TripMediaAsset = {
      id: `media_${Date.now()}`,
      url: data.url,
      type: data.type,
      caption: data.caption,
      isHero: assets.length === 0,
      sortOrder: assets.length,
    };
    await persist([...assets, asset]);
    reset({ type: 'image', url: '', caption: '' });
  };

  const setHero = (assetId: string) => {
    persist(assets.map(a => ({ ...a, isHero: a.id === assetId })));
  };

  const removeAsset = (assetId: string) => {
    const wasHero = assets.find(a => a.id === assetId)?.isHero;
    let next = assets.filter(a => a.id !== assetId).map((a, i) => ({ ...a, sortOrder: i }));
    if (wasHero && next.length > 0) next = next.map((a, i) => ({ ...a, isHero: i === 0 }));
    persist(next);
  };

  const moveAsset = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= assets.length) return;
    const next = [...assets];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next.map((a, i) => ({ ...a, sortOrder: i })));
  };

  if (isLoading || !trip) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Media</h2>
        <p className="text-muted-foreground">Manage the gallery of images and videos for this trip.</p>
      </div>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Type</label>
              <select {...register('type')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Media URL</label>
              <input {...register('url')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="https://..." />
              {errors.url && <span className="text-destructive text-xs">{errors.url.message}</span>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Caption</label>
            <input {...register('caption')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="Optional caption" />
          </div>
          <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
            <span className="flex items-center gap-2"><Plus size={16} /> Add to gallery</span>
          </MagneticButton>
        </form>
      </Card>

      {assets.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">No media yet</h3>
          <p className="text-muted-foreground">Add images or videos to build the trip gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset, index) => (
            <Card key={asset.id} rounded="xl" className="overflow-hidden group relative">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {asset.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt={asset.caption || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Video size={32} />
                  </div>
                )}
                {asset.isHero && (
                  <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> Hero
                  </span>
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveAsset(index, -1)} disabled={index === 0} className="p-1.5 bg-background/80 rounded text-foreground disabled:opacity-30" aria-label="Move earlier">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => moveAsset(index, 1)} disabled={index === assets.length - 1} className="p-1.5 bg-background/80 rounded text-foreground disabled:opacity-30" aria-label="Move later">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{asset.caption || <span className="text-muted-foreground">No caption</span>}</p>
                  <span className={cn('text-xs font-medium uppercase tracking-wide flex items-center gap-1 mt-1', 'text-muted-foreground')}>
                    {asset.type === 'image' ? <ImageIconLucide size={12} /> : <Video size={12} />} {asset.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!asset.isHero && (
                    <button onClick={() => setHero(asset.id)} className="p-1.5 text-muted-foreground hover:text-accent transition-colors" aria-label="Set as hero">
                      <Star size={16} />
                    </button>
                  )}
                  <button onClick={() => removeAsset(asset.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove media">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
