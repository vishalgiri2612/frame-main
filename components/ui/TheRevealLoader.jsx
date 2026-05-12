'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_LETTERS = ['E', 'Y', 'E', 'L', 'O', 'V', 'E', 'Y', 'O', 'U'];

export default function TheRevealLoader() {
  const [phase, setPhase] = useState('letters'); // letters | line | curtain | done
  const [isVisible, setIsVisible] = useState(true);
  const [skippable, setSkippable] = useState(false);
  const skipped = useRef(false);

  useEffect(() => {
    // Session check for performance and UX
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    if (hasSeenLoader) {
      setPhase('done');
      setIsVisible(false);
      return;
    }

    // Allow skip after 200ms
    const skipTimer = setTimeout(() => setSkippable(true), 200);

    // Phase sequence timing
    const lineTimer = setTimeout(() => {
      if (!skipped.current) setPhase('line');
    }, 400);

    const curtainTimer = setTimeout(() => {
      if (!skipped.current) setPhase('curtain');
    }, 900);

    const doneTimer = setTimeout(() => {
      if (!skipped.current) setPhase('done');
      sessionStorage.setItem('hasSeenLoader', 'true');
      setTimeout(() => setIsVisible(false), 200);
    }, 1300);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(lineTimer);
      clearTimeout(curtainTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = () => {
    if (!skippable) return;
    skipped.current = true;
    setPhase('done');
    setTimeout(() => setIsVisible(false), 200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="reveal-loader"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#0A0E1A' }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
          }}
        >
          {/* Ambient background glow — static, no loop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
            }}
          />

          {/* Center content */}
          <div className="flex flex-col items-center gap-0">
            {/* Wordmark — letter by letter */}
            <div className="flex items-center" aria-label="EYELOVEYOU">
              {BRAND_LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.03,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 300,
                    letterSpacing: '0.35em',
                    color: '#F7F4EF',
                    lineHeight: 1,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Gold line sweep */}
            <div className="relative mt-3 w-full" style={{ height: '1px' }}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={phase !== 'letters' ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformOrigin: 'left',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
                  width: '100%',
                }}
              />
            </div>

            {/* Sub-label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase !== 'letters' ? 0.5 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.25em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                marginTop: '12px',
              }}
            >
              Punjab Optical · Est. 1987
            </motion.p>
          </div>

          {/* Skip hint */}
          <AnimatePresence>
            {skippable && phase !== 'done' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={handleSkip}
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  right: '32px',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  color: '#C8BFB4',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Skip ›
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
