import { cn } from '@/lib/cn';

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
  const strokeColor = tone === 'accent' ? 'var(--accent)' : 'var(--muted-foreground)';
  const opacity = tone === 'accent' ? 0.16 : 0.1;

  return (
    <div 
      className={cn('absolute inset-0 -z-10 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <svg
        className="absolute w-full h-full"
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
