import Link from 'next/link';
import Logo from '@/components/Logo';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <header className="p-6 md:p-10 flex items-center justify-between border-b border-border">
        <Link href="/dashboard" className="group flex items-center gap-2">
          <Logo className="text-foreground group-hover:text-muted-foreground transition-colors" markClassName="w-6 h-6" />
        </Link>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back to dashboard
        </Link>
      </header>

      <div className="flex-1 flex justify-center p-6 md:p-10">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </main>
  );
}
