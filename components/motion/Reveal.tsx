'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  variant?: 'fade' | 'clip' | 'scale';
}

export default function Reveal({ children, className, delay = 0, stagger = 0, y = 24, variant = 'fade' }: RevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    const ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = {
        trigger: container.current,
        start: 'top 85%',
        once: true,
      };

      if (variant === 'clip') {
        gsap.fromTo(container.current!.children,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0 120%)',
            duration: DURATION.cinematic,
            ease: EASE.cinematic,
            stagger,
            delay,
            scrollTrigger
          }
        );
      } else if (variant === 'scale') {
        gsap.from(container.current!.children, {
          scale: 0.97,
          opacity: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger,
          delay,
          scrollTrigger
        });
      } else {
        gsap.from(container.current!.children, {
          y,
          opacity: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger,
          delay,
          scrollTrigger
        });
      }
    });

    ctx.add("(prefers-reduced-motion: reduce)", () => {
      // Elements are already fully visible by default CSS
    });

    return () => ctx.revert();
  }, { scope: container, dependencies: [variant, delay, stagger, y] });

  return (
    <div ref={container} className={cn(className)}>
      {children}
    </div>
  );
}
