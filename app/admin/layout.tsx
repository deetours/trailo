import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen h-[100dvh] bg-[#050505] font-sans text-white flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-64 border-r border-[#222] bg-[#0A0A0A] flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-[#222]">
          <Link href="/admin/whatsapp" className="flex items-center gap-2 group">
            <div className="bg-white text-black p-1.5 rounded flex items-center justify-center">
              <Logo wordmark={false} markClassName="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:block">Ops</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-2">
          <Link href="/admin/whatsapp" className="flex items-center gap-3 px-0 md:px-3 mx-2 md:mx-4 py-2.5 rounded-lg text-white bg-[#111] transition-colors justify-center md:justify-start">
            <MessageCircle size={18} />
            <span className="font-medium text-sm hidden md:block">WhatsApp</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
