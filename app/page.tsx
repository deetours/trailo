import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/sections/Hero';
import { RoadOrTrek } from '@/components/sections/RoadOrTrek';
import RouteScrub from '@/components/sections/RouteScrub';
import DiscoverTrips from '@/components/sections/DiscoverTrips';
import Invitation from '@/components/sections/Invitation';

// TheAssembly (the second Manali–Keylong route sequence) now lives on the
// Great Himalayan Crossing trip page instead of repeating here right after
// RouteScrub — see app/trips/[slug]/page.tsx.
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full">
      <SiteHeader />
      <Hero />
      <RoadOrTrek />
      <RouteScrub />
      <DiscoverTrips />
      <Invitation />
      <SiteFooter />
    </main>
  );
}
