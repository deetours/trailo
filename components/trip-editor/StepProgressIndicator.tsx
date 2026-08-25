import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { GenerationStep } from '@/types/landing-page';

interface StepProgressIndicatorProps {
  step: GenerationStep;
}

export default function StepProgressIndicator({ step }: StepProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      {step.status === 'done' ? (
        <CheckCircle2 size={18} className="text-green-500 shrink-0" />
      ) : step.status === 'active' ? (
        <Loader2 size={18} className="text-blue-500 animate-spin shrink-0" />
      ) : step.status === 'failed' ? (
        <Circle size={18} className="text-red-500 shrink-0" />
      ) : (
        <Circle size={18} className="text-muted-foreground/30 shrink-0" />
      )}
      
      <span className={`text-sm font-medium ${
        step.status === 'active' ? 'text-foreground' : 
        step.status === 'done' ? 'text-foreground' : 
        step.status === 'failed' ? 'text-red-500' : 
        'text-muted-foreground'
      }`}>
        {step.label}
      </span>
    </div>
  );
}
