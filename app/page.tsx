import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NoiseOverlay from '@/components/visuals/NoiseOverlay';
import Hero from '@/components/sections/marketing/Hero';
import BusinessReality from '@/components/sections/marketing/BusinessReality';
import PlatformLoop from '@/components/sections/marketing/PlatformLoop';
import TripToPage from '@/components/sections/marketing/TripToPage';
import BrandedPages from '@/components/sections/marketing/BrandedPages';
import Roadmap from '@/components/sections/marketing/Roadmap';
import SocialProof from '@/components/sections/marketing/SocialProof';
import FinalCta from '@/components/sections/marketing/FinalCta';

export default function Home() {
  return (
    <main className="min-h-screen bg-background w-full relative">
      <NoiseOverlay />
      <SiteHeader />
      <Hero />
      <BusinessReality />
      <PlatformLoop />
      <TripToPage />
      <BrandedPages />
      <Roadmap />
      <SocialProof />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
