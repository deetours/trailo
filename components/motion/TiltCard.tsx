'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { useReducedMotion } from './useReducedMotion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const quickRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const quickScale = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const ensureQuickTo = () => {
    if (!ref.current) return;
    if (!quickRotateX.current) {
      quickRotateX.current = gsap.quickTo(ref.current, 'rotationX', { duration: 0.4, ease: EASE.out });
      quickRotateY.current = gsap.quickTo(ref.current, 'rotationY', { duration: 0.4, ease: EASE.out });
    }
    if (!quickScale.current) {
      quickScale.current = gsap.quickTo(ref.current, 'scale', { duration: DURATION.fast, ease: EASE.out });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduceMotion) return;
    ensureQuickTo();

    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    // Same ±6deg range the previous Framer Motion version used.
    quickRotateX.current?.(yPct * -12);
    quickRotateY.current?.(xPct * 12);
  };

  const handleMouseLeave = () => {
    quickRotateX.current?.(0);
    quickRotateY.current?.(0);
  };

  const handlePointerDown = () => {
    if (!ref.current || reduceMotion) return;
    ensureQuickTo();
    quickScale.current?.(1.02);
    gsap.to(ref.current, { boxShadow: '0 20px 40px rgba(0,0,0,0.18)', duration: DURATION.fast, ease: EASE.out });
  };

  const handlePointerUp = () => {
    if (!ref.current || reduceMotion) return;
    ensureQuickTo();
    quickScale.current?.(1);
    gsap.to(ref.current, { boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: DURATION.fast, ease: EASE.out }); // Default shadow will be controlled by css
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn('relative perspective-1000', className)}
    >
      {children}
    </div>
  );
}
