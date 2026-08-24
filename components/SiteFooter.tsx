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
            List your trips. We build the page.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>

      </div>

      <EcosystemStrip />
    </footer>
  );
}
