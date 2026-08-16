import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/sections/Hero';
import TheProblem from '@/components/sections/TheProblem';
import TheProduct from '@/components/sections/TheProduct';
import Credibility from '@/components/sections/Credibility';
import Pricing from '@/components/sections/Pricing';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full">
      <SiteHeader />
      <Hero />
      <TheProblem />
      <TheProduct />
      <Credibility />
      <Pricing />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
