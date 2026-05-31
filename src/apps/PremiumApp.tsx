import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../components/Modal';
import { usePostHog } from '../hooks/usePostHog';
import { LP_CONFIG } from '../lib/lp';

const LP_NAME = 'social2026-premium-react';

/* ════════════════════════════════════════════════════════════════════════
   PREMIUM EDITORIAL LP — React port of /pages/social2026-premium

   "Magazine + Subtle 3D" — restrained motion, deep shadows, glassmorphism,
   3D tilt cards (spring-physics instead of vanilla-tilt.js for smoother
   damping + glare).

   Same content + conversion mechanics as the native HTML premium LP.
   ════════════════════════════════════════════════════════════════════════ */

export default function PremiumApp() {
  const track = usePostHog(LP_NAME);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (source: string) => {
    track('lp_cta_clicked', { cta_source: source });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen relative font-sans" style={{ background: '#FFFFFF', color: '#14180F' }}>
      <main className="relative" style={{ zIndex: 2 }}>
        <Hero onCta={openModal} />
        <Stats />
        <ValueProps />
        <FinancingOffer onCta={openModal} />
        <Process />
        <Reviews />
        <Cities />
        <FinalCTA onCta={openModal} />
      </main>

      <StickyBar
        onCta={openModal}
        onCall={() => track('lp_cta_clicked', { cta_source: 'sticky-call' })}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onTrack={track} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO — aurora gradient + Ken Burns + cinematic letterbox reveal
   ════════════════════════════════════════════════════════════════════════ */

function Hero({ onCta }: { onCta: (s: string) => void }) {
  const { scrollY } = useScroll();
  // Aurora drifts slower than scroll (parallax)
  const auroraY = useTransform(scrollY, [0, 800], [0, 80]);

  return (
    <header className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: '2.2rem 0 3rem' }}>
      {/* Aurora mesh background */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: '-20%',
          zIndex: 0,
          y: auroraY,
          background:
            'radial-gradient(40% 50% at 18% 22%, rgba(79, 174, 69, 0.22), transparent 70%),' +
            'radial-gradient(35% 40% at 78% 18%, rgba(255, 196, 49, 0.18), transparent 70%),' +
            'radial-gradient(50% 60% at 70% 80%, rgba(54, 125, 47, 0.14), transparent 70%),' +
            'radial-gradient(30% 40% at 22% 78%, rgba(255, 216, 110, 0.14), transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [1, 1.04, 1.02] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Cinematic letterbox reveal */}
      <LetterboxReveal />

      <div className="relative max-w-[1280px] mx-auto px-5 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-7 md:gap-10 items-center" style={{ zIndex: 1 }}>
        <HeroContent onCta={onCta} />
        <HeroImage />
      </div>
    </header>
  );
}

function LetterboxReveal() {
  // Two bars (top + bottom) retract on mount — pure CSS would need height %, this is cleaner
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }} aria-hidden="true">
      <motion.div
        className="absolute top-0 left-0 right-0"
        initial={{ height: '12%', opacity: 1 }}
        animate={{ height: '0%', opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: '#14180F' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ height: '12%', opacity: 1 }}
        animate={{ height: '0%', opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: '#14180F' }}
      />
    </div>
  );
}

function HeroContent({ onCta }: { onCta: (s: string) => void }) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
        style={{ color: '#1F4C1A' }}
      >
        <motion.span
          className="w-2 h-2 rounded-full"
          style={{ background: '#4FAE45' }}
          animate={{ boxShadow: ['0 0 0 4px rgba(79, 174, 69, 0.18)', '0 0 0 7px rgba(79, 174, 69, 0.08)', '0 0 0 4px rgba(79, 174, 69, 0.18)'] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        <span>Las Vegas, NV</span>
        <span style={{ color: '#9DA89A' }}>·</span>
        <span>Family-Owned Since 2003</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="font-black tracking-tight leading-[1.04] mt-2"
        style={{ fontSize: 'clamp(2rem, 6.4vw, 4.4rem)', color: '#14180F', letterSpacing: '-0.025em' }}
      >
        Premium Artificial Turf,
        <br />
        Starting at{' '}
        <span
          className="relative"
          style={{
            color: '#367D2F',
            backgroundImage: 'linear-gradient(180deg, transparent 60%, rgba(255, 196, 49, 0.45) 60%, rgba(255, 196, 49, 0.45) 92%, transparent 92%)',
            padding: '0 0.04em',
          }}
        >
          $4.99
          <span className="text-[0.45em] align-super opacity-60">*</span>
        </span>
        /sq.&nbsp;ft
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="text-base md:text-lg max-w-[620px] mt-4 leading-[1.55]"
        style={{ color: '#2A2F25', fontWeight: 400 }}
      >
        Las Vegas&rsquo; family-owned turf installer for <strong style={{ color: '#14180F', fontWeight: 700 }}>23 years</strong>. Limited Lifetime Warranty, SNWA rebate eligibility, and{' '}
        <span
          style={{
            color: '#367D2F',
            fontWeight: 700,
            textDecoration: 'underline',
            textDecorationColor: '#FFC431',
            textDecorationThickness: '0.1em',
            textUnderlineOffset: '0.14em',
          }}
        >
          0% APR financing for 18 months
        </span>{' '}
        on qualifying projects.
      </motion.p>

      {/* Trust pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.25 }}
        className="flex flex-wrap items-center gap-2 mt-6"
      >
        <TrustPill>
          <span style={{ color: '#FFC431', letterSpacing: '0.05em' }}>★★★★★</span>
          <span>4.7 / 5</span>
          <span style={{ color: '#6F7A6C', fontWeight: 500 }}>(473 Google reviews)</span>
        </TrustPill>
        <TrustPill>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#C99800" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Limited Lifetime Warranty
        </TrustPill>
        <TrustPill>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#C99800" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          10,000+ installs
        </TrustPill>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="flex flex-col md:flex-row md:items-center gap-3 mt-6"
      >
        <PrimaryCTA onClick={() => onCta('hero-primary')}>Get My Free Estimate</PrimaryCTA>
        <a
          href={LP_CONFIG.PHONE_TEL}
          className="inline-flex items-center gap-1.5 font-bold text-[0.95rem]"
          style={{ color: '#367D2F', textDecoration: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          or call{' '}
          <b style={{ color: '#14180F', textDecoration: 'underline', textUnderlineOffset: '0.18em' }}>
            {LP_CONFIG.PHONE}
          </b>
          <span style={{ color: '#6F7A6C', fontWeight: 500 }}>— Mon–Sat</span>
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.55 }}
        className="text-xs mt-4 max-w-[580px] leading-[1.45]"
        style={{ color: '#6F7A6C' }}
      >
        *Starts at $4.99/sq.ft for qualifying products. Pricing varies by project size, scope, and signed estimate. 0% APR financing through Wells Fargo Outdoor Solutions, subject to credit approval; job minimum $3,500.
      </motion.p>
    </div>
  );
}

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-semibold"
      style={{
        background: '#FAFBF9',
        border: '1px solid #E5E9E4',
        color: '#2A2F25',
      }}
    >
      {children}
    </span>
  );
}

function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 1.15 }}
      className="relative rounded-[18px] overflow-hidden mt-6 md:mt-0"
      style={{
        aspectRatio: '4/5',
        background: '#EEF7EC',
        boxShadow: '0 8px 24px rgba(20, 24, 15, 0.08), 0 24px 56px rgba(20, 24, 15, 0.12)',
      }}
    >
      <motion.img
        src={LP_CONFIG.COMPANY_HERO_IMG}
        alt="Premium artificial turf installation in a Las Vegas backyard"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 55%' }}
        animate={{ scale: [1.04, 1.1, 1.04] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        loading="eager"
      />
      {/* Glassmorphism rating badge */}
      <div
        className="absolute left-4 bottom-4 inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold border"
        style={{
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(14px) saturate(180%)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 24px rgba(20, 24, 15, 0.16)',
          color: '#14180F',
        }}
      >
        <span style={{ color: '#FFC431' }}>★★★★★</span>
        <span>4.7</span>
        <span style={{ color: '#6F7A6C', fontWeight: 500 }}>/ 5 · 473 reviews</span>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PRIMARY CTA — magnetic + parallax shine sweep
   ════════════════════════════════════════════════════════════════════════ */

function PrimaryCTA({
  children,
  onClick,
  variant = 'green',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'green' | 'gold';
}) {
  const bg = variant === 'gold'
    ? 'linear-gradient(135deg, #FFC431 0%, #C99800 100%)'
    : 'linear-gradient(135deg, #4FAE45 0%, #367D2F 100%)';
  const color = variant === 'gold' ? '#14180F' : '#FFFFFF';

  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-[14px] font-extrabold text-[1.05rem] uppercase tracking-wide cursor-pointer overflow-hidden border-none"
      style={{
        background: bg,
        color,
        minHeight: 56,
        boxShadow: variant === 'gold'
          ? '0 8px 24px rgba(255, 196, 49, 0.32), 0 1px 0 rgba(255, 255, 255, 0.4) inset'
          : '0 4px 16px rgba(54, 125, 47, 0.28), 0 1px 0 rgba(255, 255, 255, 0.18) inset',
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10 inline-block"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        aria-hidden="true"
      >
        →
      </motion.span>
      {/* Shine sweep */}
      <motion.span
        className="absolute top-0 h-full w-[60%]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent)',
          transform: 'skewX(-20deg)',
        }}
        animate={{ left: hovered ? '140%' : '-100%' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   STATS — animated counters
   ════════════════════════════════════════════════════════════════════════ */

function Stats() {
  return (
    <section
      className="py-9 md:py-10 px-5"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F5F0 100%)',
        borderTop: '1px solid #E5E9E4',
        borderBottom: '1px solid #E5E9E4',
      }}
    >
      <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-5">
        <Counter value={23} label="Years Local" />
        <Counter value={10000} suffix="+" label="Installs Across Vegas" suffixColor="#C99800" />
        <Counter value={4.7} decimals={1} stars label="From 473 Google Reviews" />
        <Counter value={0} suffix="%" label="APR · 18-Month Financing" />
      </div>
    </section>
  );
}

function Counter({
  value,
  decimals = 0,
  suffix,
  label,
  stars,
  suffixColor,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  stars?: boolean;
  suffixColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      motionVal.set(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else motionVal.set(value);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, motionVal]);

  useMotionValueEvent(motionVal, 'change', (v) => {
    setDisplay(decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString('en-US'));
  });

  return (
    <div ref={ref} className="text-center">
      <div
        className="font-black leading-none mb-1.5"
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          color: '#367D2F',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {stars && (
          <span className="block leading-none mb-0.5" style={{ color: '#FFC431', fontSize: '0.75em' }}>
            ★★★★★
          </span>
        )}
        {display}
        {suffix && <span style={suffixColor ? { color: suffixColor } : {}}>{suffix}</span>}
      </div>
      <div
        className="text-[0.78rem] font-semibold uppercase tracking-[0.12em]"
        style={{ color: '#6F7A6C' }}
      >
        {label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VALUE PROPS — 3D tilt cards with spring physics
   ════════════════════════════════════════════════════════════════════════ */

const PROPS_DATA = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#367D2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 6 12 16 8 12 2 18" />
        <polyline points="16 6 22 6 22 12" />
      </svg>
    ),
    title: 'Exceptional Value',
    body:
      'Material starts at $4.99/sq.ft on qualifying products. Limited Lifetime Warranty on product, 2-year warranty on labor — both built in, no surcharge.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#367D2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Massive Rebates',
    body:
      'For qualified homeowners in the LVVWD service area, the SNWA rebate (up to $5/sq.ft) + LVVWD topper ($2/sq.ft) can cover most of a yard conversion. We confirm eligibility in the free estimate; homeowner submits paperwork.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#367D2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: 'Unbeatable Warranties',
    body:
      'Limited Lifetime Warranty on product — the longest in the Las Vegas valley. 2-year labor warranty on installation. Pet damage (claws, digging, urine staining) is excluded; we sell in-house maintenance products.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#367D2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: 'Upfront Pricing',
    body:
      'Free in-home estimate with a written, itemized number for your specific yard. No bait pricing, no “the price changed once we got started.” You see financing options and rebate paths side-by-side.',
  },
];

function ValueProps() {
  return (
    <section className="max-w-[1180px] mx-auto py-14 md:py-20 px-5">
      <SectionHead
        eyebrow="Why Vegas Homeowners Pick US Turf"
        title={
          <>
            Four things <em className="not-italic" style={{ color: '#367D2F' }}>built into every install</em> &mdash; not upsold later.
          </>
        }
        sub="Same family, same materials, same crew across all 10,000+ projects. No franchise. No subcontractors. No surprise line items."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {PROPS_DATA.map((p, i) => (
          <TiltCard key={i} {...p} index={i} />
        ))}
      </div>
    </section>
  );
}

function TiltCard({ icon, title, body, index }: { icon: React.ReactNode; title: string; body: string; index: number }) {
  // Spring-physics tilt — replaces vanilla-tilt.js with smoother damping
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), { stiffness: 300, damping: 22 });
  const rotY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 300, damping: 22 });

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  function handlePointer(e: React.PointerEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      whileHover={{
        boxShadow: '0 8px 24px rgba(20, 24, 15, 0.08), 0 24px 56px rgba(20, 24, 15, 0.12)',
      }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
        background: '#FFFFFF',
        border: '1px solid #E5E9E4',
        borderRadius: 18,
        padding: '1.6rem 1.4rem 1.4rem',
        boxShadow: '0 1px 2px rgba(20, 24, 15, 0.04), 0 1px 3px rgba(20, 24, 15, 0.06)',
      }}
      className="relative"
    >
      <div
        className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-4"
        style={{
          background: '#EEF7EC',
          transform: 'translateZ(20px)',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3
        className="text-[1.45rem] font-extrabold leading-tight mb-2.5"
        style={{ color: '#14180F', transform: 'translateZ(15px)' }}
      >
        {title}
      </h3>
      <p
        className="text-[0.95rem] leading-[1.55]"
        style={{ color: '#6F7A6C', transform: 'translateZ(10px)' }}
      >
        {body}
      </p>
    </motion.article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SECTION HEAD — editorial style heading + eyebrow + sub
   ════════════════════════════════════════════════════════════════════════ */

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center max-w-[720px] mx-auto mb-9 md:mb-10"
    >
      <div
        className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase mb-3.5"
        style={{ color: '#367D2F' }}
      >
        {eyebrow}
      </div>
      <h2
        className="font-black leading-[1.12] tracking-tight"
        style={{
          fontSize: 'clamp(2rem, 4.8vw, 3.2rem)',
          color: '#14180F',
          letterSpacing: '-0.022em',
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="mt-3.5 leading-[1.55]"
          style={{
            fontSize: 'clamp(0.98rem, 1.4vw, 1.12rem)',
            color: '#2A2F25',
          }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FINANCING — glassmorphism lead hook
   ════════════════════════════════════════════════════════════════════════ */

function FinancingOffer({ onCta }: { onCta: (s: string) => void }) {
  return (
    <section
      className="relative px-5 py-16 md:py-20 overflow-hidden"
      style={{
        // Bg directly on the section so the dark wrap is guaranteed to render
        // behind the glass card. Aurora blobs + deep green gradient base.
        background:
          'radial-gradient(45% 60% at 20% 30%, rgba(79, 174, 69, 0.28), transparent 65%),' +
          'radial-gradient(45% 60% at 80% 70%, rgba(255, 196, 49, 0.22), transparent 65%),' +
          'linear-gradient(180deg, #1F4C1A 0%, #0F2F0C 100%)',
      }}
    >
      {/* Decorative animated mesh blob for additional aurora movement */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: '-10%',
          zIndex: 0,
          background:
            'radial-gradient(35% 45% at 30% 40%, rgba(255, 216, 110, 0.15), transparent 70%),' +
            'radial-gradient(30% 40% at 70% 60%, rgba(79, 174, 69, 0.18), transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.08, 1.03],
          rotate: [0, 3, -2],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[720px] mx-auto text-center p-8 md:p-10 rounded-3xl"
        style={{
          zIndex: 1,
          // Beefier glass — slightly more white tint + gold-tinted border + halo
          // so the card visibly floats above the dark green wrap.
          background: 'rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(22px) saturate(180%)',
          WebkitBackdropFilter: 'blur(22px) saturate(180%)',
          border: '1px solid rgba(255, 215, 64, 0.35)',
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.22), ' +
            '0 0 0 1px rgba(255, 215, 64, 0.08), ' +
            '0 0 40px rgba(255, 196, 49, 0.18), ' +
            '0 24px 64px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          className="text-[0.78rem] font-bold tracking-[0.24em] uppercase mb-3.5"
          style={{ color: '#FFD86E' }}
        >
          Limited-Time Financing Offer
        </div>
        <h2
          className="font-black leading-[1.05]"
          style={{
            fontSize: 'clamp(2.3rem, 6.5vw, 3.9rem)',
            color: '#FFFFFF',
            letterSpacing: '-0.025em',
          }}
        >
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #FFC431 0%, #FFD86E 100%)' }}
          >
            0% APR
          </span>{' '}
          for 18 Months<span className="text-[0.45em] align-super opacity-70">*</span>
        </h2>
        <p className="mt-4 leading-[1.55] text-base md:text-lg" style={{ color: 'rgba(255, 255, 255, 0.84)' }}>
          Get your premium yard done now, pay over 18 months at 0% APR through{' '}
          <strong style={{ color: '#FFFFFF' }}>Wells Fargo Outdoor Solutions</strong>. Quick credit decisions on most applications.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 my-7 md:my-8">
          <FinStat num="$166" suffix="/mo" label="Starts At" />
          <FinStat num="18" label="Months @ 0% APR" />
          <FinStat num="$3,500" label="Job Minimum" />
        </div>
        <div className="flex justify-center">
          <PrimaryCTA onClick={() => onCta('financing-primary')} variant="gold">
            Lock In 0% Financing
          </PrimaryCTA>
        </div>
        <p className="text-[0.7rem] mt-4 leading-[1.5]" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          *Subject to credit approval through Wells Fargo Outdoor Solutions. Job minimum $3,500. From $166/mo on qualifying projects. Cannot be combined with other promotions including SNWA rebate path.
        </p>
      </motion.div>
    </section>
  );
}

function FinStat({ num, suffix, label }: { num: string; suffix?: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-black leading-none"
        style={{
          fontSize: 'clamp(1.5rem, 4.5vw, 2.4rem)',
          color: '#FFC431',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {num}
        {suffix && <span className="text-[0.55em] opacity-70">{suffix}</span>}
      </div>
      <div
        className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] mt-1"
        style={{ color: 'rgba(255, 255, 255, 0.72)' }}
      >
        {label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PROCESS — 3 steps
   ════════════════════════════════════════════════════════════════════════ */

const PROCESS_STEPS = [
  {
    num: 1,
    title: 'Request a Quote',
    body: 'Fill out the form or call (725) 735-2182. We’ll schedule a free in-home estimate at a time that works for you, usually within a few days.',
  },
  {
    num: 2,
    title: 'Get Your Free Estimate',
    body: 'A US Turf estimator visits your yard, measures, walks you through product options, confirms SNWA rebate eligibility, and hands you a written number.',
  },
  {
    num: 3,
    title: 'Expert Installation',
    body: 'Our in-house crew — not a subcontractor — installs your turf. Most residential installs finish in a small number of working days, depending on yard size and prep.',
  },
];

function Process() {
  return (
    <section className="max-w-[1180px] mx-auto py-14 md:py-20 px-5">
      <SectionHead
        eyebrow="How It Works"
        title={
          <>
            Upgrading your yard <em className="not-italic" style={{ color: '#367D2F' }}>shouldn&rsquo;t be stressful.</em>
          </>
        }
        sub="Three simple steps. No high-pressure sales. No commission-based bait pricing. Just numbers, photos, and a written estimate."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <motion.article
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E9E4',
              borderRadius: 18,
              padding: '1.5rem 1.4rem',
              boxShadow: '0 1px 2px rgba(20, 24, 15, 0.04), 0 1px 3px rgba(20, 24, 15, 0.06)',
            }}
          >
            <div
              className="inline-flex items-center justify-center font-extrabold text-[1.05rem] mb-3.5"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4FAE45 0%, #367D2F 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(54, 125, 47, 0.28)',
              }}
            >
              {s.num}
            </div>
            <h3 className="text-[1.4rem] font-extrabold mb-2" style={{ color: '#14180F' }}>{s.title}</h3>
            <p className="text-[0.95rem] leading-[1.55]" style={{ color: '#6F7A6C' }}>{s.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   REVIEWS
   ════════════════════════════════════════════════════════════════════════ */

const REVIEWS = [
  { text: '“US Turf transformed our backyard. The crew was professional, the install was fast, and the warranty paperwork was actually explained — not buried in fine print.”', name: 'Jennifer M.', avatar: 'JM' },
  { text: '“We saved over $3,200 on our water bill in the first year. SNWA paperwork was straightforward and US Turf walked us through every step.”', name: 'Robert D.', avatar: 'RD' },
  { text: '“Quality far above the other quotes we got. You can tell this is a family business that cares about doing it right.”', name: 'Amanda T.', avatar: 'AT' },
  { text: '“Got financing in under an hour, install scheduled within the week. Yard looks incredible and we’re paying $0 down at 0% APR.”', name: 'Michael C.', avatar: 'MC' },
];

function Reviews() {
  return (
    <section
      className="py-12 md:py-16 overflow-hidden"
      style={{
        background: '#F6F5F0',
        borderTop: '1px solid #E5E9E4',
        borderBottom: '1px solid #E5E9E4',
      }}
    >
      <div className="text-center mb-7 px-5">
        <div
          className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase mb-3.5"
          style={{ color: '#367D2F' }}
        >
          Trusted Across the Las Vegas Valley
        </div>
        <h2
          className="font-black leading-tight"
          style={{
            fontSize: 'clamp(2rem, 4.8vw, 3.2rem)',
            color: '#14180F',
            letterSpacing: '-0.022em',
          }}
        >
          <em className="not-italic" style={{ color: '#367D2F' }}>473 verified</em> Google reviews.{' '}
          <em className="not-italic" style={{ color: '#367D2F' }}>4.7</em> stars.
        </h2>
      </div>

      <div className="group">
        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        >
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ReviewCard({ text, name, avatar }: { text: string; name: string; avatar: string }) {
  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(20, 24, 15, 0.08), 0 12px 28px rgba(20, 24, 15, 0.08)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex-none rounded-2xl p-5"
      style={{
        flexBasis: 320,
        background: '#FFFFFF',
        border: '1px solid #E5E9E4',
        boxShadow: '0 1px 2px rgba(20, 24, 15, 0.04), 0 1px 3px rgba(20, 24, 15, 0.06)',
      }}
    >
      <div className="text-[0.95rem] mb-2.5 leading-none" style={{ color: '#FFC431', letterSpacing: '0.05em' }}>
        ★★★★★
      </div>
      <p className="text-[0.92rem] leading-[1.5] mb-3.5" style={{ color: '#2A2F25' }}>{text}</p>
      <div className="flex items-center gap-2 pt-2.5" style={{ borderTop: '1px solid #E5E9E4' }}>
        <div
          className="rounded-full flex items-center justify-center font-bold text-[0.78rem]"
          style={{
            width: 32,
            height: 32,
            background: '#EEF7EC',
            color: '#367D2F',
          }}
        >
          {avatar}
        </div>
        <div>
          <div className="text-[0.85rem] font-bold" style={{ color: '#14180F' }}>{name}</div>
          <div className="text-[0.75rem]" style={{ color: '#6F7A6C' }}>Verified Google review</div>
        </div>
      </div>
    </motion.article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CITIES
   ════════════════════════════════════════════════════════════════════════ */

const CITIES = [
  'Las Vegas', 'Henderson', 'Summerlin', 'North Las Vegas', 'Anthem', 'Green Valley',
  'Centennial Hills', 'MacDonald Ranch', 'Aliante', 'Mountain’s Edge', 'Spring Valley', 'Boulder City',
];

function Cities() {
  return (
    <section className="max-w-[1180px] mx-auto py-14 md:py-20 px-5">
      <SectionHead
        eyebrow="Service Area"
        title={
          <>
            Serving the <em className="not-italic" style={{ color: '#367D2F' }}>entire Las Vegas valley.</em>
          </>
        }
        sub="From Summerlin to Henderson, North Las Vegas to Anthem — if you’re in the LVVWD or Henderson Water service area, we can confirm SNWA rebate eligibility in your free estimate."
      />
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-w-[760px] mx-auto">
        {CITIES.map((city) => (
          <motion.span
            key={city}
            whileHover={{ background: '#EEF7EC', borderColor: '#4FAE45', color: '#367D2F' }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full text-[0.88rem] font-medium cursor-default"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E9E4',
              color: '#2A2F25',
            }}
          >
            {city}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FINAL CTA — dark gradient with neon underglow
   ════════════════════════════════════════════════════════════════════════ */

function FinalCTA({ onCta }: { onCta: (s: string) => void }) {
  return (
    <section
      className="relative px-5 py-16 md:py-20 text-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #14180F 0%, #2A2F25 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(50% 50% at 30% 30%, rgba(79, 174, 69, 0.18), transparent 65%),' +
            'radial-gradient(40% 50% at 75% 75%, rgba(255, 196, 49, 0.12), transparent 70%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[720px] mx-auto"
      >
        <h2
          className="font-black leading-[1.1]"
          style={{
            fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
            color: '#FFFFFF',
            letterSpacing: '-0.022em',
          }}
        >
          Ready to upgrade your yard?
        </h2>
        <p
          className="mt-4 leading-[1.55] text-base md:text-lg max-w-[560px] mx-auto"
          style={{ color: 'rgba(255, 255, 255, 0.78)' }}
        >
          Free in-home estimate. Limited Lifetime Warranty. 0% APR financing for 18 months on qualifying projects. No commission salesperson, no high-pressure tactics — just a written number for your specific yard.
        </p>
        <div className="flex justify-center mt-6">
          <PrimaryCTA onClick={() => onCta('final-primary')} variant="gold">
            Get My Free Estimate
          </PrimaryCTA>
        </div>
        <div className="mt-3.5 text-[0.92rem]" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          or call{' '}
          <a
            href={LP_CONFIG.PHONE_TEL}
            className="font-bold underline"
            style={{ color: '#FFFFFF', textUnderlineOffset: '0.18em' }}
          >
            {LP_CONFIG.PHONE}
          </a>{' '}
          — Mon–Sat
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   STICKY BAR
   ════════════════════════════════════════════════════════════════════════ */

function StickyBar({ onCta, onCall }: { onCta: (s: string) => void; onCall: () => void }) {
  // Portal to body so position:fixed pins to the VIEWPORT, not to any
  // transformed/overflow-hidden ancestor that would trap it. iOS Safari
  // is especially aggressive about creating containing blocks from
  // transform/filter ancestors.
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="fixed bottom-0 left-0 right-0 z-[99998] flex gap-2 items-center px-3 py-2 md:hidden usturf-react-lp"
      style={{
        background: '#FFFFFF',
        borderTop: '2px solid #4FAE45',
        boxShadow: '0 -4px 18px rgba(31, 42, 28, 0.12)',
        fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={LP_CONFIG.PHONE_TEL}
        onClick={onCall}
        className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-full font-extrabold text-[0.92rem] min-h-[44px]"
        style={{
          background: '#EEF7EC',
          color: '#367D2F',
          textDecoration: 'none',
        }}
      >
        ☎ {LP_CONFIG.PHONE}
      </a>
      <button
        type="button"
        onClick={() => onCta('sticky-estimate')}
        className="flex-1 text-center px-2 py-3 rounded-full font-extrabold text-[0.9rem] uppercase tracking-wide min-h-[44px] border-none cursor-pointer"
        style={{ background: '#4FAE45', color: '#FFFFFF' }}
      >
        Get Free Estimate →
      </button>
    </div>,
    document.body,
  );
}
