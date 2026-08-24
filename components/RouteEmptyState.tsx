interface RouteEmptyStateProps {
  message: string;
  className?: string;
  action?: React.ReactNode;
}

/**
 * Shared fallback for "no map token" / "no hero image" — a faint route-line
 * motif instead of bare placeholder text, so an unconfigured section still
 * looks like part of the product rather than a broken one.
 */
export default function RouteEmptyState({ message, className = '', action }: RouteEmptyStateProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden bg-muted/30 ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0,140 C 200,60 400,180 600,80 C 750,20 850,120 1000,60"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-muted-foreground font-mono text-sm border border-border bg-background/40 backdrop-blur px-4 py-2 rounded max-w-xs text-center">
          {message}
        </p>
        {action}
      </div>
    </div>
  );
}
