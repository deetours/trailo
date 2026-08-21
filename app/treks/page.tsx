'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mountain } from 'lucide-react'
import { mockTrips } from '@/data/fixtures'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

function getDifficultyAngle(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 15
    case 'moderate': return 30
    case 'hard': return 45
    case 'expert': return 60
    default: return 0
  }
}

function getDifficultyWeight(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 1
    case 'moderate': return 2
    case 'hard': return 3
    case 'expert': return 4
    default: return 0
  }
}

export default function TreksPage() {
  const treks = [...mockTrips].sort((a, b) => getDifficultyWeight(a.difficulty) - getDifficultyWeight(b.difficulty))

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#2A8AF6] selection:text-white relative z-0">
      <SiteHeader />
      
      <main className="flex-1 flex flex-col pt-24 pb-24 relative z-10">
        <header className="px-6 md:px-12 mb-16 relative">
          <div className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none -z-10 opacity-[0.04]">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full fill-white">
              <path d="M0,200 L0,100 L50,120 L100,80 L150,110 L200,60 L250,90 L300,40 L350,100 L400,30 L450,80 L500,20 L550,70 L600,10 L650,60 L700,40 L750,90 L800,20 L850,70 L900,10 L950,50 L1000,0 L1000,200 Z" />
            </svg>
          </div>
          
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter uppercase">Treks</h1>
          <p className="font-sans text-xl text-[#888] mt-4 max-w-xl">Ascend to new heights. One step, one breath, one summit at a time.</p>
        </header>

        <section className="px-6 md:px-12 max-w-6xl mx-auto w-full flex flex-col gap-12">
          {treks.map((trip) => {
            const angle = getDifficultyAngle(trip.difficulty)
            
            return (
              <article key={trip.id} className="group flex flex-col md:flex-row gap-8 items-center border border-[#222] bg-[#0c0c0c] p-6 rounded-2xl hover:border-[#444] transition-colors">
                <div className="w-full md:w-2/5 aspect-[4/3] relative rounded-xl overflow-hidden shrink-0">
                  {trip.heroMedia ? (
                    <Image 
                      src={trip.heroMedia} 
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                      <Mountain size={48} className="text-[#333]" />
                    </div>
                  )}
                </div>

                <div className="w-full md:w-3/5 flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-3 font-mono text-sm uppercase">
                    <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-3 py-1 rounded-full">
                      <div 
                        className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-[#2A8AF6]" 
                        style={{ transform: `rotate(${angle}deg)` }}
                      />
                      <span className={
                        trip.difficulty === 'Expert' ? 'text-red-400' :
                        trip.difficulty === 'Hard' ? 'text-orange-400' :
                        trip.difficulty === 'Moderate' ? 'text-yellow-400' :
                        'text-green-400'
                      }>{trip.difficulty}</span>
                    </div>
                    <span className="text-[#666]">&bull;</span>
                    <span className="text-[#ccc]">{trip.duration} DAYS</span>
                    <span className="text-[#666]">&bull;</span>
                    <span className="text-[#ccc]">{trip.distanceKm} KM</span>
                  </div>

                  <div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-4">{trip.title}</h2>
                    <p className="font-sans text-[#888] line-clamp-3">
                      {trip.itinerary.map((d) => d.title).join(' • ')}
                    </p>
                  </div>

                  <Link href={`/trips/${trip.id}`} className="mt-auto self-start flex items-center gap-3 text-[#ccc] hover:text-white transition-colors group/link font-mono uppercase text-sm tracking-wider">
                    <span>View Expedition</span>
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
