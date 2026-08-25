'use client';

import Link from 'next/link';
import { UserPlus, CalendarCheck, Wallet, MessageSquare, type LucideIcon } from 'lucide-react';
import { useActivityFeed, type ActivityKind } from '@/lib/dashboard/useActivityFeed';
import { useNow } from '@/lib/dashboard/useNow';

const kindIcon: Record<ActivityKind, LucideIcon> = {
  lead: UserPlus,
  booking: CalendarCheck,
  payment: Wallet,
};

function timeAgo(iso: string, now: number): string {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ActivityFeed({ businessId }: { businessId: string }) {
  const { items, isLoading } = useActivityFeed(businessId);
  const now = useNow();

  if (isLoading || items.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Recent activity</h2>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {items.map((item) => {
          const Icon = kindIcon[item.kind] ?? MessageSquare;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors"
            >
              <span className="shrink-0 rounded-lg bg-muted p-2 text-muted-foreground">
                <Icon size={15} />
              </span>
              <span className="flex-1 min-w-0 text-sm text-foreground truncate">{item.description}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(item.createdAt, now)}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
