import { cn } from '@/lib/cn';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface ContourFieldProps {
  className?: string;
  tone?: 'accent' | 'neutral';
  density?: 'low' | 'high';
}

export default function ContourField({ 
  className, 
  tone = 'neutral',
  density = 'high'
}: ContourFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const strokeColor = tone === 'accent' ? 'var(--accent)' : 'var(--muted-foreground)';
  const opacity = tone === 'accent' ? 0.16 : 0.1;

  useGSAP(() => {
    const ctx = gsap.matchMedia();
    
    ctx.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(svgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
    
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute w-full h-full scale-110 -top-[5%] -left-[5%]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity }}
      >
        <path
          d="M0,50 Q25,30 50,50 T100,50"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0,60 Q25,40 50,60 T100,60"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        {density === 'high' && (
          <>
            <path
              d="M0,40 Q25,20 50,40 T100,40"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,70 Q25,50 50,70 T100,70"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
      </svg>
    </div>
  );
}
