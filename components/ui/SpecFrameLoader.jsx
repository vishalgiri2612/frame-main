'use client';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, useRef, useMemo } from 'react';

// ── LOADING PHASES ──
const PHASES = [
  { label: 'INITIALIZING OPTICS', range: [0, 25] },
  { label: 'CALIBRATING LENSES', range: [25, 50] },
  { label: 'ALIGNING FRAMES', range: [50, 75] },
  { label: 'FOCUSING VISION', range: [75, 100] },
];

export default function SpecFrameLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Physics-based spring for buttery smooth progress bar
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 35, damping: 18, mass: 1.5 });
  const progressPercent = useTransform(smoothProgress, [0, 100], ['0%', '100%']);

  // Glow intensity tied to progress
  const glowIntensity = useTransform(smoothProgress, [0, 100], [0.15, 0.6]);

  // Pre-generate particle positions to avoid SSR hydration mismatch
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: `${(i * 37.7 + 13) % 100}%`,
      y: `${(i * 53.3 + 7) % 100}%`,
      size: 1 + (i % 3),
      duration: 3 + (i % 5) * 1.2,
      delay: (i % 7) * 0.4,
    })),
  []);

  useEffect(() => {
    setIsMounted(true);
    let value = 0;
    const interval = setInterval(() => {
      // Variable speed: slower near phase boundaries for dramatic effect
      const nearBoundary = PHASES.some(p => Math.abs(value - p.range[1]) < 8);
      const increment = nearBoundary ? Math.random() * 4 + 1 : Math.random() * 15 + 5;
      value = Math.min(value + increment, 100);

      setProgress(Math.floor(value));
      rawProgress.set(value);

      // Update phase
      const currentPhase = PHASES.findIndex(p => value >= p.range[0] && value < p.range[1]);
      if (currentPhase !== -1) setPhase(currentPhase);

      if (value >= 100) {
        clearInterval(interval);
        setPhase(3);
        setTimeout(() => setIsVisible(false), 400); // Shortened for snappier entry
      }
    }, 60);

    return () => clearInterval(interval);
  }, [rawProgress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 bg-[#030508] z-[100] flex items-center justify-center overflow-hidden"
        >
          {/* ── AMBIENT BACKGROUND LAYERS ── */}
          
          {/* Deep radial glow */}
          <motion.div
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[120vw] h-[120vh] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(212,175,55,0.04) 0%, rgba(42,191,175,0.015) 30%, transparent 65%)',
            }}
          />

          {/* Noise texture layer */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* ── FLOATING PARTICLES ── */}
          {isMounted && particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                x: p.x, y: p.y, opacity: 0, scale: 0
              }}
              animate={{
                y: [p.y, `${parseInt(p.y) - 40}%`],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: p.id % 3 === 0 ? '#D4AF37' : 'rgba(42,191,175,0.6)',
                filter: `blur(${p.size > 2 ? 1 : 0}px)`,
              }}
            />
          ))}

          {/* ── MAIN CONTENT ── */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 60,
              x: '22%',
              opacity: 0,
              filter: 'blur(3px)',
              transition: { 
                duration: 2.4, 
                ease: [0.76, 0, 0.24, 1],
                opacity: { delay: 1, duration: 1.2 }
              }
            }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: '30% 50%' }}
            className="relative flex flex-col items-center z-10"
          >
            {/* ── SVG GLASSES — HIGH-DETAIL WIREFRAME ── */}
            <motion.div className="relative">
              {/* Animated glow wrapper */}
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(212,175,55,0.15))',
                    'drop-shadow(0 0 30px rgba(212,175,55,0.4))',
                    'drop-shadow(0 0 8px rgba(212,175,55,0.15))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  width="420" height="170" viewBox="0 0 420 170"
                  fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ── LEFT RIM ── */}
                  <motion.path
                    d="M55 62C55 36 75 25 108 25H152C176 25 188 42 188 68V92C188 118 168 138 140 138H105C76 138 55 118 55 92V62Z"
                    stroke="#D4AF37"
                    strokeWidth="2.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* ── RIGHT RIM ── */}
                  <motion.path
                    d="M232 68C232 42 242 25 265 25H300C330 25 348 36 348 62V92C348 118 335 138 308 138H270C245 138 232 118 232 92V68Z"
                    stroke="#D4AF37"
                    strokeWidth="2.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* ── BRIDGE ── */}
                  <motion.path
                    d="M188 60C188 60 197 48 210 48C223 48 232 60 232 60"
                    stroke="#D4AF37"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                  />

                  {/* ── NOSE PADS ── */}
                  <motion.path d="M180 88C180 88 184 100 183 112" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.8 }} />
                  <motion.path d="M240 88C240 88 236 100 237 112" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.8 }} />

                  {/* ── LEFT TEMPLE ── */}
                  <motion.path
                    d="M55 60L8 54C4 53.5 1 54 1 56"
                    stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
                  />
                  {/* ── RIGHT TEMPLE ── */}
                  <motion.path
                    d="M348 60L395 54C399 53.5 419 54 419 56"
                    stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 1.6, duration: 1, ease: 'easeOut' }}
                  />

                  {/* ── LEFT LENS GLASS ── */}
                  <motion.path
                    d="M65 68C65 46 80 35 108 35H145C165 35 178 46 178 68V88C178 106 168 128 145 128H105C80 128 65 108 65 88V68Z"
                    fill="url(#lensGradL)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.12, 0.08, 0.15] }}
                    transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
                  />
                  {/* ── RIGHT LENS GLASS ── */}
                  <motion.path
                    d="M240 68C240 46 250 35 268 35H300C322 35 340 46 340 68V88C340 106 330 128 308 128H268C248 128 240 108 240 88V68Z"
                    fill="url(#lensGradR)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.10, 0.06, 0.12] }}
                    transition={{ delay: 2, duration: 2, repeat: Infinity }}
                  />

                  {/* ── LENS REFLECTIONS (scanning highlight) ── */}
                  <motion.ellipse
                    initial={{ cx: 120, opacity: 0.02 }}
                    cx="120" cy="72" rx="30" ry="18"
                    fill="white"
                    animate={{ cx: [100, 140, 100], opacity: [0.02, 0.06, 0.02] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.ellipse
                    initial={{ cx: 290, opacity: 0.02 }}
                    cx="290" cy="72" rx="28" ry="16"
                    fill="white"
                    animate={{ cx: [270, 310, 270], opacity: [0.02, 0.05, 0.02] }}
                    transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* ── DEFS ── */}
                  <defs>
                    <linearGradient id="lensGradL" x1="65" y1="35" x2="178" y2="128" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                      <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="lensGradR" x1="240" y1="35" x2="340" y2="128" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#2ABFAF" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* ── LENS SHINE SWEEP ── */}
              <motion.div
                initial={{ x: '-200%', skewX: -30 }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none"
              />
            </motion.div>

            {/* ── BRANDING ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, filter: 'blur(12px)', transition: { duration: 0.5 } }}
              transition={{ delay: 1.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 flex flex-col items-center"
            >
              <motion.h1
                initial={{ letterSpacing: '1.2em', opacity: 0 }}
                animate={{ letterSpacing: '0.45em', opacity: 1 }}
                transition={{ delay: 1.4, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl font-serif text-gold font-light leading-none"
              >
                EYELOVEYOU
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 180 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="flex items-center mt-5 gap-4"
              >
                <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gold/25" />
                <span className="text-[10px] text-teal/70 tracking-ultra uppercase font-mono whitespace-nowrap">EST. 1987</span>
                <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gold/25" />
              </motion.div>
            </motion.div>

            {/* ── PROGRESS SYSTEM ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-14 flex flex-col items-center gap-4 w-64"
            >
              {/* Phase label */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-mono tracking-[0.35em] text-gold/50 uppercase"
                >
                  {PHASES[phase]?.label}
                </motion.span>
              </AnimatePresence>

              {/* Progress track */}
              <div className="w-full h-[2px] bg-white/[0.04] rounded-full overflow-hidden relative">
                <motion.div
                  style={{ width: progressPercent }}
                  className="h-full rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />
                  {/* Glow at leading edge */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold rounded-full blur-md opacity-60" />
                </motion.div>
              </div>

              {/* Percentage & markers */}
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-1.5">
                  {PHASES.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                        i <= phase ? 'bg-gold' : 'bg-white/10'
                      }`}
                      animate={i === phase ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-gold/40 tabular-nums">
                  {progress}%
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── OPTIC VIGNETTE ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, transparent 20%, rgba(3,5,8,0.7) 55%, #030508 85%)',
            }}
          />

          {/* ── CORNER FIDUCIALS ── */}
          <div className="absolute inset-0 pointer-events-none z-30 p-8 md:p-14">
            {/* Top-left */}
            <div className="absolute top-8 left-8 md:top-14 md:left-14">
              <div className="w-6 h-6 border-t border-l border-gold/20" />
              <span className="block mt-2 text-[7px] font-mono text-gold/15 tracking-[0.3em]">V4.OPTIC</span>
            </div>
            {/* Top-right */}
            <div className="absolute top-8 right-8 md:top-14 md:right-14">
              <div className="w-6 h-6 border-t border-r border-gold/20 ml-auto" />
            </div>
            {/* Bottom-left */}
            <div className="absolute bottom-8 left-8 md:bottom-14 md:left-14">
              <div className="w-6 h-6 border-b border-l border-gold/20" />
            </div>
            {/* Bottom-right */}
            <div className="absolute bottom-8 right-8 md:bottom-14 md:right-14 text-right">
              <span className="block mb-2 text-[7px] font-mono text-gold/15 tracking-[0.3em]">PUNJAB OP.</span>
              <div className="w-6 h-6 border-b border-r border-gold/20 ml-auto" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}