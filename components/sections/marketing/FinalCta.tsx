'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import Reveal from '@/components/motion/Reveal';
import MagneticButton from '@/components/MagneticButton';
import ContourField from '@/components/visuals/ContourField';

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      // Slow ambient breathing on the last conversion moment of the page —
      // rare/high-emotion surface, so a longer looping beat is in budget.
      gsap.to(glow.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause'
        },
        scale: 1.08,
        opacity: 0.22,
        duration: DURATION.ambient,
        ease: EASE.ambient,
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-10 border-t border-border overflow-hidden">
      <ContourField tone="accent" density="low" className="opacity-30" />

      {/* Radial glow */}
      <div
        ref={glow}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square rounded-full bg-accent/15 blur-[120px] pointer-events-none"
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <h2 className="text-display-lg font-bold mb-6">
            You build the journeys.<br />We build the business around them.
          </h2>
          <p className="text-body-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Free to start. Your first landing page can be live before your next trip fills up.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <MagneticButton href="/register" variant="primary" className="px-10 py-5 text-lg shadow-xl shadow-accent/20">
              Register your business
            </MagneticButton>
            <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              Talk to us first →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
