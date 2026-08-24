'use client';

import { useState } from 'react';
import type { BrandKit } from '@/types/business';
import MagneticButton from '@/components/MagneticButton';

interface BrandKitEditorProps {
  initialData: BrandKit;
  onSave: (data: BrandKit) => Promise<any>;
}

export default function BrandKitEditor({ initialData, onSave }: BrandKitEditorProps) {
  const [data, setData] = useState<BrandKit>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground block">Logo URL</label>
        <div className="flex gap-4 items-start">
          <input
            type="url"
            value={data.logoUrl || ''}
            onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
          />
          {data.logoUrl && (
            <div className="w-12 h-12 rounded border border-border bg-background p-1 flex items-center justify-center shrink-0">
              <img src={data.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.primaryColor}
              onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={data.primaryColor}
              onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent font-mono uppercase text-sm"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Secondary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.secondaryColor}
              onChange={(e) => setData({ ...data, secondaryColor: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input
              type="text"
              value={data.secondaryColor}
              onChange={(e) => setData({ ...data, secondaryColor: e.target.value })}
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent font-mono uppercase text-sm"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Brand Kit'}
        </MagneticButton>
      </div>
    </form>
  );
}
