import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LP_CONFIG } from '../lib/lp';

/* ──────────────────────────────────────────────────────────────────────
   JotForm modal — neon-themed border, framer-motion entrance, lazy iframe
   load on first open, PostHog event hook-up via onTrack callback.
   ────────────────────────────────────────────────────────────────────── */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onTrack: (event: string, props?: Record<string, unknown>) => void;
}

export function Modal({ open, onClose, onTrack }: ModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const openedAt = useRef<number | null>(null);
  const engagedTimer = useRef<number | null>(null);

  // Lazy-load iframe src on first open
  useEffect(() => {
    if (open && iframeRef.current && !iframeRef.current.src.includes('jotform.com')) {
      iframeRef.current.src = `https://form.jotform.com/${LP_CONFIG.JOTFORM_ID}`;
    }
  }, [open]);

  // Track modal_opened + form_engaged
  useEffect(() => {
    if (open) {
      openedAt.current = Date.now();
      onTrack('lp_modal_opened');
      // 5-second "engaged" marker
      engagedTimer.current = window.setTimeout(() => {
        onTrack('lp_form_engaged');
      }, 5000);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (engagedTimer.current) {
        window.clearTimeout(engagedTimer.current);
        engagedTimer.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (engagedTimer.current) window.clearTimeout(engagedTimer.current);
    };
  }, [open, onTrack]);

  // JotForm postMessage submit listener
  useEffect(() => {
    function handleMsg(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'string') return;
      if (e.data.indexOf('submission-completed') !== -1 || e.data.indexOf('JotFormSubmit') !== -1) {
        onTrack('lead_form_submitted', {
          time_to_submit_ms: openedAt.current ? Date.now() - openedAt.current : null,
        });
      }
    }
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, [onTrack]);

  // Escape closes
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Portal to body so the modal can't be trapped by any ancestor's stacking
  // context, overflow:hidden, or transform. SSR-safe via document check.
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          style={{ background: 'rgba(5, 8, 22, 0.88)', backdropFilter: 'blur(10px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="relative bg-white w-full max-w-[560px] rounded-2xl overflow-hidden"
            style={{
              height: 'min(92dvh, 720px)',
              boxShadow:
                '0 0 0 1px rgba(0, 229, 255, 0.4), 0 0 40px rgba(0, 229, 255, 0.3), 0 0 80px rgba(255, 44, 125, 0.2), 0 24px 64px rgba(0, 0, 0, 0.6)',
            }}
            initial={{ y: 20, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <button
              onClick={onClose}
              aria-label="Close form"
              className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-xl z-10 transition-all"
              style={{
                background: 'rgba(10, 14, 31, 0.92)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)',
              }}
            >
              ×
            </button>
            <iframe
              ref={iframeRef}
              title="Get your free estimate"
              src="about:blank"
              className="w-full h-full border-0"
              allow="geolocation; microphone; camera"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
