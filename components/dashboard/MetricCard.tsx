import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import Card from '@/components/Card';
import { cn } from '@/lib/cn';
import type { MetricTrend } from '@/lib/dashboard/useDashboardMetrics';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: MetricTrend;
  icon: LucideIcon;
  href: string;
}

const trendStyles = {
  up: 'text-success',
  down: 'text-destructive',
  flat: 'text-muted-foreground',
} as const;

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const;

export default function MetricCard({ label, value, trend, icon: Icon, href }: MetricCardProps) {
  const showTrendIcon = trend && trend.label !== '—';
  const TrendIcon = showTrendIcon ? trendIcons[trend.direction] : null;

  return (
    <Card href={href} rounded="2xl" className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</span>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="font-display font-bold text-3xl text-foreground tracking-tight">{value}</span>
        {trend && (
          <span className={cn('flex items-center gap-1 text-xs font-medium pb-1', trendStyles[trend.direction])}>
            {TrendIcon && <TrendIcon size={13} />}
            {trend.label}
          </span>
        )}
      </div>
    </Card>
  );
}
