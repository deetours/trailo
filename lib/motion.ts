/**
 * Shared motion vocabulary. Every GSAP tween on the site should pull its
 * ease/duration from here rather than hardcoding values inline, so unrelated
 * animations still read as part of the same system.
 */
export const EASE = {
  /** Standard UI entrance — fast start, settles cleanly. */
  out: 'power3.out',
  /** On-screen movement / morphing (pin sequences, connector lines). */
  inOut: 'power2.inOut',
  /** Large-surface cinematic reveals (hero wipes, section-scale entrances). */
  cinematic: 'power4.out',
  /** Ambient/looping motion (breathing glows, idle pulses). */
  ambient: 'sine.inOut',
} as const;

export const DURATION = {
  /** Press feedback, tap states. */
  fast: 0.2,
  /** Standard reveal (Reveal component, card entrances). */
  base: 0.7,
  /** Hero-scale wipes and section headline reveals. */
  cinematic: 1.1,
  /** Slow ambient loops. */
  ambient: 4,
} as const;

export const STAGGER = {
  tight: 0.05,
  base: 0.1,
} as const;
