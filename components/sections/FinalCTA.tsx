'use client';

import MagneticButton from '../MagneticButton';

export default function FinalCTA() {
  return (
    <section className="py-40 bg-[#050505] relative overflow-hidden border-t border-[#111]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2A8AF6]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white mb-8 max-w-4xl mx-auto leading-tight">
          Your trips sell, follow up, and get paid automatically, without you touching a spreadsheet.
        </h2>
        <p className="text-[#888] text-xl mb-12">
          Stop running your operations on WhatsApp.
        </p>
        <MagneticButton href="/demo" variant="primary" className="px-10 py-5 text-lg">
          Book a Demo
        </MagneticButton>
      </div>
    </section>
  );
}
