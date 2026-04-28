'use client';
import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsLight(false);
      document.body.classList.add('dark-mode');
    } else {
      setIsLight(true);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = async () => {
    await controls.start({
      y: 90,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    });

    const newIsLight = !isLight;
    setIsLight(newIsLight);

    if (newIsLight) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }

    await controls.start({
      y: 0,
      rotate: [0, 5, -3, 1.5, 0],
      transition: {
        y: { type: "spring", stiffness: 500, damping: 12, mass: 1.2 },
        rotate: { duration: 2, ease: "easeOut" }
      }
    });
  };

  return (
    <div className="fixed top-0 right-12 z-[100] pointer-events-none hidden md:flex flex-col items-center">

      {/* Ceiling cap */}
      <div className="w-6 h-1.5 rounded-b-md bg-gradient-to-b from-[#2a2a2a] to-[#111] border-x border-b border-white/10 z-10" />

      <motion.div
        animate={controls}
        className="flex flex-col items-center pointer-events-auto cursor-pointer group"
        onClick={toggleTheme}
        style={{ transformOrigin: 'top center' }}
      >
        {/* Chain */}
        <div className="flex flex-col items-center gap-[2px]">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="w-[5px] h-[5px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #e8c94a, #8B6E2D 70%, #5a4515)',
                boxShadow: '0 1px 1px rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </div>

        {/* Socket */}
        <div className="w-[22px] h-[16px] -mt-[2px] relative z-20 rounded-t-[3px] overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #6b5520, #d4af37 30%, #e8c94a 50%, #d4af37 70%, #6b5520)',
          }}
        >
          <div className="absolute top-[3px] w-full h-[1px] bg-black/25" />
          <div className="absolute top-[7px] w-full h-[1px] bg-black/25" />
          <div className="absolute top-[11px] w-full h-[1px] bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent h-1/3" />
        </div>

        {/* Bulb */}
        <div className="relative -mt-[1px] flex items-center justify-center">
          {/* SVG Bulb Shape */}
          <svg width="44" height="56" viewBox="0 0 44 56" fill="none" className="relative z-10">
            {/* Glass body */}
            <path
              d="M11 2 C11 2, 11 0, 22 0 C33 0, 33 2, 33 2 L34 8 C38 16, 42 22, 42 32 C42 44, 34 54, 22 54 C10 54, 2 44, 2 32 C2 22, 6 16, 10 8 Z"
              fill={isLight ? 'rgba(255, 245, 220, 0.12)' : 'rgba(255, 255, 255, 0.04)'}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.5"
            />
            {/* Glass highlight streak */}
            <path
              d="M13 8 Q14 20, 12 36 Q11 42, 14 46"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="14" cy="44" r="1.5" fill="rgba(255,255,255,0.12)" />
          </svg>

          {/* Filament inside bulb */}
          <div className="absolute inset-0 flex items-center justify-center z-20" style={{ paddingTop: '6px' }}>
            <div className="relative w-[16px] h-[32px]">
              {/* Two vertical support wires */}
              <div className="absolute left-[5px] top-0 w-[1px] h-full bg-white/10" />
              <div className="absolute right-[5px] top-0 w-[1px] h-full bg-white/10" />

              {/* Zigzag filament */}
              <motion.svg
                viewBox="0 0 16 32"
                className="absolute inset-0 w-full h-full"
                fill="none"
              >
                <motion.path
                  d="M5 4 L11 8 L5 12 L11 16 L5 20 L11 24 L5 28"
                  stroke={isLight ? '#FFD700' : '#555'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    stroke: isLight ? '#FFD700' : '#555',
                    filter: isLight ? 'drop-shadow(0 0 4px #FFA500) drop-shadow(0 0 8px #FFD700)' : 'none',
                  }}
                />
              </motion.svg>

              {/* Core glow */}
              <AnimatePresence>
                {isLight && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-[#FFA500] blur-[10px] rounded-full"
                    style={{ margin: '4px -2px' }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ambient glow around bulb */}
          <AnimatePresence>
            {isLight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-[-30px] rounded-full pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(255,180,50,0.15) 0%, rgba(255,180,50,0.05) 50%, transparent 70%)',
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Hover label */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-[7px] font-mono tracking-[0.3em] text-gold/50 uppercase whitespace-nowrap">
            {isLight ? 'NIGHT' : 'DAY'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
