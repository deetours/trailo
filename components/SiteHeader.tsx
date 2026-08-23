'use client';

import Link from 'next/link';
import MagneticButton from './MagneticButton';
import Logo from './Logo';

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222]">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="group">
          <Logo className="text-white group-hover:text-[#aaa] transition-colors" markClassName="w-6 h-6" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#888]">
          <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/road-trips" className="hover:text-white transition-colors">Road Trips</Link>
          <Link href="/treks" className="hover:text-white transition-colors">Treks</Link>
          <Link href="/journal" className="hover:text-white transition-colors">Journal</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#888] hover:text-white transition-colors hidden md:block">
            Log in
          </Link>
          <MagneticButton href="/signup" variant="primary">
            Sign up
          </MagneticButton>
        </div>

      </div>
    </header>
  );
}
