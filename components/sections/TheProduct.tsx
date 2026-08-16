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
    component: MockChatAutomation // A variant visually could be achieved by passing a prop, but we'll reuse the same for now
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
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Timeline linked to the scroll of the container
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

    mm.add("(max-width: 767px)", () => {
      // Mobile reveals
      const stepElements = gsap.utils.toArray('.product-step-mobile') as HTMLElement[];
      const panelElements = gsap.utils.toArray('.product-panel-mobile') as HTMLElement[];
      gsap.set([...stepElements, ...panelElements], { autoAlpha: 0, y: 30 });

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
    <section id="product" ref={containerRef} className="w-full bg-[#0A0A0A] relative md:h-[500vh]">
      <div className="w-full md:sticky md:top-0 md:h-screen flex items-center relative py-24 md:py-0 overflow-hidden">
        
        {/* Desktop Layout (Pinned via Sticky) */}
        <div className="hidden md:flex container mx-auto px-6 h-screen py-20 flex-col md:flex-row items-center gap-12">
          {/* Left Column: Text Steps */}
          <div ref={leftColRef} className="w-5/12 flex flex-col justify-center h-full gap-12">
            {steps.map((step) => (
              <div key={step.id} className="product-step">
                <div className="eyebrow mb-2">{step.eyebrow}</div>
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Column: UI Panels */}
          <div ref={rightColRef} className="w-7/12 relative h-full flex items-center justify-center perspective-1000">
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

        {/* Mobile Layout (Normal Flow) */}
        <div className="md:hidden container mx-auto px-6 flex flex-col gap-16">
          {steps.map((step) => {
            const Component = step.component;
            return (
              <div key={`${step.id}-mobile`} className="flex flex-col gap-6">
                <div className="product-step-mobile">
                  <div className="eyebrow mb-2">{step.eyebrow}</div>
                  <h3 className="text-2xl font-display font-bold text-white tracking-tight leading-tight">
                    {step.title}
                  </h3>
                </div>
                <div className="product-panel-mobile w-full flex justify-center">
                  <Component />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
