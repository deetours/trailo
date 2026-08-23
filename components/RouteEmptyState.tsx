interface RouteEmptyStateProps {
  message: string;
  className?: string;
}

/**
 * Shared fallback for "no map token" / "no hero image" — a faint route-line
 * motif instead of bare placeholder text, so an unconfigured section still
 * looks like part of the product rather than a broken one.
 */
export default function RouteEmptyState({ message, className = '' }: RouteEmptyStateProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#111] ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0,140 C 200,60 400,180 600,80 C 750,20 850,120 1000,60"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p className="relative z-10 text-[#888] font-mono text-sm border border-[#222] bg-black/40 backdrop-blur px-4 py-2 rounded max-w-xs text-center">
        {message}
      </p>
    </div>
  );
}
