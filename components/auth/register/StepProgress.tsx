'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export const REGISTER_STEPS = ['Business', 'Owner', 'Verification', 'Brand', 'Finish'] as const;

export default function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {REGISTER_STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < current;
        const isActive = stepNumber === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shrink-0',
                  isComplete ? 'bg-accent border-accent text-accent-foreground' :
                  isActive ? 'border-accent text-accent' :
                  'border-border text-muted-foreground'
                )}
              >
                {isComplete ? <Check size={14} /> : stepNumber}
              </div>
              <span className={cn('text-xs font-medium hidden sm:block', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {stepNumber < REGISTER_STEPS.length && (
              <div className={cn('h-px flex-1 mx-2 transition-colors', isComplete ? 'bg-accent' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
