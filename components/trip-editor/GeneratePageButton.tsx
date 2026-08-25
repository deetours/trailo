'use client';

import { useState } from 'react';
import MagneticButton from '@/components/MagneticButton';
import { Sparkles, Loader2 } from 'lucide-react';
import type { GenerationJob } from '@/types/landing-page';

interface GeneratePageButtonProps {
  onGenerate: () => Promise<GenerationJob>;
  onJobCreated: (jobId: string) => void;
  isStale?: boolean;
  disabled?: boolean;
}

export default function GeneratePageButton({ onGenerate, onJobCreated, isStale, disabled }: GeneratePageButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (disabled) return;
    try {
      setIsGenerating(true);
      const job = await onGenerate();
      onJobCreated(job.id);
    } catch (error) {
      console.error('Failed to generate page:', error);
      setIsGenerating(false);
    }
  };

  return (
    <MagneticButton 
      variant={isStale ? "outline" : "primary"}
      onClick={handleGenerate}
      disabled={isGenerating || disabled}
      className={`py-2 px-6 flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isGenerating ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Sparkles size={16} />
      )}
      {isGenerating ? 'Starting...' : isStale ? 'Regenerate Page' : 'Generate Page'}
    </MagneticButton>
  );
}
