'use client';

import Link from 'next/link';
import MagneticButton from './MagneticButton';
import { Mountain } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Mountain size={24} strokeWidth={2} className="text-white group-hover:text-[#aaa] transition-colors" />
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-[#aaa] transition-colors">Trailo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888]">
          <Link href="#product" className="hover:text-white transition-colors">Product</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="#customers" className="hover:text-white transition-colors">Customers</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <MagneticButton href="/demo" variant="primary">
            Book a Demo
          </MagneticButton>
        </div>

      </div>
    </header>
  );
}
