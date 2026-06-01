import { useEffect, useState } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   Returns true when viewport is at mobile width (< 768px by default).
   Drives conditional rendering for mobile-only UI (e.g. sticky CTA bar)
   in cases where Tailwind responsive prefixes can't apply (portaled
   elements with our scoped 'important' config don't get descendant
   selector matches).
   ────────────────────────────────────────────────────────────────────── */

export function useIsMobile(breakpoint = 767): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}
