'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

export default function LensMachineDemo() {
  const [spherePower, setSpherePower] = useState(0);
  const [axis, setAxis] = useState(90);
  const [tint, setTint] = useState('clear');
  const [activeLens, setActiveLens] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Advanced Animation Springs for Mechanical Feel
  const springSphere = useSpring(0, { stiffness: 100, damping: 20 });
  const springAxis = useSpring(90, { stiffness: 80, damping: 15 });

  useEffect(() => {
    springSphere.set(spherePower);
    springAxis.set(axis);
  }, [spherePower, axis, springSphere, springAxis]);

  // Derived Advanced Optical Effects
  const chromaticAberration = useTransform(springSphere, (v) => Math.abs(v) * 1.2);
  const distortion = useTransform(springSphere, (v) => 1 + (v * 0.015));
  const gearRotation = useTransform(springAxis, (v) => v * 2);

  const lensConfigs = {
    1: { id: 'ZEISS-87', label: 'Primary', sphere: 0, axis: 90, tint: 'clear' },
    2: { id: 'ESS-BLUE', label: 'Secondary', sphere: -2.25, axis: 120, tint: 'night' },
    3: { id: 'NIK-GLD', label: 'Auxiliary', sphere: 1.5, axis: 45, tint: 'amber' }
  };

  const handleLensToggle = (id) => {
    if (activeLens === id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const config = lensConfigs[id];
      setSpherePower(config.sphere);
      setAxis(config.axis);
      setTint(config.tint);
      setActiveLens(id);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center scale-90 md:scale-100 transition-transform origin-top">
      {/* 1. ADVANCED: Precision Header with Data Stream */}
      <div className="w-full max-w-2xl flex justify-between items-end mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-teal uppercase tracking-[0.5em] font-bold mb-1">Optical Engine v4.0</span>
          <h3 className="text-gold font-serif text-2xl italic tracking-widest leading-none">&quot;Precision Clarity Check&quot;</h3>
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-gold/40">
          <div className="flex flex-col"><span>V.ACUITY</span><span className="text-gold">20/20</span></div>
          <div className="flex flex-col"><span>DIOPTER</span><span className="text-gold">{spherePower.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="relative mb-8">
        {/* 2. ADVANCED: Mechanical Background Gears (Responding to Axis) */}
        <div className="absolute inset-[-40px] z-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div style={{ rotate: gearRotation }} className="absolute -top-10 -left-10 text-gold/20">
            <GearIcon size={120} teeth={24} />
          </motion.div>
          <motion.div style={{ rotate: useTransform(gearRotation, v => -v * 1.5) }} className="absolute -bottom-20 -right-20 text-gold/20">
            <GearIcon size={200} teeth={36} />
          </motion.div>
        </div>

        {/* The Machine Body */}
        <div className="relative p-6 rounded-full bg-[#080a12] border border-gold/10 shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(212,175,55,0.05)] z-10">

          {/* Mechanical Axis Ring */}
          <motion.div
            style={{ rotate: springAxis }}
            className="absolute inset-1 border-[1px] border-gold/20 rounded-full"
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-gold/40"
                style={{ transformOrigin: '0 180px', transform: `rotate(${i * 30}deg)` }}
              />
            ))}
          </motion.div>

          {/* 3. ADVANCED: Main Lens with Distortion & Chromatic Aberration */}
          <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-[12px] border-[#05070a] shadow-inner z-20 group">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeLens}
                initial={{ opacity: 0, filter: 'blur(30px)' }}
                animate={{
                  opacity: 1,
                  filter: isTransitioning ? 'blur(30px)' : `blur(${Math.abs(spherePower) * 2}px)`,
                }}
                exit={{ opacity: 0, filter: 'blur(30px)' }}
                className="relative w-full h-full bg-black flex items-center justify-center"
              >
                {/* ADVANCED: Layered Distortion Scene */}
                <motion.div
                  style={{
                    scale: distortion,
                    filter: tint === 'amber' ? 'sepia(0.5)' : tint === 'night' ? 'hue-rotate(200deg) brightness(1.2)' : 'none'
                  }}
                  className="absolute inset-0 transition-all duration-700"
                >
                  {/* Chromatic Aberration Layers */}
                  <motion.div
                    style={{ 
                      x: useTransform(chromaticAberration, v => -v), 
                      opacity: 0.5,
                      backgroundImage: 'url("/house.png")', 
                      filter: 'contrast(1.2) brightness(0.9) hue-rotate(10deg)' 
                    }}
                    className="absolute inset-0 bg-cover bg-center blend-screen"
                  />
                  <motion.div
                    style={{ 
                      x: chromaticAberration, 
                      opacity: 0.5,
                      backgroundImage: 'url("/house.png")', 
                      filter: 'contrast(1.2) brightness(0.9) hue-rotate(-10deg)' 
                    }}
                    className="absolute inset-0 bg-cover bg-center blend-screen"
                  />
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/house.png")' }} />
                </motion.div>

                {/* HUD Elements */}
                <div className="relative z-30 flex flex-col items-center pointer-events-none">
                  <span className="text-[12rem] font-serif text-white/20 select-none mix-blend-overlay italic">E</span>
                  {/* Digital Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-40 h-[1px] bg-gold/50" />
                    <div className="w-[1px] h-40 bg-gold/50" />
                    <div className="absolute w-24 h-24 border border-gold/30 rounded-full border-dashed" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Lens Glare Overlay */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-tr from-white/10 via-transparent to-white/10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-[40px] border-black/80 rounded-full z-50 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,1)' }}
            />
          </div>
        </div>
      </div>

      {/* 4. ADVANCED: Technical Control Interface */}
      <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Module Switching */}
        <div className="md:col-span-3 flex justify-center gap-3 mb-4">
          {Object.entries(lensConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleLensToggle(parseInt(key))}
              className={`px-6 py-3 rounded-xl border flex flex-col items-start min-w-[120px] transition-all ${activeLens === parseInt(key) ? 'bg-gold border-gold text-navy shadow-[0_0_20px_rgba(201,168,76,0.3)]' : 'bg-gold/5 border-gold/10 text-gold/60 hover:text-gold hover:bg-gold/10'
                }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">{config.id}</span>
              <span className="text-[13px] font-serif italic">{config.label}</span>
            </button>
          ))}
        </div>

        {/* Sphere Dial */}
        <div className="bg-navy-deep/80 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase tracking-widest text-teal font-bold">SPH (Diopter)</span>
            <span className="font-mono text-gold text-2xl">{spherePower > 0 ? '+' : ''}{spherePower.toFixed(2)}</span>
          </div>
          <input
            type="range" min="-6" max="6" step="0.25" value={spherePower}
            onChange={(e) => setSpherePower(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-gold cursor-pointer"
          />
        </div>

        {/* Axis Dial */}
        <div className="bg-navy-deep/80 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase tracking-widest text-teal font-bold">AXIS (Deg)</span>
            <span className="font-mono text-gold text-2xl">{axis}°</span>
          </div>
          <input
            type="range" min="0" max="180" step="1" value={axis}
            onChange={(e) => setAxis(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-gold cursor-pointer"
          />
        </div>

        {/* Coating/Tint Settings */}
        <div className="bg-navy-deep/80 p-4 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-teal font-bold block mb-4">Coatings</span>
          <div className="flex justify-between">
            {['clear', 'amber', 'night'].map((t) => (
              <button
                key={t} onClick={() => setTint(t)}
                className={`flex flex-col items-center gap-2 p-1 rounded-md transition-all ${tint === t ? 'scale-110' : 'opacity-30 hover:opacity-100'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border border-white/20 ${t === 'clear' ? 'bg-white/10' : t === 'amber' ? 'bg-gold/40' : 'bg-teal/40'
                  }`} />
                <span className="text-[9px] uppercase font-bold text-cream tracking-wider">{t}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Advanced Gear Graphic Component
function GearIcon({ size, teeth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
      <path d={`M50 20 A30 30 0 1 1 50 80 A30 30 0 1 1 50 20 M50 35 A15 15 0 1 0 50 65 A15 15 0 1 0 50 35`} fillRule="evenodd" opacity="0.4" />
      {[...Array(teeth)].map((_, i) => (
        <rect
          key={i}
          x="46" y="10" width="8" height="15"
          transform={`rotate(${(360 / teeth) * i} 50 50)`}
          rx="1"
        />
      ))}
    </svg>
  );
}



