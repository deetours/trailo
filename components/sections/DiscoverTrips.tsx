import React from 'react';
import Link from 'next/link';
import { mockTrips } from '@/data/fixtures';
import { ArrowRight } from 'lucide-react';

export default function DiscoverTrips() {
  return (
    <section className="bg-[#0A0A0A] text-white py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            What&apos;s worth the drive right now.
          </h2>
        </header>

        <div className="flex flex-col">
          {mockTrips.map((trip, idx) => {
            const isEven = idx % 2 === 1;
            
            // Generate a specific descriptive line based on the trip
            let descriptionLine = "A demanding but rewarding journey across high-altitude passes.";
            if (trip.slug === 'manali-keylong' || trip.slug === 't1') {
              descriptionLine = "Starts in Manali. Crosses Rohtang. Ends in the cold desert.";
            } else if (trip.slug === 'spiti-valley' || trip.slug === 't2' || trip.title.toLowerCase().includes('spiti')) {
              descriptionLine = "Traverse the high Himalayas into the middle land of Spiti.";
            }

            return (
              <div 
                key={trip.id} 
                className={`flex flex-col md:flex-row gap-12 lg:gap-24 py-16 border-b border-[#222] last:border-b-0 items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#222] group">
                    <Link href={`/trips/${trip.slug}`}>
                      <img 
                        src={trip.heroMedia} 
                        alt={trip.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </div>
                </div>

                {/* Data Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    <Link href={`/trips/${trip.slug}`} className="hover:text-[#2A8AF6] transition-colors">
                      {trip.title}
                    </Link>
                  </h3>
                  
                  <div className="font-mono text-sm text-[#888] mb-6 flex flex-wrap gap-2 items-center">
                    <span>{trip.distanceKm} km</span>
                    <span>·</span>
                    <span>{trip.duration} days</span>
                    <span>·</span>
                    <span className="capitalize">{trip.difficulty}</span>
                  </div>
                  
                  <p className="text-lg text-[#ccc] font-sans mb-8">
                    {descriptionLine}
                  </p>

                  <div>
                    <Link 
                      href={`/trips/${trip.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white hover:text-[#2A8AF6] transition-colors group"
                    >
                      View Itinerary
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
