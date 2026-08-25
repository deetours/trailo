'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Tag, Map, Image as ImageIcon, CalendarDays, ShieldCheck, ExternalLink, ArrowLeft, Zap } from 'lucide-react';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import { cn } from '@/lib/cn';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBusinessProfile } from '@/lib/api/business/hooks/useBusinessProfile';
import MagneticButton from '@/components/MagneticButton';

export default function TripEditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const { trip, isLoading } = useTrip(id);
  const { session } = useSession();
  const { profile } = useBusinessProfile(session?.businessId);

  const navItems = [
    { href: `/dashboard/trips/${id}/basics`, label: 'Basics', icon: Settings },
    { href: `/dashboard/trips/${id}/pricing`, label: 'Pricing', icon: Tag },
    { href: `/dashboard/trips/${id}/itinerary`, label: 'Itinerary', icon: Map },
    { href: `/dashboard/trips/${id}/media`, label: 'Media', icon: ImageIcon },
    { href: `/dashboard/trips/${id}/departures`, label: 'Departures', icon: CalendarDays },
    { href: `/dashboard/trips/${id}/policies`, label: 'Policies', icon: ShieldCheck },
    { href: `/dashboard/trips/${id}/page`, label: 'Page', icon: Zap },
  ];

  if (isLoading || !trip) {
    return <div className="p-10 text-center text-muted-foreground">Loading trip...</div>;
  }

  const generatedUrl = profile ? `/t/${profile.slug}/${trip.slug}` : '#';

  return (
    <div className="flex flex-col flex-1 h-full bg-background text-foreground overflow-hidden">
      {/* Editor Header */}
      <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/trips" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-foreground text-sm">{trip.basicInfo.name || 'Untitled Trip'}</h1>
            <span className="text-xs text-muted-foreground capitalize">{trip.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {trip.status === 'published' && profile && (
            <Link 
              href={generatedUrl} 
              target="_blank"
              className="text-sm font-medium flex items-center gap-2 text-primary hover:underline"
            >
              View Page <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <aside className="w-56 border-r border-border bg-card flex flex-col p-4 gap-1 shrink-0 overflow-y-auto">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Editor Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10">
          <div className="max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
