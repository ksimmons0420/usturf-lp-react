/* ──────────────────────────────────────────────────────────────────────
   PostHog + tracking helpers for US Turf React LPs.
   Same patterns as the native LPs — 5-event funnel, super properties
   for assigned_variant + UTMs, idempotent init so we don't double-fire
   alongside theme.liquid.
   ────────────────────────────────────────────────────────────────────── */

import posthog from 'posthog-js';

export const LP_CONFIG = {
  POSTHOG_TOKEN: 'phc_zhy3pqGXd6SQaGCzQJtC4GNBu7ThEX2WDyuRomMspDoS',
  POSTHOG_HOST: 'https://us.i.posthog.com',
  JOTFORM_ID: '260847354072156',
  PHONE: '(725) 735-2182',
  PHONE_TEL: 'tel:7257352182',
  COMPANY_HERO_IMG:
    'https://usturf.com/cdn/shop/files/US_Turf_-_Artificial_Grass_-_Las_Vegas_-_Services_-_Photo_-71.jpg?v=1675143945&width=1800',
} as const;

let inited = false;

export function initPostHog() {
  if (inited) return;
  inited = true;
  // Idempotent — theme.liquid may also init PostHog
  if (typeof window === 'undefined') return;
  // @ts-expect-error window.posthog set dynamically by snippet
  if (window.posthog && window.posthog.__SV) {
    // Already initialized somewhere else
    return;
  }
  posthog.init(LP_CONFIG.POSTHOG_TOKEN, {
    api_host: LP_CONFIG.POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false,
  });
}

function readUtms(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === 'undefined') return out;
  const qs = new URLSearchParams(window.location.search);
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']) {
    const v = qs.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function track(event: string, props: Record<string, unknown> = {}, lpName: string) {
  try {
    const payload = {
      lp_name: lpName,
      ...readUtms(),
      ...props,
    };
    // @ts-expect-error global posthog from snippet OR posthog-js
    if (window.posthog && window.posthog.capture) {
      // @ts-expect-error
      window.posthog.capture(event, payload);
    } else {
      posthog.capture(event, payload);
    }
  } catch {
    /* swallow */
  }
}
