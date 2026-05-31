import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Starfield } from './components/Starfield';
import { Modal } from './components/Modal';
import { usePostHog } from './hooks/usePostHog';
import { LP_CONFIG } from './lib/lp';

const LP_NAME = 'social2026-neon-react';

/* ════════════════════════════════════════════════════════════════════════
   VEGAS NEON LP — React + framer-motion port
   "Bellagio at midnight" aesthetic, with effects that genuinely needed JS:
   - Spring-physics cursor aurora (mouseX/Y → springs → CSS vars)
   - useScroll-driven background drift on hero
   - Spring-physics card tilt on hover (per-card useMotionValue)
   - Scroll-into-view counter animation
   - Magnetic CTA button (spring with damping)
   ════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const track = usePostHog(LP_NAME);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (source: string) => {
    track('lp_cta_clicked', { cta_source: source });
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans" style={{ background: '#050816' }}>
      <Starfield />
      <BackgroundMesh />
      <CursorAurora />

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

      <StickyBar onCta={openModal} onCall={() => track('lp_cta_clicked', { cta_source: 'sticky-call' })} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onTrack={track} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   BACKGROUND LAYERS
   ════════════════════════════════════════════════════════════════════════ */

function BackgroundMesh() {
  const { scrollY } = useScroll();
  // Subtle parallax — mesh drifts slightly faster than scroll
  const y = useTransform(scrollY, [0, 2000], [0, -120]);
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        inset: '-10%',
        zIndex: 0,
        y,
        background:
          'radial-gradient(50% 60% at 18% 22%, rgba(0, 229, 255, 0.22), transparent 70%),' +
          'radial-gradient(40% 50% at 78% 18%, rgba(255, 44, 125, 0.18), transparent 70%),' +
          'radial-gradient(45% 55% at 70% 80%, rgba(168, 85, 247, 0.14), transparent 70%),' +
          'radial-gradient(35% 45% at 22% 78%, rgba(255, 215, 64, 0.12), transparent 70%)',
        filter: 'blur(60px)',
        opacity: 0.65,
      }}
      animate={{
        scale: [1, 1.06, 1.03],
        rotate: [0, 2, -1.5],
      }}
      transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

function CursorAurora() {
  // Spring-tracked cursor for the dual-aurora effect.
  // PURE CSS can't do this — needs JS for mouse coords + spring damping.
  const mouseX = useMotionValue(0.3);
  const mouseY = useMotionValue(0.3);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    }
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  const bgX = useTransform(springX, (v) => `${v * 100}%`);
  const bgY = useTransform(springY, (v) => `${v * 100}%`);
  const bgX2 = useTransform(springX, (v) => `${(1 - v) * 100}%`);
  const bgY2 = useTransform(springY, (v) => `${(1 - v) * 100}%`);

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        inset: 0,
        zIndex: 1,
        mixBlendMode: 'screen',
        background: useTransform(
          [bgX, bgY, bgX2, bgY2],
          ([x, y, x2, y2]: string[]) =>
            `radial-gradient(420px circle at ${x} ${y}, rgba(0, 229, 255, 0.18) 0%, rgba(0, 229, 255, 0.06) 30%, transparent 60%),` +
            `radial-gradient(380px circle at ${x2} ${y2}, rgba(255, 44, 125, 0.16) 0%, rgba(255, 44, 125, 0.05) 30%, transparent 60%)`,
        ),
      }}
      aria-hidden="true"
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════════════ */

function Hero({ onCta }: { onCta: (s: string) => void }) {
  return (
    <header className="relative px-5 md:px-8 pt-12 md:pt-16 pb-14 md:pb-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 text-[0.74rem] font-semibold tracking-[0.22em] uppercase text-cyan-200"
            style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)' }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ boxShadow: ['0 0 0 4px rgba(0, 229, 255, 0.2)', '0 0 0 8px rgba(0, 229, 255, 0.06)', '0 0 0 4px rgba(0, 229, 255, 0.2)'] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <span>Las Vegas, NV</span>
            <span className="text-white/30">·</span>
            <span>Family-Owned Since 2003</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mt-4"
          >
            Premium Turf,
            <br />
            <NeonLineWord>
              Vegas <span className="text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.7), 0 0 24px rgba(0, 229, 255, 0.45), 0 0 56px rgba(0, 229, 255, 0.2)' }}>Built</span>
            </NeonLineWord>
            <br />
            Starting at{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FFD740 0%, #FFA500 100%)',
                filter: 'drop-shadow(0 0 14px rgba(255, 183, 0, 0.4))',
              }}
            >
              $4.99
              <span className="text-[0.45em] align-super opacity-60 text-white">*</span>
            </span>
            /sq.&nbsp;ft
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base md:text-xl text-white/74 mt-5 max-w-[620px] leading-[1.55]"
          >
            Las Vegas&rsquo; family-owned turf installer for <strong className="text-white font-bold">23 years</strong>. Limited Lifetime Warranty, SNWA rebate eligibility, and{' '}
            <strong className="text-amber-300" style={{ textShadow: '0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35)' }}>
              0% APR financing for 18 months
            </strong>{' '}
            on qualifying projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center gap-2 md:gap-3 mt-6"
          >
            <TrustPill>
              <span className="text-amber-300" style={{ textShadow: '0 0 10px rgba(255, 215, 64, 0.6)' }}>★★★★★</span>
              <span>4.7 / 5</span>
              <span className="text-white/50 font-medium">(473 Google reviews)</span>
            </TrustPill>
            <TrustPill>Limited Lifetime Warranty</TrustPill>
            <TrustPill>10,000+ installs</TrustPill>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col gap-3 mt-7"
          >
            <PrimaryCTA onClick={() => onCta('hero-primary')}>Get My Free Estimate</PrimaryCTA>
            <a
              href={LP_CONFIG.PHONE_TEL}
              className="inline-flex items-center gap-2 font-bold text-base text-cyan-100 hover:text-cyan-300 transition-colors"
              style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.4)' }}
            >
              or call <b className="text-white underline decoration-cyan-400 underline-offset-4">{LP_CONFIG.PHONE}</b>
              <span className="text-white/30 font-medium">— Mon–Sat</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="text-xs text-white/35 mt-5 max-w-[580px] leading-relaxed"
          >
            *Starts at $4.99/sq.ft for qualifying products. Pricing varies by project size, scope, and signed estimate. 0% APR financing through Wells Fargo Outdoor Solutions, subject to credit approval; job minimum $3,500.
          </motion.p>
        </div>

        <HeroImage />
      </div>
    </header>
  );
}

function NeonLineWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 origin-left"
        style={{
          bottom: '-0.06em',
          height: '3px',
          background: 'linear-gradient(90deg, #00E5FF 0%, #FF2C7D 100%)',
          boxShadow: '0 0 6px rgba(0, 229, 255, 0.7), 0 0 12px rgba(255, 44, 125, 0.5)',
        }}
      />
    </span>
  );
}

function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.54 }}
      className="relative rounded-[18px] overflow-hidden aspect-[16/11] md:aspect-[4/5]"
      style={{
        background: '#131836',
        boxShadow:
          '0 0 0 1px rgba(255, 255, 255, 0.14), 0 0 40px rgba(0, 229, 255, 0.12), 0 0 80px rgba(255, 44, 125, 0.08), 0 24px 64px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Animated conic-gradient neon frame */}
      <motion.div
        className="absolute"
        style={{
          inset: -2,
          borderRadius: 20,
          background: 'conic-gradient(from 0deg, #00E5FF, #FF2C7D, #A855F7, #FFD740, #00E5FF)',
          filter: 'blur(8px)',
          opacity: 0.55,
          zIndex: -1,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.img
        src={LP_CONFIG.COMPANY_HERO_IMG}
        alt="Premium artificial turf installation in a Las Vegas backyard"
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 55%', filter: 'saturate(1.05) brightness(0.95)' }}
        animate={{ scale: [1.04, 1.1, 1.04] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        loading="eager"
      />
      <div
        className="absolute left-3 bottom-3 flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-white border"
        style={{
          background: 'rgba(10, 14, 31, 0.7)',
          backdropFilter: 'blur(16px) saturate(160%)',
          borderColor: 'rgba(255, 255, 255, 0.14)',
          boxShadow: '0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35)',
        }}
      >
        <span className="text-amber-300" style={{ textShadow: '0 0 10px rgba(255, 215, 64, 0.6)' }}>★★★★★</span>
        <span>4.7</span>
        <span className="text-white/50 font-medium">/ 5 · 473 reviews</span>
      </div>
    </motion.div>
  );
}

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      whileHover={{
        borderColor: 'rgba(0, 229, 255, 0.5)',
        boxShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)',
      }}
      transition={{ duration: 0.24 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.82rem] font-semibold border"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px) saturate(160%)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
      }}
    >
      {children}
    </motion.span>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PRIMARY CTA — magnetic + pulsing neon glow
   ════════════════════════════════════════════════════════════════════════ */

function PrimaryCTA({
  children,
  onClick,
  variant = 'cyan-magenta',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'cyan-magenta' | 'gold';
}) {
  const bg =
    variant === 'gold'
      ? 'linear-gradient(135deg, #FFD740 0%, #FFB300 100%)'
      : 'linear-gradient(135deg, #00E5FF 0%, #FF2C7D 100%)';

  const baseGlow =
    variant === 'gold'
      ? '0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35), 0 0 56px rgba(255, 215, 64, 0.3), 0 1px 0 rgba(255, 255, 255, 0.5) inset'
      : '0 0 12px rgba(0, 229, 255, 0.75), 0 0 36px rgba(0, 229, 255, 0.45), 0 0 64px rgba(0, 229, 255, 0.18), 0 0 28px rgba(255, 44, 125, 0.35), 0 1px 0 rgba(255, 255, 255, 0.4) inset';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        boxShadow: [
          baseGlow,
          variant === 'gold'
            ? '0 0 16px rgba(255, 215, 64, 0.9), 0 0 48px rgba(255, 215, 64, 0.55), 0 0 80px rgba(255, 183, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.55) inset'
            : '0 0 16px rgba(0, 229, 255, 0.9), 0 0 48px rgba(0, 229, 255, 0.55), 0 0 80px rgba(255, 44, 125, 0.4), 0 1px 0 rgba(255, 255, 255, 0.45) inset',
          baseGlow,
        ],
      }}
      transition={{
        boxShadow: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        y: { type: 'spring', stiffness: 380, damping: 22 },
        scale: { type: 'spring', stiffness: 380, damping: 22 },
      }}
      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[14px] font-extrabold text-base uppercase tracking-wide border-none cursor-pointer w-fit min-h-[56px]"
      style={{ background: bg, color: '#050816' }}
    >
      {children}
      <motion.span aria-hidden="true" className="inline-block">→</motion.span>
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   STATS STRIP — counters animate when scrolled into view
   ════════════════════════════════════════════════════════════════════════ */

function Stats() {
  return (
    <section
      className="py-10 md:py-14 px-5 border-y"
      style={{
        background: 'rgba(10, 14, 31, 0.5)',
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
      }}
      aria-label="Quick facts"
    >
      <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        <Counter value={23} label="Years Local" />
        <Counter value={10000} suffix="+" label="Installs Across Vegas" suffixColor="text-pink-500" />
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
    const controls = { from: 0, to: value };
    const start = performance.now();
    const duration = 1600;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      motionVal.set(controls.to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else motionVal.set(controls.to);
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
        className="text-3xl md:text-5xl font-bold leading-none mb-1.5 text-cyan-400"
        style={{
          fontFamily: 'Space Grotesk, Poppins, sans-serif',
          textShadow: '0 0 8px rgba(0, 229, 255, 0.7), 0 0 24px rgba(0, 229, 255, 0.4)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {stars && (
          <span className="block text-amber-300 text-[0.7em] leading-none mb-1" style={{ textShadow: '0 0 10px rgba(255, 215, 64, 0.6)' }}>
            ★★★★★
          </span>
        )}
        {display}
        {suffix && <span className={suffixColor} style={suffixColor ? { textShadow: '0 0 8px rgba(255, 44, 125, 0.55), 0 0 24px rgba(255, 44, 125, 0.35)' } : {}}>{suffix}</span>}
      </div>
      <div
        className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50"
        style={{ fontFamily: 'Space Grotesk, Poppins, sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VALUE PROPS — spring-physics tilt on cards (real, not CSS)
   ════════════════════════════════════════════════════════════════════════ */

const PROPS_DATA = [
  {
    icon: '↗',
    title: 'Exceptional Value',
    body:
      'Material starts at $4.99/sq.ft on qualifying products. Limited Lifetime Warranty on product, 2-year warranty on labor — both built in, no surcharge.',
    accent: { glow: 'rgba(0, 229, 255, 0.55)', borderHover: 'rgba(0, 229, 255, 0.42)' },
  },
  {
    icon: '◆',
    title: 'Massive Rebates',
    body:
      'For qualified homeowners in the LVVWD service area, the SNWA rebate (up to $5/sq.ft) + LVVWD topper ($2/sq.ft) can cover most of a yard conversion. We confirm eligibility in the free estimate; homeowner submits paperwork.',
    accent: { glow: 'rgba(255, 44, 125, 0.55)', borderHover: 'rgba(255, 44, 125, 0.45)' },
  },
  {
    icon: '🛡',
    title: 'Unbeatable Warranties',
    body:
      'Limited Lifetime Warranty on product — the longest in the Las Vegas valley. 2-year labor warranty on installation. Pet damage (claws, digging, urine staining) is excluded; we sell in-house maintenance products.',
    accent: { glow: 'rgba(168, 85, 247, 0.55)', borderHover: 'rgba(168, 85, 247, 0.45)' },
  },
  {
    icon: '!',
    title: 'Upfront Pricing',
    body:
      'Free in-home estimate with a written, itemized number for your specific yard. No bait pricing, no “the price changed once we got started.” You see financing options and rebate paths side-by-side.',
    accent: { glow: 'rgba(255, 215, 64, 0.5)', borderHover: 'rgba(255, 215, 64, 0.5)' },
  },
];

function ValueProps() {
  return (
    <section className="max-w-[1180px] mx-auto py-16 md:py-20 px-5">
      <div className="text-center max-w-[720px] mx-auto mb-10 md:mb-12">
        <div
          className="text-[0.74rem] font-semibold tracking-[0.22em] uppercase text-pink-300 mb-3"
          style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.4)' }}
        >
          Why Vegas Homeowners Pick US Turf
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Four things{' '}
          <em className="not-italic text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)' }}>
            built into every install
          </em>{' '}
          —{' '}
          <em className="not-italic text-pink-500" style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.55), 0 0 24px rgba(255, 44, 125, 0.35)' }}>
            not upsold
          </em>{' '}
          later.
        </h2>
        <p className="text-base md:text-lg text-white/74 mt-4 leading-relaxed">
          Same family, same materials, same crew across all 10,000+ projects. No franchise. No subcontractors. No surprise line items.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {PROPS_DATA.map((p, i) => (
          <PropCard key={i} {...p} index={i} />
        ))}
      </div>
    </section>
  );
}

function PropCard({
  icon,
  title,
  body,
  accent,
  index,
}: {
  icon: string;
  title: string;
  body: string;
  accent: { glow: string; borderHover: string };
  index: number;
}) {
  // Spring-physics tilt — actually impossible in pure CSS
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), { stiffness: 300, damping: 22 });
  const rotY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 300, damping: 22 });

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
      whileHover={{ borderColor: accent.borderHover, boxShadow: `0 0 12px ${accent.glow}, 0 0 36px ${accent.glow.replace('0.55', '0.35')}, 0 12px 40px rgba(0, 0, 0, 0.6)` }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1000,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        transformStyle: 'preserve-3d',
      }}
      className="relative rounded-2xl p-6 md:p-7 transition-colors"
    >
      <div
        className="w-13 h-13 rounded-2xl flex items-center justify-center mb-4 text-white text-2xl font-bold"
        style={{
          width: 52,
          height: 52,
          background:
            index === 0
              ? 'linear-gradient(135deg, #0099CC 0%, #A855F7 100%)'
              : index === 1
                ? 'linear-gradient(135deg, #FF2C7D 0%, #FFD740 100%)'
                : index === 2
                  ? 'linear-gradient(135deg, #A855F7 0%, #FF2C7D 100%)'
                  : 'linear-gradient(135deg, #FFD740 0%, #FFB300 100%)',
          boxShadow: `0 0 12px ${accent.glow}, 0 0 28px ${accent.glow.replace('0.55', '0.35')}`,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-2xl font-extrabold text-white leading-tight mb-2">{title}</h3>
      <p className="text-white/74 text-[0.96rem] leading-[1.55]">{body}</p>
    </motion.article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FINANCING — premium glass card with intense gold neon
   ════════════════════════════════════════════════════════════════════════ */

function FinancingOffer({ onCta }: { onCta: (s: string) => void }) {
  return (
    <section className="relative px-5 py-16 md:py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(50% 60% at 20% 30%, rgba(255, 215, 64, 0.18), transparent 65%),' +
            'radial-gradient(50% 60% at 80% 70%, rgba(255, 44, 125, 0.16), transparent 65%)',
          zIndex: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[720px] mx-auto p-8 md:p-10 text-center"
        style={{
          zIndex: 1,
          background: 'rgba(10, 14, 31, 0.65)',
          backdropFilter: 'blur(24px) saturate(160%)',
          border: '1px solid rgba(255, 215, 64, 0.32)',
          borderRadius: 24,
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35), 0 0 80px rgba(255, 215, 64, 0.12), 0 24px 64px rgba(0, 0, 0, 0.55)',
        }}
      >
        <div
          className="text-[0.78rem] font-semibold tracking-[0.24em] uppercase mb-3 text-amber-300"
          style={{ fontFamily: 'Space Grotesk, Poppins, sans-serif', textShadow: '0 0 10px rgba(255, 215, 64, 0.6)' }}
        >
          Limited-Time Financing Offer
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FFD740 0%, #FFA500 100%)',
              filter: 'drop-shadow(0 0 14px rgba(255, 183, 0, 0.45))',
            }}
          >
            0% APR
          </span>{' '}
          for 18 Months
          <span className="text-[0.45em] align-super opacity-70">*</span>
        </h2>
        <p className="text-white/74 text-base md:text-lg mt-4 leading-[1.55]">
          Get your premium yard done now, pay over 18 months at 0% APR through{' '}
          <strong className="text-white">Wells Fargo Outdoor Solutions</strong>. Quick credit decisions on most applications.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 my-8 md:my-10">
          <FinStat num="$166" suffix="/mo" label="Starts At" />
          <FinStat num="18" label="Months @ 0% APR" />
          <FinStat num="$3,500" label="Job Minimum" />
        </div>
        <div className="flex justify-center">
          <PrimaryCTA onClick={() => onCta('financing-primary')} variant="gold">
            Lock In 0% Financing
          </PrimaryCTA>
        </div>
        <p className="text-xs text-white/35 mt-5 leading-relaxed">
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
        className="text-2xl md:text-4xl font-bold leading-none text-amber-300"
        style={{
          fontFamily: 'Space Grotesk, Poppins, sans-serif',
          textShadow: '0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {num}
        {suffix && <span className="text-[0.55em] opacity-70">{suffix}</span>}
      </div>
      <div
        className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white/50 mt-1.5"
        style={{ fontFamily: 'Space Grotesk, Poppins, sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PROCESS
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
    <section className="max-w-[1180px] mx-auto py-16 md:py-20 px-5">
      <div className="text-center max-w-[720px] mx-auto mb-10">
        <div
          className="text-[0.74rem] font-semibold tracking-[0.22em] uppercase text-pink-300 mb-3"
          style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.4)' }}
        >
          How It Works
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Upgrading your yard{' '}
          <em className="not-italic text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)' }}>
            shouldn&rsquo;t be stressful.
          </em>
        </h2>
        <p className="text-base md:text-lg text-white/74 mt-4 leading-relaxed">
          Three simple steps. No high-pressure sales. No commission-based bait pricing. Just numbers, photos, and a written estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {PROCESS_STEPS.map((s, i) => (
          <motion.article
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ borderColor: 'rgba(0, 229, 255, 0.32)', boxShadow: '0 0 0 1px rgba(0, 229, 255, 0.2), 0 0 24px rgba(0, 229, 255, 0.18)' }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(14px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 18,
              padding: '1.6rem 1.5rem',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mb-4 text-[#050816]"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #FF2C7D 100%)',
                boxShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)',
                fontFamily: 'Space Grotesk, Poppins, sans-serif',
              }}
            >
              {s.num}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">{s.title}</h3>
            <p className="text-white/74 text-[0.96rem] leading-[1.55]">{s.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   REVIEWS — marquee
   ════════════════════════════════════════════════════════════════════════ */

const REVIEWS = [
  {
    text:
      '“US Turf transformed our backyard. The crew was professional, the install was fast, and the warranty paperwork was actually explained — not buried in fine print.”',
    name: 'Jennifer M.',
    avatar: 'JM',
  },
  {
    text:
      '“We saved over $3,200 on our water bill in the first year. SNWA paperwork was straightforward and US Turf walked us through every step.”',
    name: 'Robert D.',
    avatar: 'RD',
  },
  {
    text:
      '“Quality far above the other quotes we got. You can tell this is a family business that cares about doing it right.”',
    name: 'Amanda T.',
    avatar: 'AT',
  },
  {
    text:
      '“Got financing in under an hour, install scheduled within the week. Yard looks incredible and we’re paying $0 down at 0% APR.”',
    name: 'Michael C.',
    avatar: 'MC',
  },
];

function Reviews() {
  return (
    <section
      className="py-14 md:py-16 overflow-hidden border-y"
      style={{
        background: 'rgba(10, 14, 31, 0.45)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
      }}
    >
      <div className="text-center mb-8 px-5">
        <div
          className="text-[0.74rem] font-semibold tracking-[0.22em] uppercase text-pink-300 mb-3"
          style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.4)' }}
        >
          Trusted Across the Las Vegas Valley
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          <em className="not-italic text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)' }}>
            473 verified
          </em>{' '}
          Google reviews.{' '}
          <em className="not-italic text-pink-500" style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.55), 0 0 24px rgba(255, 44, 125, 0.35)' }}>
            4.7
          </em>{' '}
          stars.
        </h2>
      </div>

      <div className="group">
        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 56, repeat: Infinity, ease: 'linear' }}
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
      whileHover={{ y: -3, borderColor: 'rgba(255, 215, 64, 0.42)', boxShadow: '0 0 10px rgba(255, 215, 64, 0.6), 0 0 28px rgba(255, 215, 64, 0.35)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="flex-none p-5 rounded-2xl border"
      style={{
        flexBasis: 320,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(14px) saturate(160%)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
      }}
    >
      <div
        className="text-amber-300 text-sm tracking-wider mb-2 leading-none"
        style={{ textShadow: '0 0 10px rgba(255, 215, 64, 0.6)' }}
      >
        ★★★★★
      </div>
      <p className="text-[0.93rem] leading-[1.55] text-white mb-3.5">{text}</p>
      <div className="flex items-center gap-2.5 pt-3 border-t border-white/14">
        <div
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-xs text-white"
          style={{
            background: 'linear-gradient(135deg, #0099CC 0%, #A855F7 100%)',
            boxShadow: '0 0 8px rgba(0, 229, 255, 0.4)',
          }}
        >
          {avatar}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className="text-[0.74rem] text-white/50">Verified Google review</div>
        </div>
      </div>
    </motion.article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CITIES
   ════════════════════════════════════════════════════════════════════════ */

const CITIES = [
  'Las Vegas',
  'Henderson',
  'Summerlin',
  'North Las Vegas',
  'Anthem',
  'Green Valley',
  'Centennial Hills',
  'MacDonald Ranch',
  'Aliante',
  'Mountain’s Edge',
  'Spring Valley',
  'Boulder City',
];

function Cities() {
  return (
    <section className="max-w-[1180px] mx-auto py-16 md:py-20 px-5">
      <div className="text-center max-w-[760px] mx-auto mb-8">
        <div
          className="text-[0.74rem] font-semibold tracking-[0.22em] uppercase text-pink-300 mb-3"
          style={{ textShadow: '0 0 8px rgba(255, 44, 125, 0.4)' }}
        >
          Service Area
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Serving the{' '}
          <em className="not-italic text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)' }}>
            entire Las Vegas valley.
          </em>
        </h2>
        <p className="text-base md:text-lg text-white/74 mt-4 leading-relaxed">
          From Summerlin to Henderson, North Las Vegas to Anthem — if you&rsquo;re in the LVVWD or Henderson Water service area, we can confirm SNWA rebate eligibility in your free estimate.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center max-w-[760px] mx-auto">
        {CITIES.map((city) => (
          <motion.span
            key={city}
            whileHover={{
              color: '#00E5FF',
              borderColor: 'rgba(0, 229, 255, 0.5)',
              boxShadow: '0 0 8px rgba(0, 229, 255, 0.55), 0 0 24px rgba(0, 229, 255, 0.35)',
              textShadow: '0 0 8px rgba(0, 229, 255, 0.55)',
            }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full text-[0.9rem] font-medium text-white/74 border cursor-default"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px) saturate(160%)',
              borderColor: 'rgba(255, 255, 255, 0.14)',
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
   FINAL CTA
   ════════════════════════════════════════════════════════════════════════ */

function FinalCTA({ onCta }: { onCta: (s: string) => void }) {
  return (
    <section
      className="relative py-16 md:py-24 px-5 text-center overflow-hidden border-t"
      style={{
        background:
          'radial-gradient(60% 60% at 50% 50%, rgba(0, 229, 255, 0.14), transparent 70%),' +
          'radial-gradient(70% 70% at 50% 50%, rgba(255, 44, 125, 0.10), transparent 70%)',
        borderColor: 'rgba(255, 255, 255, 0.14)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[720px] mx-auto"
      >
        <h2
          className="text-3xl md:text-6xl font-black tracking-tight leading-[1.08] text-white"
          style={{ textShadow: '0 0 24px rgba(0, 229, 255, 0.3), 0 0 48px rgba(255, 44, 125, 0.18)' }}
        >
          Ready to upgrade your yard?
        </h2>
        <p className="text-base md:text-lg text-white/74 mt-4 max-w-[560px] mx-auto leading-[1.55]">
          Free in-home estimate. Limited Lifetime Warranty. 0% APR financing for 18 months on qualifying projects. No commission salesperson, no high-pressure tactics — just a written number for your specific yard.
        </p>
        <div className="flex justify-center mt-6">
          <PrimaryCTA onClick={() => onCta('final-primary')} variant="gold">
            Get My Free Estimate
          </PrimaryCTA>
        </div>
        <div className="mt-4 text-sm text-white/50">
          or call{' '}
          <a
            href={LP_CONFIG.PHONE_TEL}
            className="text-cyan-100 font-bold underline decoration-cyan-400 underline-offset-4"
            style={{ textShadow: '0 0 8px rgba(0, 229, 255, 0.3)' }}
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
   STICKY MOBILE CTA
   ════════════════════════════════════════════════════════════════════════ */

function StickyBar({ onCta, onCall }: { onCta: (s: string) => void; onCall: () => void }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[99998] flex gap-2 items-center px-3 py-2 md:hidden"
      style={{
        background: 'rgba(10, 14, 31, 0.92)',
        backdropFilter: 'blur(18px) saturate(180%)',
        borderTop: '1px solid rgba(0, 229, 255, 0.42)',
        boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.6), 0 -2px 12px rgba(0, 229, 255, 0.2)',
      }}
      role="region"
      aria-label="Quick contact"
    >
      <a
        href={LP_CONFIG.PHONE_TEL}
        onClick={onCall}
        className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-full font-extrabold text-sm text-cyan-100 min-h-[44px]"
        style={{
          background: 'rgba(0, 229, 255, 0.10)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          textShadow: '0 0 6px rgba(0, 229, 255, 0.4)',
        }}
      >
        ☎ {LP_CONFIG.PHONE}
      </a>
      <button
        type="button"
        onClick={() => onCta('sticky-estimate')}
        className="flex-1 text-center px-2 py-3 rounded-full font-extrabold text-sm uppercase tracking-wide min-h-[44px] border-none cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #00E5FF 0%, #FF2C7D 100%)',
          color: '#050816',
          boxShadow: '0 0 16px rgba(0, 229, 255, 0.55), 0 0 28px rgba(255, 44, 125, 0.32)',
        }}
      >
        Get Free Estimate →
      </button>
    </div>
  );
}
