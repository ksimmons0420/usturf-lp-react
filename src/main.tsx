import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/* ──────────────────────────────────────────────────────────────────────
   Auto-mount to #lp-root when the bundle loads on a Shopify Page.

   The Shopify Page just contains:
     <div id="lp-root"></div>
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/.../index.css">
     <script type="module" src="https://cdn.jsdelivr.net/.../index.js"></script>

   No other markup — React renders everything inside #lp-root.
   ────────────────────────────────────────────────────────────────────── */

function mount() {
  const el = document.getElementById('lp-root');
  if (!el) {
    console.warn('[usturf-lp-react] #lp-root not found — nothing to mount');
    return;
  }
  el.classList.add('usturf-react-lp');
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
