'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, DURATION, STAGGER } from '@/lib/motion';
import ProductFrame from '@/components/visuals/ProductFrame';

export default function TripToPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanel = useRef<HTMLDivElement>(null);
  const rightPanel = useRef<HTMLDivElement>(null);
  const linePath = useRef<SVGPathElement>(null);

  // Elements to animate
  const lTitle = useRef<HTMLDivElement>(null);
  const lChips = useRef<HTMLDivElement>(null);
  const lTiers = useRef<HTMLDivElement>(null);

  const rMedia = useRef<HTMLDivElement>(null);
  const rTiers = useRef<HTMLDivElement>(null);
  const rPill = useRef<HTMLDivElement>(null);
  const rStatus = useRef<HTMLDivElement>(null);
  const rStatusDraft = useRef<HTMLSpanElement>(null);
  const rStatusLive = useRef<HTMLSpanElement>(null);

  // Progress rail — orients users during the long (350%) pinned scrub below,
  // since there's otherwise no visual cue for how far through the sequence
  // they are while the section holds their scroll.
  const progressTrack = useRef<HTMLDivElement>(null);
  const progressFill = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.matchMedia();

    ctx.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // Set initial states for animation
      gsap.set([lTitle.current, lChips.current, lTiers.current!.children], { filter: 'blur(10px)', opacity: 0 });
      gsap.set(rMedia.current, { scale: 0.95, opacity: 0 });
      gsap.set(rTiers.current!.children, { y: 20, opacity: 0 });
      gsap.set(rPill.current, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(rStatusLive.current, { opacity: 0, filter: 'blur(2px)' });
      gsap.set(progressFill.current, { scaleY: 0 });

      const length = linePath.current!.getTotalLength();
      gsap.set(linePath.current, { strokeDasharray: length, strokeDashoffset: length });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => gsap.set(progressFill.current, { scaleY: self.progress }),
          onEnter: () => gsap.to(progressTrack.current, { opacity: 1, duration: 0.2 }),
          onEnterBack: () => gsap.to(progressTrack.current, { opacity: 1, duration: 0.2 }),
          onLeave: () => gsap.to(progressTrack.current, { opacity: 0, duration: 0.2 }),
          onLeaveBack: () => gsap.to(progressTrack.current, { opacity: 0, duration: 0.2 }),
        }
      });

      // 0 - 0.12: title blur in
      tl.to(lTitle.current, { filter: 'blur(0px)', opacity: 1, duration: 0.12 });

      // 0.12 - 0.30: chips in
      tl.to(lChips.current, { filter: 'blur(0px)', opacity: 1, duration: 0.18 });

      // 0.30 - 0.55: tiers map across
      tl.to(lTiers.current!.children, { filter: 'blur(0px)', opacity: 1, stagger: 0.05, duration: 0.15 }, "tiers");
      tl.to(rTiers.current!.children, { y: 0, opacity: 1, stagger: 0.05, duration: 0.15 }, "tiers+=0.1");

      // 0.55 - 0.75: media and connector line
      tl.to(linePath.current, { strokeDashoffset: 0, duration: 0.2 }, "connector");
      tl.to(rMedia.current, { scale: 1, opacity: 1, duration: 0.2 }, "connector+=0.05");

      // 0.75 - 0.90: pill and status — label crossfades in step with the
      // color tween so "Draft" never sits on top of the published color.
      tl.to(rPill.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.15 }, "finish");
      tl.to(rStatus.current, { backgroundColor: 'var(--success)', color: 'var(--success-foreground)', duration: 0.1 }, "finish+=0.05");
      tl.to(rStatusDraft.current, { opacity: 0, filter: 'blur(2px)', duration: 0.1 }, "finish+=0.05");
      tl.to(rStatusLive.current, { opacity: 1, filter: 'blur(0px)', duration: 0.1 }, "finish+=0.05");

      // 0.90 - 1.0: hold
      tl.to({}, { duration: 0.1 });
    });

    ctx.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set([lTitle.current, lChips.current, lTiers.current!.children], { filter: 'blur(10px)', opacity: 0 });
      gsap.set(rMedia.current, { scale: 0.95, opacity: 0 });
      gsap.set(rTiers.current!.children, { y: 20, opacity: 0 });
      gsap.set(rPill.current, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(rStatusLive.current, { opacity: 0, filter: 'blur(2px)' });

      const lTl = gsap.timeline({
        scrollTrigger: {
          trigger: leftPanel.current,
          start: 'top 75%',
          once: true,
        }
      });
      lTl.to(lTitle.current, { filter: 'blur(0px)', opacity: 1, duration: DURATION.base, ease: EASE.out });
      lTl.to(lChips.current, { filter: 'blur(0px)', opacity: 1, duration: DURATION.base, ease: EASE.out }, "-=0.55");
      lTl.to(lTiers.current!.children, { filter: 'blur(0px)', opacity: 1, stagger: STAGGER.tight, duration: DURATION.base, ease: EASE.out }, "-=0.55");

      const rTl = gsap.timeline({
        scrollTrigger: {
          trigger: rightPanel.current,
          start: 'top 75%',
          once: true,
        }
      });
      rTl.to(rMedia.current, { scale: 1, opacity: 1, duration: DURATION.base, ease: EASE.out });
      rTl.to(rTiers.current!.children, { y: 0, opacity: 1, stagger: STAGGER.tight, duration: DURATION.base, ease: EASE.out }, "-=0.55");
      rTl.to(rPill.current, { clipPath: 'inset(0 0% 0 0)', duration: DURATION.base, ease: EASE.out }, "-=0.55");
      
      rTl.to(rStatus.current, { backgroundColor: 'var(--success)', color: 'var(--success-foreground)', duration: DURATION.fast, ease: EASE.out }, "status");
      rTl.to(rStatusDraft.current, { opacity: 0, filter: 'blur(2px)', duration: DURATION.fast, ease: EASE.out }, "status");
      rTl.to(rStatusLive.current, { opacity: 1, filter: 'blur(0px)', duration: DURATION.fast, ease: EASE.out }, "status");
    });

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative bg-card overflow-hidden w-full">
      {/* Pin progress rail (desktop, motion-enabled only — see matchMedia above) */}
      <div
        ref={progressTrack}
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 w-[2px] h-32 bg-border opacity-0 pointer-events-none z-20"
        aria-hidden="true"
      >
        <div ref={progressFill} className="w-full h-full bg-accent origin-top" />
      </div>

      <div className="min-h-screen flex flex-col justify-center py-20 px-6 md:px-10 w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full shrink-0 bg-accent" aria-hidden="true" />
            <span className="eyebrow tracking-widest">PUBLISH</span>
          </div>
          <h2 className="text-display-md font-bold max-w-2xl mx-auto">
            Your editor on the left. The live page on the right. Linked in real-time.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 w-full max-w-7xl mx-auto items-center">

          {/* Left: Editor */}
          <div ref={leftPanel} className="w-full">
            <ProductFrame>
              <div className="p-6 h-[400px] flex flex-col border-r border-border">
                <div className="font-bold text-lg mb-6 border-b border-border pb-4">Trip Basics</div>

                <div ref={lTitle} className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Trip Name</div>
                  <div className="w-full bg-muted border border-border p-3 rounded-lg text-sm font-bold">Annapurna Circuit Trek</div>
                </div>

                <div ref={lChips} className="flex gap-2 mb-8">
                  <div className="bg-muted px-3 py-1.5 rounded-full text-[10px] font-bold">Nepal</div>
                  <div className="bg-muted px-3 py-1.5 rounded-full text-[10px] font-bold">14 Days</div>
                </div>

                <div className="font-bold text-sm mb-3 text-muted-foreground">Pricing Tiers</div>
                <div ref={lTiers} className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center bg-muted p-2.5 rounded-lg border border-border text-xs">
                      <span>Tier {i}</span>
                      <span className="font-bold">$ {900 + i * 300}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ProductFrame>
          </div>

          {/* Center: RouteLine (Hidden on mobile) */}
          <div className="hidden md:flex justify-center items-center w-24 h-full relative">
            <svg className="absolute w-full h-[100px]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                ref={linePath}
                d="M 0,50 C 30,50 70,50 100,50"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Right: Live Page */}
          <div ref={rightPanel} className="w-full">
            <ProductFrame>
              <div className="relative h-[400px] overflow-hidden flex flex-col bg-background">
                <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card z-10">
                  <div className="font-bold text-xs">Apex Expeditions</div>
                  <div ref={rStatus} className="relative w-14 h-5 rounded bg-muted text-muted-foreground transition-colors shrink-0 overflow-hidden">
                    <span ref={rStatusDraft} className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase">Draft</span>
                    <span ref={rStatusLive} className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase">Live</span>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <div ref={rMedia} className="absolute inset-0 z-0">
                    <Image
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80"
                      alt="Hampta Pass Trek published trip page hero photo"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                  </div>

                  <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                    <h3 className="text-2xl font-black mb-2">Annapurna Circuit</h3>

                    <div ref={rPill} className="bg-background/80 backdrop-blur w-fit px-3 py-1.5 rounded-full text-[10px] font-mono text-muted-foreground mb-6 border border-border">
                      trailo.com/t/apex/annapurna
                    </div>

                    <div ref={rTiers} className="flex gap-2 w-full mt-auto">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex-1 bg-card border border-border p-3 rounded-xl flex flex-col justify-center items-center">
                          <span className="text-[10px] text-muted-foreground mb-1">Tier {i}</span>
                          <span className="text-sm font-bold">${900 + i * 300}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ProductFrame>
          </div>

        </div>
      </div>
    </section>
  );
}
