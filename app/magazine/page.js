'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/* ── HELPER COMPONENTS ── */
/* All colors inside the book are HARDCODED — the book is a physical object. */

const BookImage = ({ src, alt, caption }) => (
  <div className="w-full h-full relative flex flex-col justify-end p-8 overflow-hidden group bg-[#111]">
    <Image src={src} alt={alt} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]" sizes="50vw" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    <div className="relative z-10">
      <span className="font-mono text-[8px] tracking-[0.2em] text-[#C9A84C] uppercase">{caption}</span>
      <h3 className="text-xl font-light text-[#F7F4EF] tracking-widest mt-2">{alt}</h3>
    </div>
  </div>
);

const Paper = ({ children, className = '' }) => (
  <div className={`w-full h-full flex flex-col pt-14 px-14 pb-10 bg-[#F9F7F1] text-[#0A0E1A] relative ${className}`}>
    {children}
  </div>
);

/* ── BOOK SHEETS ── */
const SHEETS = [
  // COVER
  {
    id: 'cover',
    front: (
      <div className="w-full h-full relative overflow-hidden">
        <Image src="/magazine/cover.png" alt="Journal of Sight" fill className="object-cover" sizes="50vw" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    ),
    back: (
      <div className="w-full h-full p-14 flex flex-col justify-center bg-[#12182B]">
        <h2 className="font-serif italic text-3xl text-[#C9A84C] mb-8">Colophon</h2>
        <p className="font-mono text-[9px] tracking-[0.1em] leading-loose max-w-[260px] text-[#F7F4EF]/70">
          Published by VISIO, Punjab.<br/><br/>
          Creative Direction: A. Vasquez.<br/>
          Photography: Studio Sterling.<br/>
          Typefaces: Cormorant Garamond, Inter Mono.<br/><br/>
          Printed on archival grade 120gsm matte.<br/>
          Limited Edition of 500.
        </p>
        <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#F7F4EF]/20">ii</div>
      </div>
    )
  },

  // MANIFESTO SPREAD
  {
    id: 'manifesto',
    front: (
      <div className="w-full h-full relative overflow-hidden bg-[#0A0E1A]">
        <Image src="/magazine/editorial.png" alt="See the Unseen" fill className="object-cover opacity-30 grayscale" sizes="50vw" />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
          <h2 className="text-6xl font-black text-[#D4AF37] italic leading-[0.85] tracking-tighter uppercase" style={{ textShadow: '0 0 40px rgba(0,0,0,0.6)' }}>
            SEE <br/> THE <br/> UNSEEN.
          </h2>
        </div>
        <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#F7F4EF]/20">1</div>
      </div>
    ),
    back: (
      <div className="w-full h-full relative overflow-hidden bg-[#12182B]">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-5xl font-black text-[#D4AF37] leading-[0.9] tracking-tighter mb-6 uppercase" style={{ textShadow: '0 0 40px rgba(0,0,0,0.6)' }}>
            CRAFTING <br /> LEGENDS.
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mb-6" />
          <p className="font-mono text-[9px] text-[#F7F4EF]/40 tracking-[0.3em] uppercase">The Visio Creed / Edition IV</p>
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[8px] text-[#F7F4EF]/20">2</div>
      </div>
    )
  },

  // FOREWORD
  {
    id: 'intro',
    front: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#337E77] uppercase">00 / Foreword</span>
          <h2 className="text-4xl font-serif italic mt-8 mb-8 text-[#0A0E1A]">Vision as Architecture.</h2>
          <p className="text-[11px] font-sans font-light leading-relaxed max-w-sm text-[#0A0E1A]/70 columns-2 gap-8 text-justify">
            Eyewear is the ultimate intersection of medical necessity and aesthetic expression. It is the only architectural structure worn directly on the face. In this volume, we pull apart the seams of our manufacturing process. We look closely at the raw elements—titanium, Japanese acetate, 18k gold—and the hands that shape them.
          </p>
        </div>
        <div className="self-end font-mono text-[8px] text-[#0A0E1A]/30">1</div>
      </Paper>
    ),
    back: (
      <BookImage src="/magazine/editorial.png" alt="THE FOUNDRY" caption="Fig 1. Master Optician at Work" />
    )
  },

  // TITANIUM
  {
    id: 'titanium',
    front: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#337E77] uppercase">01 / Material Science</span>
          <h2 className="text-5xl font-light tracking-tight mt-6 mb-10 text-[#0A0E1A]">THE TITANIUM <br/> REVOLUTION</h2>
          <div className="w-full h-px bg-[#0A0E1A]/10 mb-10" />
          <ul className="space-y-6 font-mono text-[9px] tracking-[0.1em] text-[#0A0E1A]/60">
            <li className="flex justify-between border-b border-[#0A0E1A]/5 pb-2">
              <span>TENSILE STRENGTH</span> <span>834 MPa</span>
            </li>
            <li className="flex justify-between border-b border-[#0A0E1A]/5 pb-2">
              <span>MASS</span> <span>18.4 GRAMS</span>
            </li>
            <li className="flex justify-between border-b border-[#0A0E1A]/5 pb-2">
              <span>ALLOY</span> <span>BETA-TI 15-3-3-3</span>
            </li>
            <li className="flex justify-between border-b border-[#0A0E1A]/5 pb-2">
              <span>HYPOALLERGENIC</span> <span>100% CERTIFIED</span>
            </li>
          </ul>
        </div>
        <div className="self-end font-mono text-[8px] text-[#0A0E1A]/30">3</div>
      </Paper>
    ),
    back: (
      <Paper className="justify-center items-center">
        <h2 className="text-8xl font-serif italic text-[#0A0E1A]/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap -rotate-90">
          AEROSPACE
        </h2>
        <div className="z-10 bg-[#0A0E1A] p-12 text-center text-[#F7F4EF] shadow-2xl relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#C9A84C]" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#C9A84C]" />
          <p className="font-serif italic text-2xl text-[#C9A84C] mb-4">&quot;Weightless presence.&quot;</p>
          <p className="font-mono text-[8px] tracking-[0.2em] text-[#F7F4EF]/60">TITANIUM FORGE / OSAKA, JP</p>
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[8px] text-[#0A0E1A]/30">4</div>
      </Paper>
    )
  },

  // ACETATE
  {
    id: 'acetate',
    front: (
      <BookImage src="/magazine/craftsmanship.png" alt="TARTARUGATO" caption="Fig 2. Italian Acetate Polishing" />
    ),
    back: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#C9A84C] uppercase">02 / Craftsmanship</span>
          <h2 className="text-4xl font-serif italic mt-8 mb-8 text-[#0A0E1A]">The Cellulose Cellar.</h2>
          <p className="text-[11px] font-sans font-light leading-relaxed max-w-sm text-[#0A0E1A]/70 text-justify">
            We cure our acetate for over 90 days. This slow-aging process allows the cotton-based polymer to settle, preventing warping over years of wear. The patterns are not printed; they are physically embedded through layers of colored sheets, resulting in a depth of tortoiseshell that cannot be counterfeited by injection molding.
          </p>
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[8px] text-[#0A0E1A]/30">6</div>
      </Paper>
    )
  },

  // LENS TECH
  {
    id: 'lenses',
    front: (
      <Paper className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_top_right,rgba(42,191,175,0.08),transparent_50%)] pointer-events-none" />
        <div className="flex-1 relative z-10">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#337E77] uppercase">03 / Optic Engineering</span>
          <h2 className="text-5xl font-light tracking-tight mt-6 mb-8 text-[#0A0E1A]">CLARITY <br/> DEFINED.</h2>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="p-4 border border-[#0A0E1A]/10">
              <span className="block font-mono text-[24px] text-[#0A0E1A] mb-1">V.400</span>
              <span className="font-mono text-[7px] tracking-widest text-[#0A0E1A]/40">UV BLOCKING</span>
            </div>
            <div className="p-4 border border-[#0A0E1A]/10">
              <span className="block font-mono text-[24px] text-[#0A0E1A] mb-1">AR-7</span>
              <span className="font-mono text-[7px] tracking-widest text-[#0A0E1A]/40">ANTI-REFLECTIVE</span>
            </div>
            <div className="p-4 border border-[#0A0E1A]/10">
              <span className="block font-mono text-[24px] text-[#0A0E1A] mb-1">99%</span>
              <span className="font-mono text-[7px] tracking-widest text-[#0A0E1A]/40">POLARIZED EFFICIENCY</span>
            </div>
            <div className="p-4 border border-[#0A0E1A]/10 bg-[#0A0E1A]">
              <span className="block font-mono text-[24px] text-[#C9A84C] mb-1">ZEISS</span>
              <span className="font-mono text-[7px] tracking-widest text-[#F7F4EF]/50">LENS PARTNER</span>
            </div>
          </div>
        </div>
        <div className="self-end font-mono text-[8px] text-[#0A0E1A]/30 relative z-10">7</div>
      </Paper>
    ),
    back: (
      <BookImage
        src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800"
        alt="LIGHT REFRACTION"
        caption="Fig 3. AR-7 Coating Test"
      />
    )
  },

  // INTERVIEW
  {
    id: 'interview',
    front: (
      <div className="w-full h-full p-14 flex flex-col justify-center items-center bg-[#0A0E1A]">
        <div className="text-center space-y-6 max-w-md">
          <span className="font-mono text-[8px] tracking-[0.3em] text-[#C9A84C] uppercase block">PERSPECTIVES</span>
          <h2 className="text-4xl md:text-5xl font-serif italic leading-tight text-white">
            &quot;We do not sell frames. We engineer ways to see the world completely unimpeded.&quot;
          </h2>
          <div className="w-8 h-px bg-[#C9A84C]/50 mx-auto" />
          <span className="font-mono text-[9px] tracking-widest text-[#F7F4EF]/40 uppercase block">The Founder&apos;s Dialogue</span>
        </div>
        <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#F7F4EF]/20">9</div>
      </div>
    ),
    back: (
      <Paper>
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-[8px] font-bold text-[#0A0E1A]">VISIO:</span>
            <p className="text-[10px] font-sans text-[#0A0E1A]/70 text-justify">Why restrict production to 500 units per collection?</p>
          </div>
          <div className="space-y-2 pl-4 border-l-2 border-[#C9A84C]/50">
            <span className="font-mono text-[8px] font-bold text-[#C9A84C]">FD:</span>
            <p className="text-[10px] font-sans text-[#0A0E1A]/70 text-justify">Because excellence does not scale indefinitely. When you push beyond 500 units, handmade processes turn into mechanical habits. We refuse to let machines dictate the polish of our acetate.</p>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[8px] font-bold text-[#0A0E1A]">VISIO:</span>
            <p className="text-[10px] font-sans text-[#0A0E1A]/70 text-justify">What makes the &quot;Architect&quot; series functionally different?</p>
          </div>
          <div className="space-y-2 pl-4 border-l-2 border-[#C9A84C]/50">
            <span className="font-mono text-[8px] font-bold text-[#C9A84C]">FD:</span>
            <p className="text-[10px] font-sans text-[#0A0E1A]/70 text-justify">We eliminated screws. Using a pure tension hinge system inspired by suspension bridges, the frame dynamically adapts to temporal lobes without loosening over time. It&apos;s living engineering.</p>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[8px] text-[#0A0E1A]/30">10</div>
      </Paper>
    )
  },

  // FIN
  {
    id: 'fin',
    front: (
      <Paper className="items-center justify-center text-center">
        <h2 className="font-serif text-5xl italic text-[#C9A84C] mb-12">Fin.</h2>
        <p className="font-mono text-[8px] tracking-[0.2em] text-[#0A0E1A]/40 max-w-[200px] mb-8">
          Explore the full curated collection physically at our flagship or via our digital portal.
        </p>
        <button className="border border-[#C9A84C] text-[#C9A84C] px-10 py-4 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0E1A] transition-colors duration-500">
          ENTER STORE
        </button>
        <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#0A0E1A]/30">11</div>
      </Paper>
    ),
    back: (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0E1A] relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <span className="text-4xl font-serif text-[#C9A84C] tracking-[0.3em] font-light leading-none relative z-10">
          VISIO
        </span>
      </div>
    )
  }
];

export default function MagazinePage() {
  const [currentFlip, setCurrentFlip] = useState(0);
  const totalPages = SHEETS.length * 2;

  const turnNext = () => {
    setCurrentFlip(c => (c < SHEETS.length ? c + 1 : c));
  };

  const turnPrev = () => {
    setCurrentFlip(c => (c > 0 ? c - 1 : c));
  };

  useEffect(() => {
    let lastTime = 0;
    let touchStartY = 0;
    
    const handleWheel = (e) => {
      const now = Date.now();
      if (now - lastTime < 1000) return;
      
      const scrollThreshold = 15; // Fairly sensitive
      if (Math.abs(e.deltaY) > scrollThreshold) {
         if (e.deltaY > 0) setCurrentFlip(c => (c < SHEETS.length ? c + 1 : c));
         else setCurrentFlip(c => (c > 0 ? c - 1 : c));
         lastTime = now;
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 1000) return;
      
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > 30) {
         if (deltaY > 0) setCurrentFlip(c => (c < SHEETS.length ? c + 1 : c));
         else setCurrentFlip(c => (c > 0 ? c - 1 : c));
         lastTime = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="h-[100dvh] pt-24 lg:pt-32 pb-8 flex flex-col items-center overflow-hidden relative"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[60vw] h-[60vw] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_50%)] rounded-full blur-[80px]" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-6 lg:mb-8 relative z-10 px-6 shrink-0">
        <div className="flex items-center justify-center gap-4 mb-2 lg:mb-4">
          <div className="w-10 h-px bg-gold/30" />
          <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-gold/50">The Lookbook</span>
          <div className="w-10 h-px bg-gold/30" />
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-cream tracking-tight">
          Editorial Archives
        </h1>
        <p className="hidden md:block text-cream/30 text-xs lg:text-sm mt-2 max-w-md mx-auto">
          A curated journal exploring the craft, science, and art behind luxury eyewear.
        </p>
      </div>

      {/* ── THE BOOK ── */}
      <div
        className="relative w-full flex-1 min-h-0 z-10 flex items-center justify-center px-2 sm:px-6"
        style={{ perspective: '3000px' }}
      >
        {/* Drop shadow */}
        <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-[60%] h-12 bg-black/25 blur-[25px] rounded-full pointer-events-none" />

        {/* Book Container */}
        <div
          className="relative w-full max-w-[1200px] flex shrink-0"
          style={{
            aspectRatio: '16 / 11',
            maxHeight: '55vh',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Spine */}
          <div className="absolute left-1/2 -translate-x-1/2 w-3 h-full bg-gradient-to-r from-black/30 via-[#1a1c22] to-black/30 rounded-[2px] blur-[0.5px] z-[1] pointer-events-none" />

          {SHEETS.map((sheet, index) => {
            const isFlipped = currentFlip > index;
            const zIndex = isFlipped ? index + 1 : SHEETS.length - index;

            return (
              <motion.div
                key={sheet.id}
                onClick={isFlipped ? turnPrev : turnNext}
                className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                style={{
                  transformOrigin: '0% 50%',
                  zIndex,
                  transformStyle: 'preserve-3d',
                }}
                initial={false}
                animate={{ rotateY: isFlipped ? -180 : 0 }}
                transition={{
                  duration: 1.4,
                  ease: [0.64, 0.04, 0.35, 1],
                  type: 'tween'
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-r-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    boxShadow: !isFlipped ? '3px 2px 12px rgba(0,0,0,0.12), 1px 0 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/12 via-black/4 to-transparent z-50 pointer-events-none" />
                  {sheet.front}
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-l-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    boxShadow: isFlipped ? '-3px 2px 12px rgba(0,0,0,0.12), -1px 0 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/12 via-black/4 to-transparent z-50 pointer-events-none" />
                  {sheet.back}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 lg:mt-8 flex items-center justify-center gap-6 lg:gap-10 z-20 px-6 shrink-0">
        <button
          onClick={turnPrev}
          disabled={currentFlip === 0}
          className="font-mono text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-cream/50 hover:text-gold transition-colors disabled:opacity-15 disabled:cursor-not-allowed px-3 py-2"
        >
          ← Prev
        </button>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {SHEETS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentFlip(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === currentFlip
                  ? 'bg-gold scale-125'
                  : i < currentFlip
                  ? 'bg-gold/30'
                  : 'bg-cream/10'
              }`}
            />
          ))}
        </div>

        <button
          onClick={turnNext}
          disabled={currentFlip === SHEETS.length}
          className="font-mono text-[9px] lg:text-[10px] tracking-[0.3em] uppercase text-cream/50 hover:text-gold transition-colors disabled:opacity-15 disabled:cursor-not-allowed px-3 py-2"
        >
          Next →
        </button>
      </div>

      {/* Page Counter */}
      <div className="mt-2 font-mono text-[8px] lg:text-[9px] tracking-[0.3em] text-cream/20 uppercase shrink-0">
        {currentFlip === 0 ? 'Cover' : currentFlip >= SHEETS.length ? 'Back Cover' : `Page ${currentFlip * 2 - 1}–${currentFlip * 2}`} of {totalPages - 2}
      </div>

      {/* First-time hint */}
      <AnimatePresence>
        {currentFlip === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-2 font-mono text-[7px] tracking-[0.2em] text-cream/15 uppercase text-center"
          >
            Click or scroll to flip
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
