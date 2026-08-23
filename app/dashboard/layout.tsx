import Link from 'next/link';
import { Compass, Map, User } from 'lucide-react';
import Logo from '@/components/Logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#222] bg-[#0A0A0A] flex flex-col hidden md:flex">
        <div className="h-20 px-6 flex items-center border-b border-[#222]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white text-black p-1.5 rounded flex items-center justify-center">
              <Logo wordmark={false} markClassName="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Trailo</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#ccc] hover:bg-[#111] hover:text-white transition-colors">
            <Compass size={18} />
            <span className="font-medium text-sm">Overview</span>
          </Link>
          <Link href="/dashboard/trips" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#ccc] hover:bg-[#111] hover:text-white transition-colors">
            <Map size={18} />
            <span className="font-medium text-sm">My Trips</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#222]">
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#888] hover:bg-[#111] hover:text-white transition-colors">
            <User size={18} />
            <span className="font-medium text-sm">Profile</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header (simplified for now) */}
        <div className="md:hidden h-16 border-b border-[#222] bg-[#0A0A0A] flex items-center px-4 justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo wordmark={false} markClassName="w-5 h-5" />
            <span className="font-display font-bold">Trailo</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/dashboard/trips" className="text-[#888]">Trips</Link>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
