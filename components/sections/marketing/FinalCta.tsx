'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import Reveal from '@/components/motion/Reveal';
import MagneticButton from '@/components/MagneticButton';
import ContourField from '@/components/visuals/ContourField';

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const contour = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      // Breathing motion on the last conversion moment of the page, carried
      // by the site's own topographic contour lines instead of a generic
      // radial blur — same ambient duration/ease tokens as before.
      gsap.to(contour.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause'
        },
        opacity: 1,
        scale: 1.05,
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
      <div ref={contour} className="absolute inset-0 opacity-60">
        <ContourField tone="accent" density="low" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <h2 className="text-display-lg font-bold mb-6">
            Your first trip page can be live before your next trip fills up.
          </h2>
          <p className="text-body-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            <Link href="/pricing" className="text-foreground hover:text-accent transition-colors underline underline-offset-4">Free to start</Link>. Trip details in, hosted page out. No developer, no designer.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <MagneticButton href="/register" variant="accent" className="px-10 py-5 text-lg">
              Register your business
            </MagneticButton>
            <p className="text-caption text-muted-foreground">5 steps, ~4 minutes · verification optional</p>
            <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
              Talk to us first →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
