'use client';

import Link from 'next/link';
import { Compass, Map, User, Building, LogOut } from 'lucide-react';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { authService } from '@/lib/api/auth/mock/mock-adapter';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: Compass, exact: true },
    { href: '/dashboard/trips', label: 'Trips', icon: Map, exact: false },
    { href: '/dashboard/business', label: 'Business Profile', icon: Building, exact: false },
  ];

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

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
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
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-border bg-card flex items-center px-4 justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo wordmark={false} markClassName="w-5 h-5 text-foreground" />
            <span className="font-display font-bold text-foreground">Trailo</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard/trips" className="text-muted-foreground">Trips</Link>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
