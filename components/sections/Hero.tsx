'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MagneticButton from '../MagneticButton';
import MockChatAutomation from '../mocks/MockChatAutomation';

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Staggered clip-path reveal for headline lines
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Ensure we clearProps after animation so no residual transforms or clip-paths break layout
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
    )
    .fromTo(
      visualRef.current,
      { y: 40, autoAlpha: 0, scale: 0.98 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 1.5, ease: 'expo.out', clearProps: 'transform' },
      "-=0.8"
    );

  }, []);

  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      {/* Subtle abstract background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#111] via-[#050505] to-[#0A0A0A] -z-10"></div>
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Copy Area */}
          <div className="lg:w-1/2">
            {/* 
              Variant A: "Your trips sell, follow up, and get paid automatically, without you touching a spreadsheet."
              Variant B: "Turn WhatsApp chaos into automated bookings."
              Variant C: "The operating system for modern adventure organizers."
            */}
            <h1 
              ref={headlineRef}
              className="font-display font-bold text-5xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-tighter text-white mb-8"
            >
              Your trips sell, follow up, and get paid automatically, without you touching a spreadsheet.
            </h1>
            
            <p ref={sublineRef} className="text-[#888] text-xl md:text-2xl mb-12 max-w-lg">
              Built for trek and trip organizers running everything by hand.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-6">
              <MagneticButton href="/demo" variant="primary" className="px-8 py-4 text-base">
                Book a Demo
              </MagneticButton>
              <a href="#product" className="text-white text-sm font-medium hover:text-[#aaa] transition-colors flex items-center gap-2 group">
                See how it works
                <span className="block transform group-hover:translate-y-1 transition-transform">↓</span>
              </a>
            </div>
          </div>

          {/* Visual Area */}
          <div ref={visualRef} className="lg:w-1/2 w-full flex justify-center lg:justify-end perspective-1000">
            <div className="relative transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-1000 ease-out">
              <div className="absolute -inset-10 bg-[#2A8AF6]/10 blur-[100px] rounded-full pointer-events-none"></div>
              <MockChatAutomation />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
