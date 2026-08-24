'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { cn } from '@/lib/cn';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRegister = pathname.startsWith('/register');

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <header className="p-6 md:p-10 flex items-center justify-between">
        <Link href="/" className="group">
          <Logo className="text-foreground group-hover:text-muted-foreground transition-colors" markClassName="w-6 h-6" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className={cn('w-full', isRegister ? 'max-w-2xl' : 'max-w-md')}>
          {children}
        </div>
      </div>
    </main>
  );
}
