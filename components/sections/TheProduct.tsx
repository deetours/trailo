'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MockChatAutomation from '../mocks/MockChatAutomation';
import MockInvoiceFlow from '../mocks/MockInvoiceFlow';
import MockDashboardPreview from '../mocks/MockDashboardPreview';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 'step-1',
    eyebrow: 'Instant Reply',
    title: 'Inbound enquiries auto-responded in seconds.',
    component: MockChatAutomation
  },
  {
    id: 'step-2',
    eyebrow: 'Automated Follow-Up',
    title: 'Timestamped automated messages, no lead left cold.',
    component: MockChatAutomation
  },
  {
    id: 'step-3',
    eyebrow: 'Seamless Payments',
    title: 'Convert bookings into paid invoices automatically.',
    component: MockInvoiceFlow
  },
  {
    id: 'step-4',
    eyebrow: 'One Dashboard',
    title: 'Monitor your entire operation from a single, clean workspace.',
    component: MockDashboardPreview
  }
];

export default function TheProduct() {
  const containerRef = useRef<HTMLDivElement>(null);

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

      const stepElements = gsap.utils.toArray('.product-step') as HTMLElement[];
      const panelElements = gsap.utils.toArray('.product-panel') as HTMLElement[];

      // Set initial states
      gsap.set(stepElements.slice(1), { autoAlpha: 0.2 });
      gsap.set(panelElements.slice(1), { autoAlpha: 0, y: 50, scale: 0.95 });
      gsap.set(panelElements[0], { autoAlpha: 1, y: 0, scale: 1 });

      // Animate through each step sequentially
      stepElements.forEach((step, i) => {
        if (i === 0) return;

        tl.to(stepElements[i - 1], { autoAlpha: 0.2, duration: 1 })
          .to(panelElements[i - 1], { autoAlpha: 0, y: -50, scale: 0.95, duration: 1 }, "<")
          .to(step, { autoAlpha: 1, duration: 1 })
          .to(panelElements[i], { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "<");
          
        if (i < stepElements.length - 1) {
          tl.to({}, { duration: 0.5 }); // short hold
        }
      });

      tl.to({}, { duration: 1 }); // hold at the end
    });

    // Fallback: Reduced motion
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const stepElements = gsap.utils.toArray('.product-step') as HTMLElement[];
      const panelElements = gsap.utils.toArray('.product-panel') as HTMLElement[];
      gsap.set([...stepElements, ...panelElements], { autoAlpha: 0, y: 30, position: 'relative', top: 'auto', left: 'auto', transform: 'none' });

      [...stepElements, ...panelElements].forEach(el => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          autoAlpha: 1,
          y: 0,
          duration: 0.8
        });
      });
    });

  }, { scope: containerRef });

  return (
    <section id="product" ref={containerRef} className="w-full bg-[#0A0A0A] relative h-[500vh]">
      <div className="w-full sticky top-0 h-[100svh] flex items-center relative py-20 md:py-0 overflow-hidden">
        
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-24 md:pb-0">
          
          {/* Text Steps - Top on mobile, Left on desktop */}
          <div className="w-full md:w-5/12 flex flex-col justify-center h-1/2 md:h-full gap-8 md:gap-12 relative z-10 pt-16 md:pt-0">
            {steps.map((step) => (
              <div key={step.id} className="product-step absolute md:relative top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 w-full left-0 md:left-auto">
                <div className="eyebrow mb-2">{step.eyebrow}</div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>

          {/* UI Panels - Bottom on mobile, Right on desktop */}
          <div className="w-full md:w-7/12 relative h-1/2 md:h-full flex items-center justify-center perspective-1000 mt-8 md:mt-0">
            {steps.map((step, i) => {
              const Component = step.component;
              return (
                <div 
                  key={step.id} 
                  className="product-panel absolute inset-0 flex items-center justify-center w-full"
                  style={{ zIndex: steps.length - i }}
                >
                  <Component />
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
}
