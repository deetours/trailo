interface LogoProps {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}

/**
 * First-draft wordmark — replaces the stock Lucide "Mountain" icon that was
 * standing in as Trailo's logo everywhere. Geometry, not photography, so it's
 * buildable without real brand assets; treat it as a placeholder to swap out,
 * not a final identity decision.
 */
export default function Logo({ className = '', markClassName = '', wordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 28 28"
        className={markClassName || 'w-6 h-6'}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 21 L11 7 L15 13.5 L18 9 L25 21 Z"
          fill="currentColor"
        />
        <circle cx="20" cy="6" r="2.25" fill="currentColor" />
      </svg>
      {wordmark && (
        <span className="font-display font-bold text-xl tracking-tight">Trailo</span>
      )}
    </span>
  );
}
