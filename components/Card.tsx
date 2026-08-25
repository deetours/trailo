import Link from 'next/link';
import { cn } from '@/lib/cn';

interface CardProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  rounded?: 'xl' | '2xl';
}

const roundedClass = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

/**
 * The bg-[#111]/border-[#222]/hover:border-[#444] surface used across
 * trip, destination, and dashboard cards. Handles the shared recipe only —
 * layout (image slots, padding, flex direction) stays with each call site.
 */
export default function Card({ href, className, children, hover = true, rounded = '2xl' }: CardProps) {
  // href's 'group block' defaults are merged before className (not after) so
  // a caller passing a 'flex'/'grid' layout in className correctly wins the
  // twMerge display-utility conflict instead of being silently dropped.
  const classes = cn(
    'bg-card border border-border',
    roundedClass[rounded],
    hover && 'hover:border-[var(--muted-foreground)] transition-colors',
    href && 'group block',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
