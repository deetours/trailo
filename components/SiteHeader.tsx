'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';
import Logo from './Logo';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { cn } from '@/lib/cn';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const platformHref = pathname === '/' ? '#platform' : '/#platform';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
    { href: platformHref, label: 'Platform' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-border py-0" 
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className={cn("container mx-auto px-6 flex items-center justify-between transition-all duration-300 ease-in-out", isScrolled ? "h-16" : "h-20")}>
        
        {/* Logo */}
        <Link href="/" className="group" onClick={() => setOpen(false)}>
          <Logo className="text-foreground group-hover:text-muted-foreground transition-colors" markClassName="w-6 h-6" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Log in
          </Link>
          <MagneticButton href="/register" variant="accent">
            Register your business
          </MagneticButton>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-foreground"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'top' }}
            className="md:hidden absolute top-full inset-x-0 bg-background border-b border-border px-6 py-6 flex flex-col gap-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-border/60 last:border-b-0"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-border/60"
            >
              Log in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
