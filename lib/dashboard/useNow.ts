'use client';

import { useEffect, useState } from 'react';

/**
 * Attention-window and trend-period math needs "now", but calling Date.now()
 * directly during render is impure (unstable across re-renders). Read it from
 * state instead, refreshed on an interval from an effect.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
