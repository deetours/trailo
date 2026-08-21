'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MagneticButton from '../MagneticButton';
import { mockTrips } from '@/data/fixtures';

export default function Hero() {
  const containerRef = useRef<HTMLSelectElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        headlineRef.current,
        { y: 50, autoAlpha: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { y: 0, autoAlpha: 1, clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0 120%)', duration: 1.2, delay: 0.2, clearProps: 'all' }
      )
      .fromTo(
        sublineRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, clearProps: 'transform' },
        "-=0.8"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, clearProps: 'transform' },
        "-=0.8"
      );
    });

  }, { scope: containerRef });

  const heroImage = mockTrips[0]?.heroMedia || '';

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-end pb-20 md:pb-32 overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent -z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="w-full max-w-4xl">
          <h1 
            ref={headlineRef}
            className="font-display font-bold text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] tracking-tighter text-white mb-6"
          >
            Rohtang Pass closes most years by late October.
          </h1>
          
          <p ref={sublineRef} className="text-[#ccc] text-lg md:text-2xl mb-10 max-w-2xl font-sans">
            The route from Manali to Keylong is 1,200 km through terrain that doesn&apos;t forgive bad planning.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-6">
            <MagneticButton href="/explore" variant="primary" className="px-8 py-4 text-base">
              Explore trips
            </MagneticButton>
            <a href="/signup" className="text-white text-sm font-medium hover:text-[#aaa] transition-colors flex items-center gap-2 group">
              Start planning
              <span className="block transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
