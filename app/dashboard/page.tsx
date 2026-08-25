'use client';

import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBusinessState } from '@/lib/dashboard/useBusinessState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BusinessStateGuidance from '@/components/dashboard/BusinessStateGuidance';
import MetricsRow from '@/components/dashboard/MetricsRow';
import ConversionPipeline from '@/components/dashboard/ConversionPipeline';
import AttentionSection from '@/components/dashboard/AttentionSection';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingDepartures from '@/components/dashboard/UpcomingDepartures';
import PerformanceSection from '@/components/dashboard/PerformanceSection';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
  const { session } = useSession();
  const businessId = session?.businessId || '';
  const state = useBusinessState(businessId);

  return (
    <div className="space-y-12">
      <DashboardHeader name={session?.user?.name || 'Organizer'} businessId={businessId} state={state} />
      <BusinessStateGuidance businessId={businessId} state={state} />
      <MetricsRow businessId={businessId} />
      <ConversionPipeline businessId={businessId} />
      <AttentionSection businessId={businessId} />
      <QuickActions />
      <UpcomingDepartures businessId={businessId} />
      <PerformanceSection businessId={businessId} />
      <ActivityFeed businessId={businessId} />
    </div>
  );
}
