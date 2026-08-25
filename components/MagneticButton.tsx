'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { gsap } from '@/lib/gsap';
import { EASE, DURATION } from '@/lib/motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'accent' | 'secondary' | 'outline';
}

const variantMap = {
  primary: 'default',
  accent: 'accent',
  secondary: 'secondary',
  outline: 'outline',
} as const;

export default function MagneticButton({
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  // quickTo targets the DOM node directly, so it can't be created until the
  // ref is attached — lazily built on first pointer move instead of in an
  // effect, since this component never needs the tween outside interaction.
  const ensureQuickTo = () => {
    if (!ref.current || quickX.current) return;
    quickX.current = gsap.quickTo(ref.current, 'x', { duration: 0.3, ease: EASE.out });
    quickY.current = gsap.quickTo(ref.current, 'y', { duration: 0.3, ease: EASE.out });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    ensureQuickTo();
    const { clientX, clientY } = e;
    const { height, width, left, top } = e.currentTarget.getBoundingClientRect();
    quickX.current?.((clientX - (left + width / 2)) * 0.2);
    quickY.current?.((clientY - (top + height / 2)) * 0.2);
  };

  const reset = () => {
    quickX.current?.(0);
    quickY.current?.(0);
  };

  const handlePressStart = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    if (ref.current) gsap.to(ref.current, { scale: 0.95, duration: DURATION.fast, ease: EASE.out });
  };

  const handlePressEnd = () => {
    if (ref.current) gsap.to(ref.current, { scale: 1, duration: DURATION.fast, ease: EASE.out });
  };

  // Shares its variant recipe with shadcn's Button (components/ui/button.tsx)
  // so the marketing CTA and the dashboard's buttons stay one visual system.
  // The magnetic pull / tap-scale / haptic layer on top is GSAP, applied
  // directly to this element rather than through Base UI's button runtime —
  // that layer is specific enough (mouse-follow physics) that it isn't worth
  // routing through the shared primitive's render-prop indirection.
  const classes = cn(
    buttonVariants({ variant: variantMap[variant], size: 'lg' }),
    'rounded-full h-auto px-6 py-3 text-sm font-medium',
    variant === 'primary' && 'shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_15%,transparent)]',
    variant === 'accent' && 'shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)]',
    className
  );

  const sharedProps = {
    onMouseMove: handleMouseMove,
    onMouseLeave: reset,
    onPointerDown: handlePressStart,
    onPointerUp: handlePressEnd,
    className: classes,
  };

  if (href) {
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...sharedProps}>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} {...sharedProps}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
