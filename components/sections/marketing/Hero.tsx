'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';
import MagneticButton from '@/components/MagneticButton';
import ContourField from '@/components/visuals/ContourField';
import ProductFrame from '@/components/visuals/ProductFrame';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const subs = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.matchMedia();

    ctx.add("(prefers-reduced-motion: no-preference)", () => {
      // clipPath wipe for H1
      gsap.fromTo(headline.current,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        { clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0 120%)', duration: DURATION.cinematic, ease: EASE.cinematic }
      );

      // stagger fade up for sub and CTAs
      gsap.from(gsap.utils.toArray('.stagger-item', subs.current), {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: EASE.out,
        delay: 0.4
      });

      // scrub out on scroll
      gsap.to(subs.current, {
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        opacity: 0,
        filter: 'blur(10px)',
        ease: EASE.inOut,
      });
    });

    return () => ctx.revert();
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-6 md:px-10 overflow-hidden">
      <ContourField tone="accent" className="opacity-50" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-[1fr_500px] gap-12 items-center">
        {/* Left side */}
        <div className="max-w-2xl relative z-10" ref={subs}>
          <p className="eyebrow mb-6 stagger-item">FOR OPERATORS WHO SELL JOURNEYS</p>

          <h1
            ref={headline}
            className="text-display-xl lg:text-display-lg xl:text-display-xl font-black tracking-tight mb-6 relative"
          >
            You build the journeys.<br />Trailo builds the business around them.
          </h1>
          
          <p className="text-body-lg text-muted-foreground max-w-xl mb-8 stagger-item">
            Trip details in, branded page out — hosted and ready to share. The publishing layer of the business system we're building around every trip you run.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 stagger-item">
            <MagneticButton href="/register" variant="primary" className="px-8 py-4 text-base">
              Register your business
            </MagneticButton>
            <a href="#platform" className="text-sm font-medium hover:text-accent transition-colors">
              See the platform ↓
            </a>
          </div>
        </div>

        {/* Right side floating UI — a real generated trip page, not a wireframe */}
        <div className="hidden xl:block relative z-10 rotate-2">
          <ProductFrame url="t/apex/annapurna-circuit">
            <div className="w-full aspect-4/5 bg-card flex flex-col">
              <div className="relative h-48 w-full shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1520696773539-71285223c683?auto=format&fit=crop&q=80"
                  alt="Annapurna Circuit Trek route through the Himalayas"
                  fill
                  sizes="500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black tracking-tight mb-3">Annapurna Circuit Trek</h3>
                <div className="flex gap-2 mb-6">
                  <span className="h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground">Nepal</span>
                  <span className="h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground">14 Days</span>
                  <span className="h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground">Moderate</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  A classic teahouse trek circling the Annapurna massif, crossing the Thorong La pass at 5,416m.
                </p>
                <div className="h-12 w-full rounded-lg bg-accent/20 border border-accent/30 mt-6 flex items-center justify-between px-4">
                  <span className="text-sm font-bold text-accent">From $1,240</span>
                  <span className="text-xs font-bold text-accent">Book now →</span>
                </div>
              </div>
            </div>
          </ProductFrame>
        </div>
      </div>
    </section>
  );
}
