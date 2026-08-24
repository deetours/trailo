'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface RouteLineProps {
  mode?: 'onEnter' | 'scrub';
  className?: string;
}

export default function RouteLine({ mode = 'onEnter', className }: RouteLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!pathRef.current || !containerRef.current) return;
    
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

    let ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      if (mode === 'scrub') {
        gsap.to(pathRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.3,
          },
          strokeDashoffset: 0,
          ease: 'none'
        });
      } else {
        gsap.to(pathRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            once: true,
          },
          strokeDashoffset: 0,
          duration: 1.5,
          ease: EASE.inOut
        });
      }
    });

    ctx.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(pathRef.current, { strokeDashoffset: 0 });
    });

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* We use a generic squiggly line for demo purposes; the real design would use exact SVGs */}
        <path 
          ref={pathRef}
          d="M 50,0 C 50,20 100,40 50,50 C 0,60 50,80 50,100"
          fill="none" 
          stroke="var(--accent)" 
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
