'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TheProblem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Default: Full motion
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });

      // Start with 1 visible, 2 and 3 hidden completely
      gsap.set([text2Ref.current, text3Ref.current], { autoAlpha: 0, y: 50 });
      gsap.set(text1Ref.current, { autoAlpha: 1, y: 0 });

      // Sequential non-overlapping math
      tl.to(text1Ref.current, { autoAlpha: 0, y: -50, duration: 1 })
        .to(text2Ref.current, { autoAlpha: 1, y: 0, duration: 1 })
        .to(text2Ref.current, { autoAlpha: 0, y: -50, duration: 1 }, "+=0.5")
        .to(text3Ref.current, { autoAlpha: 1, y: 0, duration: 1 })
        .to(text3Ref.current, { autoAlpha: 0, y: -50, duration: 1 }, "+=0.5");
        
      return () => {
        tl.kill();
      };
    });

    // Fallback: Reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { autoAlpha: 0, y: 30, position: 'relative', top: 'auto', left: 'auto', transform: 'none', marginBottom: '2rem' });
      
      const elements = [text1Ref.current, text2Ref.current, text3Ref.current];
      elements.forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.8
        });
      });
    });

  }, { scope: containerRef });

  return (
    <section id="problem" ref={containerRef} className="w-full bg-[#050505] relative h-[400vh]">
      <div className="w-full sticky top-0 h-[100svh] flex items-center justify-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative h-full flex flex-col items-center justify-center">
          
          <div className="relative w-full max-w-4xl text-center block">
            <h2 
              ref={text1Ref} 
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2 font-display font-bold text-4xl md:text-5xl lg:text-7xl tracking-tighter text-white"
            >
              You’re running a trekking company,<br/>
              <span className="text-[#888]">not a call center.</span>
            </h2>

            <h2 
              ref={text2Ref} 
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2 font-display font-bold text-4xl md:text-5xl lg:text-7xl tracking-tighter text-white"
            >
              Stop answering the same<br/>
              <span className="text-[#888]">WhatsApp questions all day.</span>
            </h2>

            <h2 
              ref={text3Ref} 
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2 font-display font-bold text-4xl md:text-5xl lg:text-7xl tracking-tighter text-white"
            >
              Stop chasing payments manually.<br/>
              <span className="text-[#2A8AF6]">Let Trailo do the work.</span>
            </h2>
          </div>

        </div>
      </div>
    </section>
  );
}
