import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-6">
          Field Notes
        </h1>
        <p className="text-[#888] text-xl max-w-2xl mx-auto mb-16">
          Stories, guides, and dispatches from the road and trail.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/2] bg-[#111] rounded-2xl mb-4 overflow-hidden relative border border-[#222]">
                <div className="absolute inset-0 bg-[#0d0d0d] group-hover:scale-105 transition-transform duration-700"></div>
              </div>
              <div className="text-[#888] text-xs font-mono uppercase tracking-widest mb-2">Guide</div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#2A8AF6] transition-colors">How to pack for a 7-day trek</h2>
              <p className="text-[#888]">The definitive checklist to keep your pack light and your back intact.</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
