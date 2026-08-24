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
}

export default function Reveal({ children, className, delay = 0, stagger = 0, y = 24 }: RevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;

    let ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(container.current!.children, {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 85%',
          once: true,
        },
        y,
        opacity: 0,
        duration: DURATION.base,
        ease: EASE.out,
        stagger,
        delay
      });
    });

    ctx.add("(prefers-reduced-motion: reduce)", () => {
      // Elements are already fully visible by default CSS
    });

    return () => ctx.revert();
  }, { scope: container });

  return (
    <div ref={container} className={cn(className)}>
      {children}
    </div>
  );
}
