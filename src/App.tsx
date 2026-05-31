import { motion } from 'framer-motion';
import { useState } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   DEMO HERO — proves the React + framer-motion pipeline works end-to-end
   on a Shopify Page via CDN delivery.

   Includes effects that are genuinely easier in framer-motion than pure
   CSS: spring-physics-driven hover (with inertia + damping) and
   staggered orchestration via variants.
   ────────────────────────────────────────────────────────────────────── */

const PIPELINE_VERSION = 'v1';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-turf-green-deep via-turf-ink to-turf-slate text-white relative overflow-hidden">
      {/* Aurora blob (framer-motion driven) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(40% 60% at 25% 30%, rgba(79, 174, 69, 0.32), transparent 70%),' +
            'radial-gradient(35% 50% at 75% 70%, rgba(255, 196, 49, 0.28), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-turf-gold-soft"
        >
          <span className="w-2 h-2 rounded-full bg-turf-gold animate-pulse" />
          React Pipeline · usturf-lp-react {PIPELINE_VERSION}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mt-4"
        >
          React + framer-motion,
          <br />
          <span className="text-turf-gold">running on Shopify Pages.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl"
        >
          This page is rendered by React, loaded from a single CDN URL, mounted on a Shopify Page that contains nothing but a{' '}
          <code className="text-turf-gold-soft font-mono text-base">
            &lt;div id=&quot;lp-root&quot;&gt;
          </code>{' '}
          div. The hover animations below are <strong>not</strong> CSS — they&apos;re framer-motion springs.
        </motion.p>

        {/* Spring-physics cards — impossible in pure CSS */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {[
            { label: '1. Edit React code', accent: 'text-turf-green' },
            { label: '2. git push', accent: 'text-turf-gold' },
            { label: '3. Live in ~30s', accent: 'text-turf-gold-soft' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer"
              whileHover={{
                scale: 1.04,
                y: -4,
                boxShadow: '0 12px 40px rgba(255, 196, 49, 0.25)',
                borderColor: 'rgba(255, 196, 49, 0.45)',
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transitionDelay: `${1.2 + i * 0.1}s` }}
            >
              <div className={`text-3xl font-black ${item.accent}`}>0{i + 1}</div>
              <div className="text-white/90 mt-2 font-semibold">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Counter — proves React state */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-12 flex flex-col md:flex-row md:items-center gap-4"
        >
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => setCount((c) => c + 1)}
            className="bg-gradient-to-br from-turf-gold to-turf-gold-soft text-turf-ink font-bold px-6 py-3 rounded-xl shadow-lg w-fit"
          >
            React state works — click me ({count})
          </motion.button>
          <span className="text-white/50 text-sm">
            ← if this count goes up, useState is firing on Shopify.
          </span>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-16 pt-8 border-t border-white/10 text-xs text-white/40"
        >
          Pipeline: <code className="text-white/60">usturf-lp-react</code> repo → <code className="text-white/60">npm run build</code> → <code className="text-white/60">git push</code> →{' '}
          <code className="text-white/60">cdn.jsdelivr.net/gh/ksimmons0420/usturf-lp-react@VERSION/dist/assets/index.js</code>{' '}
          → Shopify Page
        </motion.div>
      </div>
    </div>
  );
}
