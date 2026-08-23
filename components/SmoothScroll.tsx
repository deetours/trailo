'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Sync Lenis with GSAP ScrollTrigger
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      function update(time: number) {
        lenisRef.current?.lenis?.raf(time * 1000);
      }
      
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0); // Prevents GSAP from lagging behind Lenis

      // Refresh ScrollTrigger when components mount to recalculate pin heights
      const timeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      // Handle mobile address bar show/hide which resizes visual viewport
      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.visualViewport?.addEventListener('resize', handleResize);

      return () => {
        gsap.ticker.remove(update);
        clearTimeout(timeout);
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <ReactLenis 
      ref={lenisRef} 
      root 
      options={{ 
        lerp: 0.05, 
        duration: 1.5, 
        smoothWheel: true,
        autoResize: true // important for ScrollTrigger
      }}
    >
      {children}
    </ReactLenis>
  );
}
