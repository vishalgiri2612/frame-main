'use client';

import { motion, AnimatePresence } from'framer-motion';

import { useEffect, useState } from'react';

exportdefaultfunctionSpecFrameLoader() {

  const [isVisible, setIsVisible] =useState(true);

  const [isMounted, setIsMounted] =useState(false);

  useEffect(() => {

    setIsMounted(true);

    // Extended the loading time slightly for the more complex animation

    consttimer=setTimeout(() =>setIsVisible(false), 3000);

    return () =>clearTimeout(timer);

  }, []);

  return (

    `<AnimatePresence>`

    {isVisible && (

    <motion.div

    initial={{ opacity:1 }}

    exit={{

    opacity:0,

    transition: { duration:1.2, ease: [0.7, 0, 0.3, 1], delay:0.2 }

    }}

    className="fixed inset-0 bg-[#05080a] z-[100] flex items-center justify-center flex-col overflow-hidden"

    >

    {/* Main Content Container */}

    <motion.div

    variants={{

    initial: { opacity:0 },

    animate: { opacity:1 },

    exit: {

    scale:65,

    x:"20%", // Accurate shift to center the left lens (at 30% width)

    opacity:1, // Keep visible during zoom for "passing through" look

    transition: {

    duration:2.2,

    ease: [0.7, 0, 0.2, 1], // Custom cinematic bezier

    opacity: { duration:1.2, delay:1 } // Fade out frame late in zoom

    }

    }

    }}

    initial="initial"

    animate="animate"

    exit="exit"

    style={{

    transformOrigin:"30% 50%", // Perfectly centered on left lens

    }}

    className="relative flex flex-col items-center justify-center w-full h-full"

    >

    {/* The Specs Silhouette - Full Frame Dual Lens */}

    <motion.div

    initial={{ scale:0.85, opacity:0, filter:'blur(15px)' }}

    animate={{ scale:1, opacity:1, filter:'blur(0px)' }}

    transition={{ duration:1.8, ease: [0.16, 1, 0.3, 1] }}

    className="relative"

    >

    <svg

    width="400"

    height="160"

    viewBox="0 0 400 160"

    fill="none"

    xmlns="http://www.w3.org/2000/svg"

    className="text-gold"

    >

    {/* Refined Frame with subtle variations in thickness */}

    {/* Left Rim (Primary zoom target) */}

    <path

    d="M60 60C60 38 78 28 110 28H150C172 28 182 45 182 70V90C182 115 162 132 135 132H100C72 132 60 115 60 90V60Z"

    stroke="currentColor"

    strokeWidth="2"

    className="drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"

    />

    {/* Right Rim */}

    <path

    d="M218 70C218 45 228 28 250 28H290C322 28 340 38 340 60V90C340 115 328 132 300 132H265C238 132 218 115 218 90V70Z"

    stroke="currentColor"

    strokeWidth="2"

    className="drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"

    />

    {/* Precision Bridge - More sculpted look */}

    <path

    d="M182 65C182 65 190 52 200 52C210 52 218 65 218 65"

    stroke="currentColor"

    strokeWidth="1.8"

    strokeLinecap="round"

    />

    {/* Hand-crafted Nose Pads */}

    <pathd="M174 85C174 85 178 95 178 105"stroke="currentColor"strokeWidth="0.8"opacity="0.6"/>

    <pathd="M226 85C226 85 222 95 222 105"stroke="currentColor"strokeWidth="0.8"opacity="0.6"/>

    {/* Glass Lenses - Enhanced with better gradients */}

    <motion.path

    initial={{ opacity:0 }}

    animate={{ opacity:0.15 }}

    transition={{ delay:1, duration:1.2 }}

    d="M70 70C70 48 85 38 110 38H140C162 38 172 48 172 70V90C172 108 162 122 140 122H100C78 122 70 108 70 90V70Z"

    fill="url(#lensGradient)"

    />

    <motion.path

    initial={{ opacity:0 }}

    animate={{ opacity:0.15 }}

    transition={{ delay:1.2, duration:1.2 }}

    d="M228 70C228 48 238 38 260 38H290C315 38 330 48 330 70V90C330 108 320 122 300 122H260C238 122 228 108 228 90V70Z"

    fill="url(#lensGradient)"

    />

    `<defs>`

    <linearGradientid="lensGradient"x1="0%"y1="0%"x2="100%"y2="100%">

    <stopoffset="0%"stopColor="white"stopOpacity="0.4"/>

    <stopoffset="50%"stopColor="white"stopOpacity="0.1"/>

    <stopoffset="100%"stopColor="white"stopOpacity="0.3"/>

    `</linearGradient>`

    `</defs>`

    {/* Temples - Tapered for realism */}

    <pathd="M60 65L0 60"stroke="currentColor"strokeWidth="1.5"strokeLinecap="round"opacity="0.8"/>

    <pathd="M340 65L400 60"stroke="currentColor"strokeWidth="1.5"strokeLinecap="round"opacity="0.8"/>

    `</svg>`

    {/* Dynamic Shine Animation */}

    <motion.div

    initial={{ x:"-150%", skewX: -25 }}

    animate={{ x:"150%" }}

    transition={{

    duration:2.8,

    repeat:Infinity,

    repeatDelay:1.2,

    ease:"easeInOut"

    }}

    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none"

    />

    </motion.div>

    {/* Branding - More elegant reveal */}

    <motion.div

    initial={{ opacity:0, y:20, letterSpacing:"1em" }}

    animate={{ opacity:1, y:0, letterSpacing:"0.5em" }}

    exit={{

    opacity:0,

    scale:0.9,

    filter:"blur(10px)",

    transition: { duration:0.7, ease:"easeIn" }

    }}

    transition={{ delay:0.6, duration:1.2, ease: [0.16, 1, 0.3, 1] }}

    className="mt-16 flex flex-col items-center"

    >

    <h1className="text-4xl md:text-5xl font-serif text-gold tracking-luxury font-light leading-none">

    EYELOVEYOU

    `</h1>`

    <divclassName="flex items-center mt-6 space-x-6">

    <spanclassName="h-[1px] w-12 bg-gold/20"/>

    <spanclassName="text-[11px] text-teal/80 tracking-ultra uppercase font-medium">EST. 1987

    <spanclassName="h-[1px] w-12 bg-gold/20"/>

    `</div>`

    </motion.div>

    </motion.div>

    {/* Centered Optic Reveal Mask - Perfectly aligned with pass-through target */}

    <motion.div

    initial={{ opacity:0, scale:0.8 }}

    exit={{

    opacity:1,

    scale:4,

    transition: { duration:1.8, ease: [0.7, 0, 0.2, 1] }

    }}

    className="absolute inset-0 z-[110] pointer-events-none"

    style={{

    background:"radial-gradient(circle at 30% 50%, transparent 5%, rgba(5,8,10,0.85) 45%, #05080a 75%)"

    }}

    />

    {/* Particle background - More subtle and floaty */}

    <divclassName="absolute inset-0 z-[-1] opacity-30">

    {isMounted && [...Array(35)].map((_, i) => (

    <motion.div

    key={i}

    initial={{

    x:Math.random() * 100 + "%",

    y:Math.random() * 100 + "%",

    opacity:0,

    scale:Math.random() * 0.5 + 0.5

    }}

    animate={{

    y: [null, (Math.random() - 0.5) * 100 + "px"],

    opacity: [0, 0.6, 0]

    }}

    transition={{

    duration:4 + Math.random() * 4,

    repeat:Infinity,

    delay:Math.random() * 5

    }}

    className="absolute w-1 h-1 bg-gold/40 rounded-full blur-[1px]"

    />

    ))}

    `</div>`

    {/* Progress Indicator - Minimal and premium */}

    <motion.div

    initial={{ opacity:0 }}

    animate={{ opacity:1 }}

    exit={{ opacity:0, transition: { duration:0.3 } }}

    className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"

    >

    <divclassName="w-40 h-[1.5px] bg-gold/10 overflow-hidden rounded-full">

    <motion.div

    initial={{ x:"-100%" }}

    animate={{ x:"0%" }}

    transition={{ duration:2.8, ease:"easeInOut" }}

    className="h-full bg-gradient-to-r from-transparent via-gold to-transparent w-full"

    />

    `</div>`

    <spanclassName="text-[9px] text-gold/30 tracking-[0.3em] uppercase">Focusing Optics

    </motion.div>

    </motion.div>

    )}

    `</AnimatePresence>`

  );

}
