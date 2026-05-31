import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* ──────────────────────────────────────────────────────────────────────
   Vite config for the React-in-Shopify pipeline.

   Goal: produce a SINGLE self-executing JS bundle + SINGLE CSS file that
   can be loaded via one <script> + one <link> tag on a Shopify Page.

   Output:
     dist/assets/index.js   — IIFE bundle that auto-mounts to #lp-root
     dist/assets/index.css  — single styles bundle

   Stable filenames (no content hashing) so the Shopify Page's <script
   src="..."> URL never changes — jsdelivr cache busts on git commit hash
   in the URL (e.g. @abc1234) when we want forced invalidation.
   ────────────────────────────────────────────────────────────────────── */

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'UsturfLP',
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
        inlineDynamicImports: true,
      },
    },
    assetsInlineLimit: 4096,
    target: 'es2020',
  },
});
