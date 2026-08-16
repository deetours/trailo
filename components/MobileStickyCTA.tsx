'use client';

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function MobileStickyCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Only show after scrolling down past the hero section (approx 100vh)
    if (latest > window.innerHeight * 0.8) {
      setIsPastHero(true);
    } else {
      setIsPastHero(false);
      setIsVisible(false);
      return;
    }

    if (isPastHero) {
      if (latest > previous && latest > 150) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }
    }
  });

  return (
    <motion.div
      initial={{ y: 150 }}
      animate={{ y: isVisible ? 0 : 150 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"
    >
      <div className="p-4 flex justify-center pointer-events-auto">
        <MagneticButton 
          href="/demo" 
          variant="primary" 
          className="w-full max-w-sm shadow-2xl shadow-black"
        >
          Book a Demo
        </MagneticButton>
      </div>
    </motion.div>
  );
}
