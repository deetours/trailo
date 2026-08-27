'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ReactNode, useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // Prevents GSAP from lagging behind Lenis

    // Big Shoulders / Inter can swap in after ScrollTrigger has already
    // measured pin start/end positions (e.g. TripToPage's pinned section) —
    // refresh once fonts are actually loaded instead of guessing a timeout.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    // Handle mobile address bar show/hide which resizes visual viewport
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(update);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        autoResize: true // important for ScrollTrigger
      }}
    >
      {children}
    </ReactLenis>
  );
}
