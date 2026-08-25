import { Plus, Users, CalendarCheck, Wallet, ArrowRight, type LucideIcon } from 'lucide-react';
import Card from '@/components/Card';

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

// Campaigns/Analytics buttons are intentionally omitted — those routes don't
// exist yet, and a nav item that 404s is worse than a shorter menu.
const actions: QuickAction[] = [
  { label: 'Create trip', description: 'Start a new itinerary', href: '/dashboard/trips/new', icon: Plus },
  { label: 'View leads', description: 'Unanswered inquiries', href: '/dashboard/leads?status=new', icon: Users },
  { label: 'View bookings', description: 'Awaiting payment', href: '/dashboard/bookings?status=pending-payment', icon: CalendarCheck },
  { label: 'View payments', description: 'Pending collection', href: '/dashboard/payments?status=pending', icon: Wallet },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Quick actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card key={action.href} href={action.href} rounded="2xl" className="p-5 flex items-center gap-4 group">
              <span className="shrink-0 rounded-lg bg-muted p-2.5 text-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{action.label}</p>
                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
