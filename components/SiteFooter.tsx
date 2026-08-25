import Link from 'next/link';
import EcosystemStrip from './EcosystemStrip';

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-background border-t border-border">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter mb-2 text-foreground">
            Trailo
          </Link>
          <p className="text-muted-foreground text-sm">
            Your trips, hosted and ready to share.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-2 text-sm font-medium text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>

      <EcosystemStrip />
    </footer>
  );
}
