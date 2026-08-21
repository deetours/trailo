import Link from 'next/link';
import { MapPin, Calendar, Clock, Navigation } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import DiscoverTrips from '@/components/sections/DiscoverTrips';
import { mockDestinations, mockTrips } from '@/data/fixtures';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return mockDestinations.map(d => ({ slug: d.slug }));
}

export default async function DestinationPublicView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const destination = mockDestinations.find(d => d.slug === slug);
  if (!destination) {
    notFound();
  }

  const relatedTrips = mockTrips.filter(t => t.relatedDestinations.includes(destination.id));

  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      
      {/* Destination Hero */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden border-b border-[#222]">
        <div className="absolute inset-0 bg-[#0d0d0d] flex items-center justify-center text-[#222] font-mono text-xs uppercase tracking-widest">
          {destination.heroMedia ? (
            <img src={destination.heroMedia} alt={destination.name} className="w-full h-full object-cover opacity-50" />
          ) : (
            `Visual: Destination Image for ${destination.name}`
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6">
          <div className="text-[#888] font-medium text-sm mb-4 tracking-widest uppercase flex justify-center items-center gap-2">
            <MapPin size={14} /> {destination.region}
          </div>
          <h1 className="font-display font-bold text-6xl md:text-8xl text-white tracking-tighter mb-6 capitalize">
            {destination.name}
          </h1>
          <p className="text-[#ccc] text-xl max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Calendar size={18} /> Best time to visit: {destination.bestTime}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-6">About {destination.name}</h2>
          <p className="text-[#888] text-lg leading-relaxed">
            {destination.description}
          </p>
        </div>

        {relatedTrips.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Trips in {destination.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTrips.map(trip => (
                <Link key={trip.id} href={`/trips/${trip.slug}`} className="group bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#444] transition-colors flex flex-col">
                  <div className="h-48 bg-[#222] relative overflow-hidden">
                    {trip.heroMedia ? (
                      <img src={trip.heroMedia} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#444] text-xs font-mono">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {trip.vehicleTypes.length > 0 ? 'Road Trip' : 'Trek'}
                      </span>
                      <span className="text-[#888] text-xs">{trip.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{trip.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#888] mb-4">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {trip.duration}d</span>
                      <span className="flex items-center gap-1.5"><Navigation size={14} /> {trip.distanceKm}km</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <DiscoverTrips />
      
      <SiteFooter />
    </main>
  );
}
