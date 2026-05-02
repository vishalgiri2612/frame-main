'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/* ── HELPER COMPONENTS ── */
const BookImage = ({ src, alt, caption }) => (
  <div className="w-full h-full relative flex flex-col justify-end p-10 overflow-hidden group bg-[#111]">
    <Image src={src} alt={alt} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3s]" sizes="50vw" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="relative z-10">
      <span className="font-mono text-[8px] tracking-[0.3em] text-[#C9A84C] uppercase">{caption}</span>
      <h3 className="text-2xl font-light text-[#F7F4EF] tracking-widest mt-2">{alt}</h3>
    </div>
  </div>
);

const Paper = ({ children, className = '' }) => (
  <div className={`w-full h-full flex flex-col pt-16 px-16 pb-12 bg-[#F9F7F1] text-[#0A0E1A] relative ${className}`}>
    {children}
  </div>
);

/* ── BOOK CONTENT ── */
const SHEETS = [
  {
    id: 'cover',
    front: (
      <div className="w-full h-full relative overflow-hidden">
        <Image src="/magazine/cover.png" alt="Journal of Sight" fill className="object-cover" sizes="50vw" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-14">
          <span className="font-mono text-[9px] tracking-[0.5em] text-[#C9A84C] uppercase mb-4">Volume IV · Punjab Optical</span>
          <h1 className="font-serif italic text-6xl text-white leading-none">Editorial<br/>Archives.</h1>
        </div>
      </div>
    ),
    back: (
      <div className="w-full h-full p-16 flex flex-col justify-center bg-[#12182B]">
        <h2 className="font-serif italic text-3xl text-[#C9A84C] mb-8">Colophon</h2>
        <p className="font-mono text-[9px] tracking-[0.1em] leading-loose max-w-[260px] text-[#F7F4EF]/70">
          Published by VISIO, Punjab.<br/><br/>
          Creative Direction: A. Vasquez.<br/>
          Photography: Studio Sterling.<br/>
          Typefaces: Cormorant Garamond, Inter.<br/><br/>
          Printed on 120gsm archival matte.<br/>
          Limited Edition of 500.
        </p>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-[#F7F4EF]/20">ii</div>
      </div>
    )
  },
  {
    id: 'manifesto',
    front: (
      <div className="w-full h-full relative overflow-hidden bg-[#0A0E1A]">
        <Image src="/magazine/editorial.png" alt="See the Unseen" fill className="object-cover opacity-20 grayscale" sizes="50vw" />
        <div className="absolute inset-0 flex items-center justify-center p-16 text-center">
          <h2 className="text-7xl font-black text-[#D4AF37] italic leading-[0.85] tracking-tighter uppercase">SEE <br/>THE <br/>UNSEEN.</h2>
        </div>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-[#F7F4EF]/20">1</div>
      </div>
    ),
    back: (
      <div className="w-full h-full relative overflow-hidden bg-[#12182B]">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
          <h2 className="text-6xl font-black text-[#D4AF37] leading-[0.9] tracking-tighter mb-8 uppercase">CRAFTING <br/>LEGENDS.</h2>
          <div className="w-16 h-px bg-[#D4AF37] mb-8" />
          <p className="font-mono text-[9px] text-[#F7F4EF]/40 tracking-[0.3em] uppercase">The Visio Creed / Edition IV</p>
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-[#F7F4EF]/20">2</div>
      </div>
    )
  },
  {
    id: 'intro',
    front: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#337E77] uppercase">00 / Foreword</span>
          <h2 className="text-4xl font-serif italic mt-10 mb-10 text-[#0A0E1A]">Vision as Architecture.</h2>
          <p className="text-[12px] font-sans font-light leading-relaxed max-w-sm text-[#0A0E1A]/70 columns-2 gap-8 text-justify">
            Eyewear is the ultimate intersection of medical necessity and aesthetic expression. The only architectural structure worn directly on the face. In this volume, we pull apart the seams of our manufacturing process — looking closely at the raw elements; titanium, Japanese acetate, 18k gold — and the hands that shape them.
          </p>
        </div>
        <div className="self-end font-mono text-[8px] text-[#0A0E1A]/30">3</div>
      </Paper>
    ),
    back: (
      <BookImage src="/magazine/editorial.png" alt="THE FOUNDRY" caption="Fig 1. Master Optician at Work" />
    )
  },
  {
    id: 'titanium',
    front: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#337E77] uppercase">01 / Material Science</span>
          <h2 className="text-5xl font-light tracking-tight mt-8 mb-12 text-[#0A0E1A]">THE TITANIUM <br/>REVOLUTION</h2>
          <div className="w-full h-px bg-[#0A0E1A]/10 mb-12" />
          <ul className="space-y-6 font-mono text-[9px] tracking-[0.1em] text-[#0A0E1A]/60">
            {[['TENSILE STRENGTH','834 MPa'],['MASS','18.4 GRAMS'],['ALLOY','BETA-TI 15-3-3-3'],['HYPOALLERGENIC','100% CERTIFIED']].map(([k,v]) => (
              <li key={k} className="flex justify-between border-b border-[#0A0E1A]/5 pb-3">
                <span>{k}</span><span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="self-end font-mono text-[8px] text-[#0A0E1A]/30">5</div>
      </Paper>
    ),
    back: (
      <Paper className="justify-center items-center">
        <h2 className="text-8xl font-serif italic text-[#0A0E1A]/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap -rotate-90">AEROSPACE</h2>
        <div className="z-10 bg-[#0A0E1A] p-14 text-center text-[#F7F4EF] shadow-2xl relative">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#C9A84C]" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#C9A84C]" />
          <p className="font-serif italic text-2xl text-[#C9A84C] mb-4">&quot;Weightless presence.&quot;</p>
          <p className="font-mono text-[8px] tracking-[0.2em] text-[#F7F4EF]/60">TITANIUM FORGE / OSAKA, JP</p>
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-[#0A0E1A]/30">6</div>
      </Paper>
    )
  },
  {
    id: 'acetate',
    front: (
      <BookImage src="/magazine/craftsmanship.png" alt="TARTARUGATO" caption="Fig 2. Italian Acetate Polishing" />
    ),
    back: (
      <Paper>
        <div className="flex-1">
          <span className="font-mono text-[8px] tracking-[0.2em] text-[#C9A84C] uppercase">02 / Craftsmanship</span>
          <h2 className="text-4xl font-serif italic mt-10 mb-10 text-[#0A0E1A]">The Cellulose Cellar.</h2>
          <p className="text-[12px] font-sans font-light leading-relaxed text-[#0A0E1A]/70 text-justify">
            We cure our acetate for over 90 days. This slow-aging process allows the cotton-based polymer to settle, preventing warping over years of wear. The patterns are not printed — they are physically embedded through layers of colored sheets, resulting in a depth of tortoiseshell that cannot be counterfeited by injection molding.
          </p>
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-[#0A0E1A]/30">8</div>
      </Paper>
    )
  },
  {
    id: 'interview',
    front: (
      <div className="w-full h-full p-16 flex flex-col justify-center items-center bg-[#0A0E1A]">
        <div className="text-center space-y-8 max-w-md">
          <span className="font-mono text-[8px] tracking-[0.3em] text-[#C9A84C] uppercase block">PERSPECTIVES</span>
          <h2 className="text-4xl font-serif italic leading-tight text-white">
            &quot;We do not sell frames. We engineer ways to see the world completely unimpeded.&quot;
          </h2>
          <div className="w-8 h-px bg-[#C9A84C]/50 mx-auto" />
          <span className="font-mono text-[9px] tracking-widest text-[#F7F4EF]/40 uppercase block">The Founder&apos;s Dialogue</span>
        </div>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-[#F7F4EF]/20">9</div>
      </div>
    ),
    back: (
      <Paper>
        <div className="flex-1 space-y-10">
          <div className="space-y-3">
            <span className="font-mono text-[8px] font-bold text-[#0A0E1A]">VISIO:</span>
            <p className="text-[11px] font-sans text-[#0A0E1A]/70 text-justify">Why restrict production to 500 units per collection?</p>
          </div>
          <div className="space-y-3 pl-5 border-l-2 border-[#C9A84C]/50">
            <span className="font-mono text-[8px] font-bold text-[#C9A84C]">FD:</span>
            <p className="text-[11px] font-sans text-[#0A0E1A]/70 text-justify">Because excellence does not scale indefinitely. When you push beyond 500 units, handmade processes turn into mechanical habits. We refuse to let machines dictate the polish of our acetate.</p>
          </div>
          <div className="space-y-3">
            <span className="font-mono text-[8px] font-bold text-[#0A0E1A]">VISIO:</span>
            <p className="text-[11px] font-sans text-[#0A0E1A]/70 text-justify">What makes the &quot;Architect&quot; series functionally different?</p>
          </div>
          <div className="space-y-3 pl-5 border-l-2 border-[#C9A84C]/50">
            <span className="font-mono text-[8px] font-bold text-[#C9A84C]">FD:</span>
            <p className="text-[11px] font-sans text-[#0A0E1A]/70 text-justify">We eliminated screws. Using a pure tension hinge system inspired by suspension bridges, the frame dynamically adapts to temporal lobes without loosening over time.</p>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 font-mono text-[8px] text-[#0A0E1A]/30">10</div>
      </Paper>
    )
  },
  {
    id: 'fin',
    front: (
      <Paper className="items-center justify-center text-center">
        <h2 className="font-serif text-6xl italic text-[#C9A84C] mb-14">Fin.</h2>
        <p className="font-mono text-[8px] tracking-[0.2em] text-[#0A0E1A]/40 max-w-[200px] mb-10">
          Explore the full curated collection physically at our flagship or via our digital portal.
        </p>
        <Link href="/shop" className="border border-[#C9A84C] text-[#C9A84C] px-12 py-4 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0E1A] transition-all duration-500 rounded-full">
          ENTER STORE
        </Link>
        <div className="absolute bottom-8 right-8 font-mono text-[8px] text-[#0A0E1A]/30">11</div>
      </Paper>
    ),
    back: (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0E1A] relative">
        <span className="text-5xl font-serif text-[#C9A84C] tracking-[0.5em] font-light">VISIO</span>
        <div className="w-16 h-px bg-[#C9A84C]/20 mt-6" />
        <span className="font-mono text-[8px] tracking-[0.3em] text-[#F7F4EF]/20 uppercase mt-4">Punjab Optical · Est. 1987</span>
      </div>
    )
  }
];

/* ── AMBIENT COLORS per spread ── */
const AMBIENTS = [
  'rgba(212,175,55,0.06)',
  'rgba(10,14,26,0.8)',
  'rgba(51,126,119,0.06)',
  'rgba(212,175,55,0.05)',
  'rgba(201,168,76,0.07)',
  'rgba(10,14,26,0.8)',
  'rgba(201,168,76,0.05)',
];

export default function MagazinePage() {
  const [currentFlip, setCurrentFlip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entered, setEntered] = useState(false);
  const [flipDir, setFlipDir] = useState('next');

  const turnNext = useCallback(() => {
    if (isAnimating || currentFlip >= SHEETS.length) return;
    setFlipDir('next');
    setIsAnimating(true);
    setCurrentFlip(c => c + 1);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, currentFlip]);

  const turnPrev = useCallback(() => {
    if (isAnimating || currentFlip <= 0) return;
    setFlipDir('prev');
    setIsAnimating(true);
    setCurrentFlip(c => c - 1);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, currentFlip]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const handleWheel = (e) => {
      const now = Date.now();
      if (now - lastTime < 1200) return;
      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) turnNext(); else turnPrev();
        lastTime = now;
      }
    };
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') turnNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') turnPrev();
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, [turnNext, turnPrev]);

  const ambientColor = AMBIENTS[Math.min(currentFlip, AMBIENTS.length - 1)];
  const totalPages = SHEETS.length * 2;
  const pageLabel = currentFlip === 0 ? 'Cover' : currentFlip >= SHEETS.length ? 'Back Cover' : `${currentFlip * 2 - 1} — ${currentFlip * 2}`;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0C0E14' }}>

      {/* AMBIENT GLOW — shifts per page */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ background: `radial-gradient(ellipse at center, ${ambientColor} 0%, transparent 70%)` }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* GRAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      {/* TOP BAR */}
      <div className="relative z-30 flex items-center justify-between px-8 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase hover:text-white/60 transition-colors">← Back</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-px bg-[#C9A84C]/40" />
          <span className="font-mono text-[9px] tracking-[0.4em] text-[#C9A84C]/60 uppercase">The Lookbook</span>
          <div className="w-6 h-px bg-[#C9A84C]/40" />
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">{pageLabel}</div>
      </div>

      {/* BOOK STAGE */}
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 z-10" style={{ perspective: '2800px' }}>

        {/* BOOK ENTER ANIMATION WRAPPER */}
        <motion.div
          initial={{ opacity: 0, rotateX: 15, scale: 0.92, y: 40 }}
          animate={entered ? { opacity: 1, rotateX: 0, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
          style={{ maxWidth: '1100px', aspectRatio: '16/10', maxHeight: '78vh', transformStyle: 'preserve-3d' }}
        >
          {/* BOOK SHADOW */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[55%] h-16 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)', filter: 'blur(10px)' }}
          />

          {/* LEFT PAGE BASE (visible as left half when book is open) */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-[#F0EDE6] rounded-l-sm"
            style={{ boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.08)' }}
          />
          {/* RIGHT PAGE BASE */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F9F7F1] rounded-r-sm"
            style={{ boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.05)' }}
          />

          {/* SPINE */}
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full z-50 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.2))', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
          />

          {/* SHEETS */}
          {SHEETS.map((sheet, index) => {
            const isFlipped = currentFlip > index;
            const zIndex = isFlipped ? index + 1 : SHEETS.length - index;
            return (
              <motion.div
                key={sheet.id}
                onClick={isFlipped ? turnPrev : turnNext}
                className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                style={{ transformOrigin: '0% 50%', zIndex, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateY: isFlipped ? -180 : 0 }}
                transition={{ duration: 1.0, ease: [0.77, 0, 0.18, 1] }}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 overflow-hidden rounded-r-sm"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    boxShadow: !isFlipped ? '6px 0 24px rgba(0,0,0,0.2), 2px 0 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {/* Page crease shadow */}
                  <div className="absolute inset-y-0 left-0 w-12 z-50 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)' }}
                  />
                  {sheet.front}
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 overflow-hidden rounded-l-sm"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    boxShadow: isFlipped ? '-6px 0 24px rgba(0,0,0,0.2), -2px 0 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  <div className="absolute inset-y-0 right-0 w-12 z-50 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)' }}
                  />
                  {sheet.back}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="relative z-30 flex items-center justify-center gap-8 pb-6 pt-4 shrink-0">
        <motion.button
          onClick={turnPrev}
          disabled={currentFlip === 0}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-[#C9A84C] transition-colors disabled:opacity-10 disabled:cursor-not-allowed px-4 py-2"
        >
          ← Prev
        </motion.button>

        {/* Page dots */}
        <div className="flex items-center gap-2">
          {SHEETS.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (!isAnimating) { setCurrentFlip(i); } }}
              className="transition-all duration-500"
              style={{
                width: i === currentFlip ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === currentFlip ? '#C9A84C' : i < currentFlip ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={turnNext}
          disabled={currentFlip === SHEETS.length}
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-[#C9A84C] transition-colors disabled:opacity-10 disabled:cursor-not-allowed px-4 py-2"
        >
          Next →
        </motion.button>
      </div>

      {/* HINT — first visit */}
      <AnimatePresence>
        {currentFlip === 0 && entered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none"
          >
            <div className="w-8 h-px bg-[#C9A84C]/30" />
            <span className="font-mono text-[8px] tracking-[0.3em] text-white/20 uppercase">Click · Scroll · Arrow Keys</span>
            <div className="w-8 h-px bg-[#C9A84C]/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
