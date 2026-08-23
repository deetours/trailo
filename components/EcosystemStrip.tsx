import Link from 'next/link';

export default function EcosystemStrip() {
  return (
    <div className="bg-[#050505] border-t border-[#222] py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-[#888]">
            <Link href="/" className="text-white">Trailo</Link>
            <span className="opacity-50">|</span>
            <a href="https://stayo.girivah.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">StayO</a>
            <span className="opacity-50">|</span>
            <span className="text-[#555]" title="Coming soon">Rido</span>
          </div>
          
          <div className="text-xs text-[#666] uppercase tracking-widest">
            A Girivah Ecosystem Product
          </div>
        </div>
      </div>
    </div>
  );
}
