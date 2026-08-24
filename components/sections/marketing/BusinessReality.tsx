'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MessageCircle, Smartphone, Table, FileText, Mail } from 'lucide-react';
import ContourField from '@/components/visuals/ContourField';
import Reveal from '@/components/motion/Reveal';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { useMediaQuery } from '@/components/motion/useMediaQuery';

const fragments = [
  { icon: MessageCircle, label: 'WhatsApp Threads', x: -200, y: -150, rotate: -15 },
  { icon: Smartphone, label: 'Instagram DMs', x: 250, y: -100, rotate: 10 },
  { icon: Table, label: 'Pricing Spreadsheets', x: -250, y: 100, rotate: -8 },
  { icon: FileText, label: 'PDF Itineraries', x: 200, y: 150, rotate: 12 },
  { icon: Mail, label: 'Email Threads', x: 0, y: 180, rotate: -5 },
];

export default function BusinessReality() {
  const container = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const useStackedLayout = reduceMotion || isMobile;

  useGSAP(() => {
    if (!chipsRef.current) return;
    let ctx = gsap.matchMedia();

    ctx.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const chips = gsap.utils.toArray<HTMLElement>('.fragment-chip', chipsRef.current);
      
      // Initial scattered state is set in CSS/style.
      // We animate them converging towards 0,0 and fading slightly.
      gsap.to(chips, {
        scrollTrigger: {
          trigger: container.current,
          start: 'top 60%',
          end: 'center center',
          scrub: 1,
        },
        x: (i) => fragments[i].x * 0.2, // Pull in, but don't stack
        y: (i) => fragments[i].y * 0.2,
        rotate: 0,
        opacity: 0, // Fully fade out
        stagger: 0,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, { scope: container });

  return (
    <section ref={container} className="relative py-32 px-6 md:px-10 overflow-hidden border-t border-border">
      <ContourField tone="neutral" density="high" className="opacity-20" />
      
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center relative z-10 min-h-[50vh]">
        <Reveal className="mb-16">
          <p className="eyebrow mb-6">THE WAY IT WORKS TODAY</p>
          <h2 className="text-display-md font-bold mb-6">
            The reality of running trips is scattered.
          </h2>
        </Reveal>

        <div
          className={`relative w-full flex items-center justify-center mb-16 ${useStackedLayout ? 'flex-wrap py-4' : 'h-[300px]'}`}
          ref={chipsRef}
        >
          {fragments.map((frag, i) => {
            const Icon = frag.icon;
            // Below md, or with reduced motion, the scroll-scatter animation never
            // registers (see the matchMedia query above) — render the same stacked
            // fallback in both cases instead of leaving raw ±250px offsets on screen.
            const style = useStackedLayout ? {} : {
              transform: `translate(${frag.x}px, ${frag.y}px) rotate(${frag.rotate}deg)`,
            };

            return (
              <div
                key={frag.label}
                className={`fragment-chip ${useStackedLayout ? 'relative m-2 inline-flex' : 'absolute'} items-center gap-2 bg-card border border-border px-4 py-3 rounded-xl shadow-xl`}
                style={style}
              >
                <Icon size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">{frag.label}</span>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <h3 className="text-2xl font-bold text-accent mb-4">
            Trailo is where it all runs from one place.
          </h3>
        </Reveal>
      </div>
    </section>
  );
}
