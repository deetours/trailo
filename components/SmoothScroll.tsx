'use client';

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useEffect, useRef } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

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

      return () => {
        gsap.ticker.remove(update);
        clearTimeout(timeout);
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
