'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, Clock, X, ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import type { AttentionItem } from '@/lib/dashboard/useAttentionItems';

const severityConfig = {
  red: {
    icon: AlertCircle,
    label: 'Urgent',
    classes: 'border-destructive/30 bg-destructive/5',
    badge: 'bg-destructive/10 text-destructive',
  },
  orange: {
    icon: AlertTriangle,
    label: 'Needs attention',
    classes: 'border-warning/30 bg-warning/5',
    badge: 'bg-warning/10 text-warning',
  },
  yellow: {
    icon: Clock,
    label: 'Heads up',
    classes: 'border-border bg-muted/30',
    badge: 'bg-muted text-muted-foreground',
  },
} as const;

interface AttentionCardProps {
  item: AttentionItem;
  onDismiss: (id: string) => void;
}

export default function AttentionCard({ item, onDismiss }: AttentionCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const reduceMotion = useReducedMotion();
  const config = severityConfig[item.severity];
  const Icon = config.icon;

  const handleDismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    if (reduceMotion || !ref.current) {
      onDismiss(item.id);
      return;
    }
    gsap.to(ref.current, {
      opacity: 0,
      x: 24,
      duration: DURATION.fast,
      ease: EASE.out,
      onComplete: () => onDismiss(item.id),
    });
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-start gap-4 rounded-xl border p-4', config.classes)}
    >
      <span className={cn('shrink-0 rounded-lg p-2', config.badge)}>
        <Icon size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-[0.65rem] font-bold uppercase tracking-widest', config.badge, 'px-1.5 py-0.5 rounded')}>
            {config.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
        <Link
          href={item.actionHref}
          className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
        >
          {item.actionLabel} <ArrowRight size={14} />
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}
