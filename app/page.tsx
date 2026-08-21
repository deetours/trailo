import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/sections/Hero';
import { RoadOrTrek } from '@/components/sections/RoadOrTrek';
import RouteScrub from '@/components/sections/RouteScrub';
import DiscoverTrips from '@/components/sections/DiscoverTrips';
import TheAssembly from '@/components/sections/TheAssembly';
import Invitation from '@/components/sections/Invitation';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full">
      <SiteHeader />
      <Hero />
      <RoadOrTrek />
      <RouteScrub />
      <DiscoverTrips />
      <TheAssembly />
      <Invitation />
      <SiteFooter />
    </main>
  );
}
