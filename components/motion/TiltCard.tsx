'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { EASE } from '@/lib/motion';
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

  const ensureQuickTo = () => {
    if (!ref.current || quickRotateX.current) return;
    quickRotateX.current = gsap.quickTo(ref.current, 'rotationX', { duration: 0.4, ease: EASE.out });
    quickRotateY.current = gsap.quickTo(ref.current, 'rotationY', { duration: 0.4, ease: EASE.out });
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

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn('relative perspective-1000', className)}
    >
      {children}
    </div>
  );
}
