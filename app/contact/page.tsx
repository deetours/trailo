import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MagneticButton from '@/components/MagneticButton';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl text-center">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-6">
          Get in touch
        </h1>
        <p className="text-[#888] text-xl mb-12">
          Questions, bug reports, or feature requests? We&apos;re all ears.
        </p>
        
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-left max-w-lg mx-auto">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#ccc] block mb-2">Email</label>
              <input type="email" className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#ccc] block mb-2">Message</label>
              <textarea className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] min-h-[120px]"></textarea>
            </div>
            <MagneticButton href="#" variant="primary" className="w-full py-3 mt-4 text-center justify-center">
              Send Message
            </MagneticButton>
          </form>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
