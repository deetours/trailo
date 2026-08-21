import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import DiscoverTrips from '@/components/sections/DiscoverTrips';
import { mockTrips, mockDestinations } from '@/data/fixtures';
import { Calendar, MapPin } from 'lucide-react';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      
      <div className="container mx-auto px-6 py-20">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-6">
          Explore
        </h1>
        <p className="text-[#888] text-xl max-w-2xl mb-16">
          Find your next journey. Whether it&apos;s a coastal drive or a high-altitude trek, start here.
        </p>

        {/* Mapbox Area Placeholder for Phase 10 */}
        <div className="w-full h-[50vh] bg-[#111] rounded-2xl border border-[#222] flex items-center justify-center mb-20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#0d0d0d] group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="relative z-10 text-center">
            <span className="font-mono text-sm uppercase tracking-widest text-[#444] block mb-2">Interactive Map</span>
            <span className="text-[#888] text-sm">
              Visualizing {mockTrips.length} trips and {mockDestinations.length} destinations
            </span>
          </div>
        </div>

        {/* Destinations List */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-white mb-8">Featured Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDestinations.map(dest => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#444] transition-colors flex flex-col">
                <div className="h-48 bg-[#222] relative overflow-hidden">
                  {dest.heroMedia && (
                    <img src={dest.heroMedia} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#888] mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {dest.region}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {dest.bestTime}</span>
                  </div>
                  <p className="text-[#ccc] text-sm line-clamp-2 mt-auto">{dest.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <DiscoverTrips />
      
      <SiteFooter />
    </main>
  );
}
