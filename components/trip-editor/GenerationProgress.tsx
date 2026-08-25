'use client';

import { useGenerationJob } from '@/lib/api/landing-pages/hooks/useGenerationJob';
import StepProgressIndicator from './StepProgressIndicator';
import { Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  jobId?: string;
}

export default function GenerationProgress({ jobId }: GenerationProgressProps) {
  const { job, isLoading } = useGenerationJob(jobId);

  if (isLoading || !job) {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Loader2 size={18} className="animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Initializing generation...</span>
      </div>
    );
  }

  // Calculate progress percentage
  const totalSteps = job.steps.length;
  const completedSteps = job.steps.filter(s => s.status === 'done').length;
  const progressPercent = Math.min(100, Math.round(((completedSteps + (job.status === 'running' ? 0.5 : 0)) / totalSteps) * 100));

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card shadow-sm">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Generating your page</span>
          <span className="text-xs text-muted-foreground font-medium">{progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-3 pt-2">
        {job.steps.map((step) => (
          <StepProgressIndicator key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
}
