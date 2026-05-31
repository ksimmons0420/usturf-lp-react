import { useEffect } from 'react';
import { initPostHog, track } from '../lib/lp';

/* ──────────────────────────────────────────────────────────────────────
   Custom hook that fires lp_pageview on mount and exposes a stable
   track function bound to this LP's name.
   ────────────────────────────────────────────────────────────────────── */

export function usePostHog(lpName: string) {
  useEffect(() => {
    initPostHog();
    track('lp_pageview', {}, lpName);
  }, [lpName]);

  return (event: string, props: Record<string, unknown> = {}) =>
    track(event, props, lpName);
}
