import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-8">
          About Trailo
        </h1>
        <div className="prose prose-invert prose-lg text-[#888]">
          <p>
            Trailo was built because we were tired of planning incredible journeys using tools designed for office work.
          </p>
          <p>
            A road trip shouldn&apos;t live in a spreadsheet. A trek shouldn&apos;t be scattered across three group chats and a notes app. 
            We wanted one place that held the entire arc of the trip—from the initial spark of an idea, to the packing list, to the route map, to the memory of it afterward.
          </p>
          <p>
            We are part of the Girivah ecosystem, dedicated to building software that gets you offline and outside.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
