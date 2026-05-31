import { useEffect, useRef } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   Vanilla canvas particle starfield — ~80 twinkling stars, 30fps cap.
   Wrapped in a React component for clean mount/unmount lifecycle.
   ────────────────────────────────────────────────────────────────────── */

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.8 + 0.2,
      v: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let lastT = 0;
    let raf: number;
    function tick(now: number) {
      if (now - lastT < 33) {
        // 30fps cap
        raf = requestAnimationFrame(tick);
        return;
      }
      lastT = now;
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        s.phase += 0.02;
        const twinkle = (Math.sin(s.phase) + 1) / 2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${s.a * (0.4 + 0.6 * twinkle)})`;
        ctx.fill();
        s.y += s.v * 0.3;
        if (s.y > window.innerHeight + 5) {
          s.y = -5;
          s.x = Math.random() * window.innerWidth;
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-70"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
