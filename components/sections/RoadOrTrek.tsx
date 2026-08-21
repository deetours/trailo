'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { mockTrips } from '@/data/fixtures'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function RoadOrTrek() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Using the first trip from fixtures for the numbers as requested
  const roadTrip = mockTrips[0] 
  const trekTrip = mockTrips[0]

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(leftRef.current, {
        flexBasis: '55%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      })
      gsap.to(rightRef.current, {
        flexBasis: '45%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative w-full h-auto md:h-[100svh] flex flex-col md:flex-row overflow-hidden bg-zinc-950">
      {/* Road Half */}
      <div 
        ref={leftRef} 
        className="w-full md:flex-1 md:basis-1/2 min-h-[300px] md:min-h-full relative flex flex-col justify-center items-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 transition-all group"
      >
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #ffffff 20px, #ffffff 40px)',
          backgroundSize: '4px 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        
        <div className="z-10 text-center flex flex-col items-center gap-4">
          <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight uppercase">Road Trips</h2>
          <p className="font-sans text-lg text-zinc-400">Drive, ride, convoy</p>
          
          <div className="flex gap-4 font-mono text-sm text-zinc-300 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 mt-4">
            <span>{roadTrip.distanceKm} km</span>
            <span>&bull;</span>
            <span className="capitalize">{roadTrip.vehicleTypes?.[0] || '4x4'}</span>
          </div>

          <Link href="/road-trips" className="mt-8 flex items-center justify-center w-12 h-12 rounded-full bg-[#2A8AF6] text-white hover:scale-110 transition-transform">
            <ArrowRight size={24} />
          </Link>
        </div>
      </div>

      {/* Trek Half */}
      <div 
        ref={rightRef}
        className="w-full md:flex-1 md:basis-1/2 min-h-[300px] md:min-h-full relative flex flex-col justify-center items-center p-8 md:p-12 transition-all group"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 50 Q 25 30 50 50 T 100 50 T 150 50 T 200 50 T 250 50\' stroke=\'%23ffffff\' fill=\'none\' stroke-width=\'2\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 100px'
        }}></div>

        <div className="z-10 text-center flex flex-col items-center gap-4">
          <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight uppercase">Treks</h2>
          <p className="font-sans text-lg text-zinc-400">Hike, climb, camp</p>
          
          <div className="flex gap-4 font-mono text-sm text-zinc-300 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 mt-4">
            <span className="capitalize">{trekTrip.difficulty}</span>
            <span>&bull;</span>
            <span>{trekTrip.duration} days</span>
          </div>

          <Link href="/treks" className="mt-8 flex items-center justify-center w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">
            <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </section>
  )
}
