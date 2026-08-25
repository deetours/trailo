'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MessageCircle, Smartphone, Table, FileText, Mail } from 'lucide-react';
import ContourField from '@/components/visuals/ContourField';
import Reveal from '@/components/motion/Reveal';
import Logo from '@/components/Logo';

const fragments = [
  { icon: MessageCircle, label: 'WhatsApp Threads', x: -130, y: -100, rotate: -15 },
  { icon: Smartphone, label: 'Instagram DMs', x: 160, y: -65, rotate: 10 },
  { icon: Table, label: 'Pricing Spreadsheets', x: -160, y: 65, rotate: -8 },
  { icon: FileText, label: 'PDF Itineraries', x: 130, y: 100, rotate: 12 },
  { icon: Mail, label: 'Email Threads', x: 0, y: 115, rotate: -5 },
];

export default function BusinessReality() {
  const container = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!chipsRef.current) return;
    const ctx = gsap.matchMedia();

    ctx.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const chips = gsap.utils.toArray<HTMLElement>('.fragment-chip', chipsRef.current);

      // Chips converge and fade as they pull in, but rather than vanishing
      // into nothing, the Trailo mark fades/scales in underneath them on the
      // same scrub — the "chaos becomes order" metaphor resolves into
      // something instead of empty space.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          end: 'center center',
          scrub: 1,
        },
      });

      tl.to(chips, {
        x: (i) => fragments[i].x * 0.2,
        y: (i) => fragments[i].y * 0.2,
        rotate: 0,
        opacity: 0,
        scale: 0.6,
        stagger: 0,
        ease: 'power2.out',
      }, 0);

      tl.fromTo(markRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, ease: 'power2.out' },
        0.15
      );
    });

    ctx.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const chips = gsap.utils.toArray<HTMLElement>('.fragment-chip', chipsRef.current);

      gsap.from(chips, {
        y: 18,
        scale: 0.96,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: chipsRef.current,
          start: 'top 82%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, { scope: container });

  return (
    <section ref={container} className="relative py-32 px-6 md:px-10 overflow-hidden border-t border-border">
      <ContourField tone="neutral" density="high" className="opacity-80" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center min-h-[50vh]">
          <Reveal>
            <h2 className="text-display-lg font-bold mb-6">
              The reality of running trips is scattered.
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-md">
              WhatsApp threads, Instagram DMs, spreadsheets, PDFs, email — the trip lives in five places at once, and none of them look like your brand.
            </p>
          </Reveal>

          <div
            className="relative w-full flex flex-wrap items-center justify-center py-4 md:motion-safe:flex-nowrap md:motion-safe:py-0 md:motion-safe:h-[300px]"
            ref={chipsRef}
          >
            <div
              ref={markRef}
              className="absolute inset-0 hidden md:motion-safe:flex items-center justify-center opacity-0 text-accent pointer-events-none"
              aria-hidden="true"
            >
              <Logo wordmark={false} markClassName="w-16 h-16" />
            </div>

            {fragments.map((frag) => {
              const Icon = frag.icon;
              // Scatter positioning applies purely via the md:motion-safe: CSS
              // variant below — kept in sync with the gsap.matchMedia queries in
              // useGSAP so layout and animation always agree on which mode is
              // active. No JS-resolved viewport state, no post-mount relayout
              // for ScrollTrigger to get stale positions from.
              const style = {
                '--frag-x': `${frag.x}px`,
                '--frag-y': `${frag.y}px`,
                '--frag-rotate': `${frag.rotate}deg`,
              } as React.CSSProperties;

              return (
                <div
                  key={frag.label}
                  className="fragment-chip relative m-3 inline-flex md:motion-safe:absolute md:motion-safe:m-0 md:motion-safe:[transform:translate(var(--frag-x),var(--frag-y))_rotate(var(--frag-rotate))] items-center gap-2"
                  style={style}
                >
                  <Icon size={18} className="text-muted-foreground/70" />
                  <span className="text-sm font-medium text-muted-foreground">{frag.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-accent">
            Trailo is where it all runs from one place.
          </h3>
        </Reveal>
      </div>
    </section>
  );
}
