import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function GenericPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center pt-32 pb-24 px-6 text-center">
        <div>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tighter text-white mb-6 uppercase">
            Coming Soon
          </h1>
          <p className="text-[#888] max-w-2xl mx-auto text-lg">
            This section of the Girivah ecosystem is currently being charted. Check back later.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
