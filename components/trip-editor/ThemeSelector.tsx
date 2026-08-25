'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { Palette, Check, LayoutTemplate } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import type { LandingPageTheme, LandingPage } from '@/types/landing-page';

interface ThemeSelectorProps {
  landingPage: LandingPage;
  onUpdate: (theme: LandingPageTheme) => Promise<void>;
  disabled?: boolean;
}

const THEME_LAYOUTS = [
  { id: 'modern', label: 'Modern Minimal' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'bold', label: 'Bold Adventure' }
] as const;

const THEME_COLORS = [
  { id: 'blue', value: '#2A8AF6', label: 'Trailo Blue' },
  { id: 'forest', value: '#10B981', label: 'Forest Green' },
  { id: 'sunset', value: '#F97316', label: 'Sunset Orange' },
  { id: 'midnight', value: '#6366F1', label: 'Midnight Indigo' },
  { id: 'slate', value: '#334155', label: 'Slate Gray' },
];

export default function ThemeSelector({ landingPage, onUpdate, disabled }: ThemeSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const currentTheme: LandingPageTheme = landingPage.theme || { layout: 'modern', primaryColor: '#2A8AF6' };

  const [selectedLayout, setSelectedLayout] = useState(currentTheme.layout);
  const [selectedColor, setSelectedColor] = useState(currentTheme.primaryColor || '#2A8AF6');

  const hasChanges = selectedLayout !== currentTheme.layout || selectedColor !== currentTheme.primaryColor;

  const handleSave = async () => {
    if (disabled) return;
    try {
      setIsSaving(true);
      await onUpdate({ layout: selectedLayout, primaryColor: selectedColor });
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Palette size={20} className="text-foreground" />
        <h3 className="font-bold text-lg">Theme & Customization</h3>
      </div>

      <div className="space-y-6">
        {/* Layout Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Layout Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {THEME_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                disabled={disabled}
                onClick={() => setSelectedLayout(layout.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedLayout === layout.id 
                    ? 'bg-accent/10 border-accent ring-1 ring-accent' 
                    : 'bg-background border-border hover:border-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <LayoutTemplate size={20} className={`mb-2 ${selectedLayout === layout.id ? 'text-accent' : 'text-muted-foreground'}`} />
                <div className="font-bold text-sm text-foreground">{layout.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Primary Accent Color</label>
          <div className="flex flex-wrap items-center gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color.id}
                disabled={disabled}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedColor === color.value ? 'ring-2 ring-offset-2 ring-offset-card ring-foreground' : ''
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              >
                {selectedColor === color.value && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Save Actions */}
        {hasChanges && (
          <div className="pt-4 border-t border-border flex justify-end">
            <MagneticButton
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || disabled}
              className="py-2 px-6"
            >
              {isSaving ? 'Saving...' : 'Apply Changes'}
            </MagneticButton>
          </div>
        )}
      </div>
    </Card>
  );
}
