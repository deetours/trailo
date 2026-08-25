'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, Map, User, Building, LogOut, Users, UserCheck, CalendarCheck, Wallet, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { authService } from '@/lib/api/auth/mock/mock-adapter';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
}

// Only routes that actually exist today are linked — Attention, Departures,
// Campaigns, Landing Pages, Analytics, Team, and Integrations are part of
// the target taxonomy (docs/DASHBOARD_PLAN.md §4) but have no page yet, and
// a nav item that 404s is worse than a shorter menu.
const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Operate',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: Compass, exact: true }],
  },
  {
    label: 'Manage',
    items: [
      { href: '/dashboard/trips', label: 'Trips', icon: Map },
      { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
      { href: '/dashboard/customers', label: 'Customers', icon: UserCheck },
      { href: '/dashboard/leads', label: 'Leads', icon: Users },
      { href: '/dashboard/payments', label: 'Payments', icon: Wallet },
    ],
  },
  {
    label: 'Grow',
    items: [{ href: '/dashboard/whatsapp', label: 'WhatsApp', icon: WhatsAppIcon }],
  },
  {
    label: 'Configure',
    items: [{ href: '/dashboard/business', label: 'Business Profile', icon: Building }],
  },
];

function isItemActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  const isTripEditor = pathname.match(/^\/dashboard\/trips\/[^/]+(\/|$)/) && !pathname.includes('/new');

  // Close the mobile drawer on navigation. Adjusted during render (React's
  // documented pattern for resetting state when a prop changes) rather than
  // in an effect, which would fire a redundant extra render on every route change.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileNavOpen(false);
  }

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-20 px-6 flex items-center border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-foreground text-background p-1.5 rounded flex items-center justify-center">
              <Logo wordmark={false} markClassName="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">Trailo</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {navGroups.map((group, i) => (
            <div key={group.label} className={cn(i > 0 && 'mt-5')}>
              <p className="px-3 mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm',
                        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link
            href="/dashboard/account"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
              pathname.startsWith('/dashboard/account') ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <User size={18} />
            <span>Account</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-sm w-full text-left"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden relative h-16 border-b border-border bg-card flex items-center px-4 justify-between z-40">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo wordmark={false} markClassName="w-5 h-5 text-foreground" />
            <span className="font-display font-bold text-foreground">Trailo</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center w-11 h-11 -mr-2 text-foreground"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-dashboard-nav"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <AnimatePresence>
            {mobileNavOpen && (
              <motion.nav
                id="mobile-dashboard-nav"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.22, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: 'top' }}
                className="absolute top-full inset-x-0 bg-background border-b border-border px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto"
              >
                {navGroups.map((group) => (
                  <div key={group.label} className="mb-2">
                    <p className="px-3 mb-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(pathname, item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm',
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
                <div className="pt-2 mt-1 border-t border-border flex flex-col gap-1">
                  <Link href="/dashboard/account" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-sm">
                    <User size={18} />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-medium text-sm w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        <div className={cn("flex-1 w-full flex flex-col", !isTripEditor && "p-6 md:p-10")}>
          {children}
        </div>
      </main>
    </div>
  );
}
