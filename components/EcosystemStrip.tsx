import Link from 'next/link';

export default function EcosystemStrip() {
  return (
    <div className="bg-background border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="text-foreground">Trailo</Link>
            <span className="opacity-50">|</span>
            <a href="https://stayo.girivah.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">StayO</a>
            <span className="opacity-50">|</span>
            <span className="text-muted-foreground/70" title="Coming soon">Rido</span>
          </div>

          <div className="text-xs text-muted-foreground uppercase tracking-widest">
            A Girivah Ecosystem Product
          </div>
        </div>
      </div>
    </div>
  );
}
