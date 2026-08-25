'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import { STAGGER } from '@/lib/motion';
import { useAttentionItems } from '@/lib/dashboard/useAttentionItems';
import AttentionCard from './AttentionCard';

export default function AttentionSection({ businessId }: { businessId: string }) {
  const { items, isLoading } = useAttentionItems(businessId);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleItems = items.filter((item) => !dismissedIds.has(item.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Attention</h2>
        <div className="h-20 rounded-xl bg-card border border-border animate-pulse" />
      </section>
    );
  }

  if (visibleItems.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Attention</h2>
        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck size={18} className="text-success shrink-0" />
          Nothing needs your attention right now.
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Attention {visibleItems.length > 0 && <span className="text-foreground">({visibleItems.length})</span>}
      </h2>
      <Reveal className="flex flex-col gap-3" stagger={STAGGER.tight} y={12}>
        {visibleItems.map((item) => (
          <AttentionCard key={item.id} item={item} onDismiss={handleDismiss} />
        ))}
      </Reveal>
    </section>
  );
}
