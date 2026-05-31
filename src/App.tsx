import { useEffect, useState } from 'react';
import NeonApp from './apps/NeonApp';
import PremiumApp from './apps/PremiumApp';

/* ──────────────────────────────────────────────────────────────────────
   Path-based router. Single bundle, multiple LPs.

   Detection rules:
     /pages/social2026-neon-react    → NeonApp
     /pages/social2026-premium-react → PremiumApp
     /pages/lp-react-test            → NeonApp (default for the test page)
     anything else                   → NeonApp (default)

   Each LP component is fully self-contained (own Hero, Stats, etc.).
   ────────────────────────────────────────────────────────────────────── */

type LpKey = 'neon' | 'premium';

function detect(): LpKey {
  if (typeof window === 'undefined') return 'neon';
  const path = window.location.pathname.toLowerCase();
  if (path.includes('premium-react')) return 'premium';
  return 'neon';
}

export default function App() {
  const [lp, setLp] = useState<LpKey>(() => detect());
  // Re-detect on history navigation in case the host SPA changes routes
  useEffect(() => {
    const onPop = () => setLp(detect());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (lp === 'premium') return <PremiumApp />;
  return <NeonApp />;
}
