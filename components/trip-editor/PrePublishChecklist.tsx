'use client';

import { type CompletenessResult } from '@/lib/trip-completeness';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PrePublishChecklistProps {
  completeness: CompletenessResult;
  tripId: string;
}

export default function PrePublishChecklist({ completeness, tripId }: PrePublishChecklistProps) {
  if (completeness.isReadyForGeneration) return null;

  return (
    <div className="border border-amber-500/20 bg-amber-500/10 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-amber-600">
        <AlertCircle size={20} />
        <h3 className="font-bold text-lg">Action Required Before Publishing</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Your trip is missing some essential information. Please complete the following sections before generating or publishing your landing page.
      </p>

      <div className="space-y-2 mt-4">
        {completeness.missing.map((item, idx) => (
          <Link
            key={idx}
            href={`/dashboard/trips/${tripId}/${item.section === 'basicInfo' ? 'basics' : item.section}`}
            className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-amber-500/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0">
                <span className="sr-only">Missing</span>
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-amber-600 transition-colors" />
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-2 mt-6">
        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full" 
            style={{ width: `${completeness.percent}%` }} 
          />
        </div>
        <span className="text-xs font-bold text-amber-600">{completeness.percent}% Complete</span>
      </div>
    </div>
  );
}
