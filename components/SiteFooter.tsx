import Link from 'next/link';
import EcosystemStrip from './EcosystemStrip';

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#050505] border-t border-[#111]">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">

        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter mb-2 text-white">
            Trailo
          </Link>
          <p className="text-[#666] text-sm">
            Plan the trip. Not the spreadsheet.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-8 text-sm font-medium text-[#888]">
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/road-trips" className="hover:text-white transition-colors">Road Trips</Link>
            <Link href="/treks" className="hover:text-white transition-colors">Treks</Link>
            <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-[#555]">
            <Link href="/destinations" className="hover:text-[#888] transition-colors">Destinations</Link>
            <Link href="/about" className="hover:text-[#888] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#888] transition-colors">Contact</Link>
          </div>
        </div>

      </div>

      <EcosystemStrip />
    </footer>
  );
}
