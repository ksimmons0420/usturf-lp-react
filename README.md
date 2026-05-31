# usturf-lp-react

React + framer-motion landing pages for US Turf, served from this repo via jsdelivr CDN, mounted onto Shopify Pages.

## Why this exists

Shopify Pages doesn't support a build step, so you can't ship React/JSX/framer-motion directly into a page. This repo solves it with a **CDN-bundled approach**:

1. Build React app locally (`npm run build`)
2. Push built `dist/` to GitHub
3. jsdelivr serves the bundle from `cdn.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@VERSION/dist/...`
4. The Shopify Page contains only `<div id="lp-root">` + a `<script>` tag pointing at the CDN

Result: full React, framer-motion, Tailwind, posthog-js — running natively on Shopify Pages.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** — IIFE single-file output, stable filenames (no content hashing) for CDN URL stability
- **Tailwind 3** — scoped to `.usturf-react-lp` via `important` config so utilities don't leak into Shopify theme
- **framer-motion 12** — for animations that genuinely need JS (spring physics, gesture-driven, orchestration)
- **posthog-js** — same PostHog token as the native LPs, same 5-event funnel pattern

## Bundle output

```
dist/
└── assets/
    ├── index.js  (~316KB / ~100KB gzip)
    └── style.css (~12KB / ~3KB gzip)
```

The Shopify Page just needs:

```html
<div id="lp-root"></div>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@main/dist/assets/style.css">
<script type="module" src="https://cdn.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@main/dist/assets/index.js"></script>
```

Pin to a specific commit for cache stability:
```html
<script src="https://cdn.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@abc1234/dist/assets/index.js"></script>
```

## Iteration workflow

```bash
# 1. Edit src/App.tsx (or whatever component you're working on)
npm run dev                    # localhost:5173 hot reload during dev

# 2. When ready to ship:
npm run build                  # produces dist/

# 3. Commit + push
git add dist/
git commit -m "deploy v2 — new hero animation"
git push origin main

# 4. Bust jsdelivr cache (one-time per deploy)
# Visit: https://purge.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@main/dist/assets/index.js
# Or just pin to the new commit hash in the Shopify <script src>

# 5. Reload Shopify page in browser (hard refresh)
```

## Constraints we follow

The CSS scope (`.usturf-react-lp`) and the mount-to-`#lp-root` pattern mean:
- All component output renders inside one div
- Tailwind utilities only target descendants of that div
- No conflicts with Shopify theme styling

The Vite config emits IIFE (not ES modules) and single-file output (no code-splitting) so:
- One `<script>` tag is enough
- No dynamic imports requiring CDN URL resolution
- No CORS issues with chunk loading

## Compliance baseline (US Turf)

When porting an LP into this repo, the same rules apply as native:
- "Limited Lifetime Warranty" — never bare "Lifetime"
- "Starts at $4.99/sq.ft" + pricing-varies disclaimer
- "*Subject to credit approval" + $3,500 min on financing
- "For qualified homeowners" + "homeowner submits paperwork" on rebate
- "Las Vegas valley" — never "Mojave"
- 22-year claim valid via family lineage

## Status

- **2026-05-30** — initial scaffold + demo hero. Validates the pipeline.
- Next: port `social2026-neon` into React, add framer-motion animations beyond what CSS could do (gesture-driven parallax, spring-physics card hover, scroll-linked transforms).
