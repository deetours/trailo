'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { mockTrips } from '@/data/fixtures';
import { routePrepMarks } from '@/data/routes';
import type { Trip } from '@/types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// routePrepMarks (data/routes.ts) is real waypoint data for the Manali–Keylong
// corridor specifically — it only applies to the Great Himalayan Crossing trip,
// so it's shown only when that trip is the one being rendered.
export default function TheAssembly({ trip = mockTrips[0] }: { trip?: Trip }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const showRoutePrepMarks = trip.slug === 'great-himalayan-crossing';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!pathRef.current) return;
        
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        
        // Ensure starting state is clean
        gsap.set('.title-text', { filter: 'blur(20px)', opacity: 0 });
        gsap.set('.route-dot', { scale: 0, opacity: 0 });
        gsap.set('.prep-mark', { autoAlpha: 0, y: 10 });
        gsap.set('.season-stamp', { autoAlpha: 0, y: 20 });
        gsap.set('.gallery-strip', { autoAlpha: 0, scale: 0.9 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });

        // 0-15%: Trip title resolves from blur. Two dots appear.
        tl.to(
          '.title-text',
          { filter: 'blur(0px)', opacity: 1, duration: 0.15 },
          0
        );
        tl.to(
          '.route-dot',
          { scale: 1, opacity: 1, duration: 0.1, stagger: 0.05 },
          0.05
        );

        // 15-40%: Route line draws.
        tl.to(
          pathRef.current,
          { strokeDashoffset: 0, duration: 0.25 },
          0.15
        );

        // 40-55%: Marks appear on the route.
        tl.to(
          '.prep-mark',
          { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.05 },
          0.4
        );

        // 55-70%: Route stamps with dates, bestSeason.
        tl.to(
          '.season-stamp',
          { autoAlpha: 1, y: 0, duration: 0.15 },
          0.55
        );

        // 70-90%: Gallery strip assembles.
        tl.to(
          '.gallery-strip',
          { autoAlpha: 1, scale: 1, duration: 0.2 },
          0.7
        );
        
        // 90-100% Hold.
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Reduced motion fallback: Make sure everything is visible initially.
        if (pathRef.current) {
          gsap.set(pathRef.current, { strokeDashoffset: 0 });
        }
        gsap.set('.title-text, .route-dot, .prep-mark, .season-stamp, .gallery-strip', {
           opacity: 1, autoAlpha: 1, filter: 'blur(0px)', scale: 1 
        });
      });
      
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#0A0A0A] text-white">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center pt-24 px-4 sm:px-8">
        
        {/* Title */}
        <div className="title-text text-center z-10 mb-12">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">{trip?.title || 'Manali to Keylong'}</h2>
          <p className="text-[#888] font-sans text-lg">{trip?.itinerary[0]?.route || 'Manali → Rohtang Pass → Sissu → Keylong'}</p>
        </div>

        {/* The Route Visualization */}
        <div className="relative w-full max-w-4xl h-48 md:h-64 my-8 flex items-center">
          {/* SVG Line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
            <path
              ref={pathRef}
              d="M 50,100 C 250,20 750,180 950,100"
              fill="none"
              stroke="#2A8AF6"
              strokeWidth="4"
              strokeLinecap="round"
              className="route-path"
            />
          </svg>

          {/* Start and End Dots */}
          <div className="route-dot absolute left-[5%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0A0A0A] z-10 shadow-lg" />
          <div className="route-dot absolute left-[95%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0A0A0A] z-10 shadow-lg" />

          {/* Prep Marks */}
          {showRoutePrepMarks && routePrepMarks?.map((mark, i) => {
            // Rough percentages along the path for visual distribution
            const leftPositions = ['25%', '50%', '75%'];
            const topPositions = ['35%', '65%', '45%'];
            
            return (
              <div 
                key={mark.waypointName || i}
                className="prep-mark absolute flex flex-col items-center z-20"
                style={{
                  left: leftPositions[i % leftPositions.length],
                  top: topPositions[i % topPositions.length],
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-3 h-3 rounded-full bg-[#2A8AF6] shadow-[0_0_10px_rgba(42,138,246,0.5)]" />
                <span className="text-xs font-mono mt-2 bg-[#0A0A0A] px-2 py-1 rounded border border-[#222] text-[#ccc] flex items-center gap-1">
                  <span>{mark.icon}</span>
                  <span>{mark.waypointName}: {mark.label}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Dates / Season Stamp */}
        <div className="season-stamp text-center mt-4 mb-12">
          <span className="inline-block border border-[#222] rounded-full px-4 py-2 font-mono text-sm text-[#888] bg-black/50 backdrop-blur">
            Best Season: {trip?.bestSeason || 'June – September'}
          </span>
        </div>

        {/* Gallery Strip */}
        <div className="gallery-strip w-full max-w-5xl flex gap-4 overflow-hidden pt-4 pb-12">
          {(trip?.gallery || []).slice(0, 4).map((url, i) => (
            <div key={i} className="relative w-1/4 aspect-[4/3] rounded-lg overflow-hidden border border-[#222]">
              <Image src={url} alt={`Trip memory ${i + 1}`} fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
