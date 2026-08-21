'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Map } from 'lucide-react'
import { mockTrips } from '@/data/fixtures'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function RoadTripsPage() {
  const roadTrips = mockTrips.filter(t => t.vehicleTypes && t.vehicleTypes.length > 0)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#2A8AF6] selection:text-white">
      <SiteHeader />
      
      <main className="flex-1 flex flex-col pt-24 pb-12 overflow-hidden">
        <header className="px-6 md:px-12 mb-12 relative">
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter uppercase relative z-10">Road Trips</h1>
          <p className="font-sans text-xl text-[#888] mt-4 max-w-xl relative z-10">Endless asphalt, dirt trails, and the freedom of the open road.</p>
          
          <div className="absolute left-0 bottom-0 w-full h-1 overflow-hidden opacity-50 z-0 mb-4">
            <style jsx>{`
              @keyframes dash {
                to { stroke-dashoffset: -100; }
              }
              .anim-line {
                animation: dash 2s linear infinite;
              }
            `}</style>
            <svg width="100%" height="4" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="2" x2="1000%" y2="2" stroke="#2A8AF6" strokeWidth="2" strokeDasharray="20 20" className="anim-line" />
            </svg>
          </div>
        </header>

        <section className="w-full pl-6 md:pl-12">
          <div 
            className="flex gap-8 overflow-x-auto pb-12 pr-6 md:pr-12 snap-x snap-mandatory hide-scrollbar" 
            data-lenis-prevent="true"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {roadTrips.map((trip, idx) => {
              const nextTrip = roadTrips[idx + 1]
              const distanceToNext = nextTrip ? Math.abs(trip.distanceKm - nextTrip.distanceKm) : 0

              return (
                <div key={trip.id} className="min-w-[85vw] md:min-w-[600px] snap-start shrink-0 flex flex-col">
                  <div className="relative aspect-[16/9] bg-zinc-900 rounded-xl overflow-hidden mb-6 border border-[#222]">
                    {trip.heroMedia && (
                      <Image 
                        src={trip.heroMedia} 
                        alt={trip.title}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 85vw, 600px"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-mono text-sm flex items-center gap-2">
                      <Map size={14} className="text-[#2A8AF6]" />
                      <span>{trip.distanceKm} KM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="font-display text-3xl font-bold uppercase mb-2">{trip.title}</h2>
                      <div className="flex items-center gap-4 font-mono text-sm text-[#888]">
                        <span>{trip.duration} DAYS</span>
                        <span className="w-1 h-1 rounded-full bg-[#222]"></span>
                        <span className="uppercase">{trip.vehicleTypes?.join(', ')}</span>
                      </div>
                    </div>
                    
                    <Link href={`/trips/${trip.id}`} className="w-10 h-10 rounded-full border border-[#222] flex items-center justify-center hover:bg-white hover:text-black transition-colors shrink-0">
                      <ArrowRight size={20} />
                    </Link>
                  </div>

                  {nextTrip && (
                    <div className="mt-8 pt-8 border-t border-[#222] flex items-center gap-4 text-[#555] font-mono text-xs uppercase">
                      <span className="h-px bg-[#222] flex-1"></span>
                      <span>+{distanceToNext} km to next</span>
                      <span className="h-px bg-[#222] flex-1"></span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
