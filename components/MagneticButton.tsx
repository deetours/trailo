'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion.create(Link);

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function MagneticButton({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = e.currentTarget.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full outline-none group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-white text-black hover:bg-[#e0e0e0] shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    secondary: "bg-[#0a0a0a] text-white border border-[#333] hover:bg-[#1a1a1a] hover:border-[#555] shadow-sm",
    outline: "bg-transparent text-white border border-[#444] hover:bg-white hover:text-black",
  };

  const motionProps = {
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    onTapStart: triggerHaptic,
    animate: { x: position.x, y: position.y },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring' as const, stiffness: 150, damping: 15, mass: 0.1 },
    className: `${baseStyles} ${variants[variant]} ${className}`,
  };

  // href renders through next/link directly (no legacyBehavior/passHref —
  // unnecessary since Next.js 13, and it's what made this component
  // impossible to use as a real form submit control).
  if (href) {
    return (
      <MotionLink href={href} {...motionProps}>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </MotionLink>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} {...motionProps}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
