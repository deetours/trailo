import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#050505] border-t border-[#111]">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-display font-bold text-2xl tracking-tighter mb-2 text-white">
            Trailo
          </Link>
          <p className="text-[#666] text-sm">
            Automation software for trek & trip organizers.
          </p>
        </div>
        
        <div className="flex items-center gap-8 text-sm font-medium text-[#888]">
          <Link href="#product" className="hover:text-white transition-colors">Product</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#customers" className="hover:text-white transition-colors">Customers</Link>
        </div>
        
      </div>
      
      {/* Ecosystem Strip */}
      <div className="border-t border-[#111] py-4 bg-[#0A0A0A]">
        <div className="container mx-auto px-6 flex justify-center items-center gap-6 text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono font-bold">
          <span className="text-white">Trailo</span>
          <span>&middot;</span>
          <span>StayO</span>
          <span>&middot;</span>
          <span>Rido</span>
          <span>&middot;</span>
          <span>Girivah</span>
        </div>
      </div>
    </footer>
  );
}
