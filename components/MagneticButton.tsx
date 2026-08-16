'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full outline-none group overflow-hidden";
  
  const variants = {
    primary: "bg-white text-black hover:bg-[#e0e0e0] shadow-[0_0_20px_rgba(255,255,255,0.15)]",
    secondary: "bg-[#0a0a0a] text-white border border-[#333] hover:bg-[#1a1a1a] hover:border-[#555] shadow-sm",
    outline: "bg-transparent text-white border border-[#444] hover:bg-white hover:text-black",
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onTapStart={triggerHaptic}
      animate={{ x: position.x, y: position.y }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        {content}
      </Link>
    );
  }

  return content;
}
