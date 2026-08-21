import Link from 'next/link';
import { ArrowLeft, Clock, Map, Navigation, Copy, Calendar } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MagneticButton from '@/components/MagneticButton';
import { mockTrips, mockStays, mockExperiences } from '@/data/fixtures';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return mockTrips.map(t => ({ slug: t.slug }));
}

export default async function TripPublicView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const trip = mockTrips.find(t => t.slug === slug);
  if (!trip) {
    notFound();
  }

  const includedStaysData = trip.includedStays?.map(id => mockStays.find(s => s.id === id)).filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-[#0A0A0A] w-full pt-20">
      <SiteHeader />
      
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[600px] flex items-end pb-20 overflow-hidden border-b border-[#222]">
        <div className="absolute inset-0 bg-[#0d0d0d] flex items-center justify-center text-[#222] font-mono text-xs uppercase tracking-widest">
          {trip.heroMedia ? (
            <img src={trip.heroMedia} alt={trip.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            `Visual: Hero Image for ${trip.title}`
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-medium text-[#888] hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Back to explore
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
              {trip.vehicleTypes.length > 0 ? 'Road Trip' : 'Trek'}
            </span>
            <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#ccc] border border-white/5">
              {trip.difficulty}
            </span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-6 max-w-4xl">
            {trip.title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <p className="text-[#ccc] text-xl max-w-2xl">
              A {trip.duration}-day {trip.difficulty.toLowerCase()} journey spanning {trip.distanceKm} km. Best experienced in {trip.bestSeason}.
            </p>
            <MagneticButton href="/signup" variant="primary" className="shrink-0 px-8 py-3">
              <span className="flex items-center gap-2">
                <Copy size={16} /> Clone this trip
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Main Content */}
        <div className="lg:w-2/3 space-y-16">
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">About this route</h2>
            <p className="text-[#888] leading-relaxed text-lg whitespace-pre-wrap">
              An expedition spanning {trip.distanceKm} km across {trip.duration} days. Best experienced in {trip.bestSeason}.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Itinerary Outline</h2>
            <div className="space-y-8 pl-4 border-l border-[#222]">
              {trip.itinerary.map((day) => (
                <div key={day.day} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#2A8AF6]"></div>
                  <div className="text-sm font-medium text-[#2A8AF6] mb-1">Day {day.day}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{day.title}</h3>
                  {day.notes && <p className="text-[#888] mb-3">{day.notes}</p>}
                  {day.route && (
                    <div className="text-sm text-[#aaa] font-mono mb-2 bg-[#111] inline-block px-3 py-1 rounded border border-[#222]">
                      Route: {day.route}
                    </div>
                  )}
                  {day.activities.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-[#ccc] space-y-1 mt-2">
                      {day.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {includedStaysData.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-white mb-8">Included Stays</h2>
              <div className="grid gap-6">
                {includedStaysData.map(stay => (
                  <div key={stay!.id} className="bg-[#111] border border-[#222] rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{stay!.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#888] mb-3">
                      <span className="flex items-center gap-1.5"><Map size={14} /> {stay!.location}</span>
                      <span className="flex items-center gap-1.5 capitalize bg-[#222] px-2 py-0.5 rounded">{stay!.type}</span>
                    </div>
                    {stay!.description && <p className="text-[#ccc] text-sm">{stay!.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="bg-[#111] rounded-2xl border border-[#222] p-8 sticky top-28">
            <h3 className="font-bold text-white text-lg mb-6">Trip Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#888]">
                <Navigation size={18} className="text-[#ccc]" />
                <span>{trip.distanceKm} km total distance</span>
              </div>
              <div className="flex items-center gap-3 text-[#888]">
                <Clock size={18} className="text-[#ccc]" />
                <span>{trip.duration} days suggested</span>
              </div>
              <div className="flex items-center gap-3 text-[#888]">
                <Calendar size={18} className="text-[#ccc]" />
                <span>Best in {trip.bestSeason}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-[#222]">
              <div className="text-sm text-[#888] mb-4">Ready to go?</div>
              <button className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-[#eaeaea] transition-colors flex items-center justify-center gap-2">
                <Copy size={16} /> Clone to Dashboard
              </button>
            </div>
          </div>
        </aside>
      </div>
      
      <SiteFooter />
    </main>
  );
}
