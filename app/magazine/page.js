'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ── Tag color map ─────────────────────────────────────────────────────── */
const TAG_COLORS = {
  'Celebrity Sightings': { bg: '#C9A84C', text: '#0A0E1A' },
  'Trend Alert':         { bg: '#E8453C', text: '#FFF' },
  'Red Carpet':          { bg: '#9B59B6', text: '#FFF' },
  'Style Guide':         { bg: '#2ECC71', text: '#0A0E1A' },
};

/* ── Article Spread Component ──────────────────────────────────────────── */
function ArticleSpread({ article, index, articles }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const tagColor = TAG_COLORS[article.tag] || { bg: '#C9A84C', text: '#0A0E1A' };
  const fallbackImg = article.imageFallback
    || `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1080&auto=format&fit=crop&sig=${index}`;

  return (
    /*
     * RESPONSIVE LAYOUT:
     *   Mobile  (< md): flex-col  — image on TOP, content on BOTTOM
     *   Desktop (≥ md): flex-row  — image on LEFT, content on RIGHT
     */
    <div className="absolute inset-0 flex flex-col md:flex-row w-full h-full">

      {/* ── IMAGE PANEL ─────────────────────────────────────────────────
          Mobile:  full width, 45% of screen height
          Desktop: 55% width, full height                               */}
      <div className="relative w-full md:w-[55%] h-[45%] md:h-full overflow-hidden bg-[#0A0E1A] flex-shrink-0">

        {/* Spinner while loading */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
            <span className="font-mono text-[8px] tracking-[0.3em] text-[#C9A84C]/40 uppercase">
              Curating Image
            </span>
          </div>
        )}

        <motion.img
          src={imgError ? fallbackImg : article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          animate={{ scale: [1, 1.04] }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        {/* Gradient overlays */}
        {/* Desktop: fade right edge into content */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-transparent via-transparent to-black/50" />
        {/* Mobile: fade bottom edge into content panel */}
        <div className="absolute inset-0 block md:hidden bg-gradient-to-b from-transparent via-transparent to-black/70" />
        {/* Top and bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Tag badge */}
        <div
          className="absolute top-4 left-4 md:top-8 md:left-8 px-2.5 py-1 md:px-3 md:py-1.5 font-mono text-[7px] md:text-[8px] tracking-[0.25em] uppercase font-semibold z-10"
          style={{ background: tagColor.bg, color: tagColor.text }}
        >
          {article.tag}
        </div>

        {/* Issue number */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 font-mono text-[8px] tracking-[0.3em] text-white/30 z-10">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* ── CONTENT PANEL ───────────────────────────────────────────────
          Mobile:  full width, remaining 55% height, scrollable
          Desktop: remaining width, full height                         */}
      <div className="relative flex-1 min-h-0 bg-[#F7F4EF] flex flex-col overflow-hidden">

        {/* Paper texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px',
          }}
        />
        {/* Left spine shadow (desktop only) */}
        <div className="absolute left-0 top-0 w-5 h-full bg-gradient-to-r from-black/12 to-transparent pointer-events-none hidden md:block" />
        {/* Top shadow (mobile: comes from image) */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none md:hidden" />

        {/* Scrollable inner — important for small phones */}
        <div className="relative flex flex-col h-full overflow-y-auto overscroll-contain px-6 py-6 md:px-12 md:py-14 gap-5 md:justify-between">

          {/* ── HEADER ── */}
          <div className="flex-shrink-0">
            {/* Byline */}
            <div className="flex items-center gap-2.5 mb-5 md:mb-10">
              <div className="w-6 md:w-8 h-px bg-[#C9A84C]" />
              <span className="font-mono text-[7px] md:text-[8px] tracking-[0.35em] text-[#C9A84C] uppercase">
                FRAME Magazine ·{' '}
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif italic text-[1.15rem] md:text-[1.6rem] leading-tight text-[#0A0E1A] mb-4 md:mb-8">
              {article.title}
            </h2>

            {/* Divider */}
            <div className="w-10 md:w-12 h-px bg-[#0A0E1A]/20 mb-4 md:mb-8" />

            {/* Excerpt */}
            <p className="text-[12px] md:text-[13px] font-light leading-[1.8] md:leading-[1.85] text-[#0A0E1A]/65 text-justify">
              {article.excerpt}
            </p>
          </div>

          {/* ── NEXT ARTICLE CTA ── */}
          {articles.length > index + 1 && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('magazine-next'))}
              className="mt-12 group flex items-center gap-5 py-8 border-t border-[#0A0E1A]/10 w-full text-left transition-all hover:bg-[#0A0E1A]/[0.02] rounded-sm px-2"
            >
              <div className="flex flex-col flex-1">
                <span className="font-mono text-[8px] tracking-[0.4em] text-[#C9A84C] uppercase mb-2">Next Editorial</span>
                <h3 className="font-serif italic text-lg md:text-xl text-[#0A0E1A] group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {articles[index + 1]?.title}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#0A0E1A]/10 flex items-center justify-center group-hover:border-[#C9A84C]/60 group-hover:bg-white shadow-sm transition-all duration-500">
                <motion.svg 
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M9 18l6-6-6-6" />
                </motion.svg>
              </div>
            </button>
          )}

          {/* ── FOOTER ── */}
          <div className="flex-shrink-0 flex items-center justify-between pt-6 border-t border-[#0A0E1A]/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              <span className="font-mono text-[7px] md:text-[8px] tracking-[0.2em] text-[#0A0E1A]/40 uppercase">
                {article.readTime || '3 min'} read
              </span>
            </div>
            <span className="font-mono text-[7px] md:text-[8px] text-[#0A0E1A]/25 uppercase tracking-widest">
              Issue 01 · P.{(index + 1) * 2}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main magazine page ────────────────────────────────────────────────── */
export default function MagazinePage() {
  const [articles, setArticles]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [current,  setCurrent]    = useState(0);
  const [direction, setDirection] = useState(1);
  const [entered,   setEntered]   = useState(false);

  /* Touch-swipe state */
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  /* Fetch articles */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`/api/magazine/latest?t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setArticles(json.data);
        } else {
          await fetch('/api/magazine/generate', { method: 'POST' });
          const r2 = await fetch('/api/magazine/latest');
          const j2 = await r2.json();
          if (j2.success) setArticles(j2.data);
        }
      } catch (e) {
        console.error('MAGAZINE_LOAD_ERROR', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= articles.length) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current, articles.length]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  /* Keyboard + wheel */
  useEffect(() => {
    let lastWheel = 0;
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    };
    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastWheel < 900) return;
      if (Math.abs(e.deltaY) > 30) { e.deltaY > 0 ? next() : prev(); lastWheel = now; }
    };
    const onMagazineNext = () => next();
    window.addEventListener('magazine-next', onMagazineNext);
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => { 
      window.removeEventListener('magazine-next', onMagazineNext);
      window.removeEventListener('keydown', onKey); 
      window.removeEventListener('wheel', onWheel); 
    };
  }, [next, prev]);

  /* Touch swipe — horizontal on desktop layout, horizontal on mobile too */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    // Only trigger if horizontal swipe is dominant (not accidental scroll)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      dx > 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  /* ── Loading ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0C0E14] flex flex-col items-center justify-center gap-5">
        <div className="w-10 h-10 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
        <p className="font-mono text-[9px] tracking-[0.5em] text-[#C9A84C]/50 uppercase">
          Curating the Latest Issue...
        </p>
      </div>
    );
  }

  /* ── Empty ──────────────────────────────────────────────────────────── */
  if (articles.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0C0E14] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="font-serif italic text-3xl text-[#C9A84C]">Empty Archives</span>
        <p className="font-mono text-[9px] tracking-[0.3em] text-white/30">
          Run the reset script to populate the magazine.
        </p>
        <Link
          href="/"
          className="font-mono text-[9px] tracking-[0.3em] text-white/40 hover:text-white uppercase border border-white/10 px-6 py-3"
        >
          ← Back Home
        </Link>
      </div>
    );
  }

    const variants = {
    enter: (dir) => ({
      clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0%)',
      x: dir > 0 ? '15%' : '-15%',
      rotateY: dir > 0 ? 10 : -10,
      scale: 1.02,
      zIndex: 30,
    }),
    center: {
      clipPath: 'inset(0 0 0 0%)',
      x: 0,
      rotateY: 0,
      scale: 1,
      zIndex: 20,
      transition: {
        duration: 0.9,
        ease: [0.4, 0, 0.2, 1], // Standard decelerate
      }
    },
    exit: (dir) => ({
      clipPath: dir > 0 ? 'inset(0 100% 0 0%)' : 'inset(0 0 0 100%)',
      x: dir > 0 ? '-15%' : '15%',
      rotateY: dir > 0 ? -10 : 10,
      scale: 0.98,
      zIndex: 10,
      transition: {
        duration: 0.9,
        ease: [0.4, 0, 0.2, 1],
      }
    }),
  };

  const currentArticle = articles[current];
  const tagColor = TAG_COLORS[currentArticle?.tag] || { bg: '#C9A84C' };

  return (
    <div
      className="fixed inset-0 bg-[#0C0E14] flex flex-col overflow-hidden select-none"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        perspective: '2000px',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── TOP NAV ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={entered ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-30 flex flex-col shrink-0"
      >
        <div className="flex items-center justify-between px-5 md:px-8 py-3 md:py-4 border-b border-white/[0.04]">
          <Link
            href="/"
            className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-white/30 uppercase hover:text-white/60 transition-colors"
          >
            ← Back
          </Link>
          <div className="flex flex-col items-center">
            <span className="font-serif italic text-[#C9A84C] text-base md:text-lg tracking-wide">
              FRAME
            </span>
            <span className="font-mono text-[6px] md:text-[7px] tracking-[0.5em] text-white/20 uppercase">
              Magazine
            </span>
          </div>
          <div className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-white/20 uppercase">
            {current + 1}&thinsp;/&thinsp;{articles.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[1px] bg-white/[0.03] overflow-hidden">
          <motion.div 
            className="h-full bg-[#C9A84C]"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / articles.length) * 100}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      {/* ── SPREAD AREA ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative flex-1 min-h-0 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={entered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Frame shadow */}
        <div className="absolute inset-2 md:inset-4 rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.5)] pointer-events-none z-0" />

        <AnimatePresence initial={false} custom={direction}>
          {/* Page Crease Shadow (Simulates the fold line moving) */}
          <motion.div
            key={`shadow-${current}`}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: direction > 0 ? '-100%' : '100%', opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-black/60 to-transparent z-40 pointer-events-none"
          />

          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-2 md:inset-4 rounded-sm overflow-hidden"
            style={{ 
              transformStyle: 'preserve-3d',
              boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5), 0 18px 36px -18px rgba(0,0,0,0.5)'
            }}
          >
            <ArticleSpread article={articles[current]} index={current} articles={articles} />
          </motion.div>
        </AnimatePresence>

        {/* Desktop side-nav arrows (hidden on mobile — use swipe) */}
        {current > 0 && (
          <button
            onClick={prev}
            aria-label="Previous article"
            className="hidden md:flex absolute left-4 top-0 bottom-0 w-14 z-20 items-center justify-start pl-2 group"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </button>
        )}
        {current < articles.length - 1 && (
          <button
            onClick={next}
            aria-label="Next article"
            className="hidden md:flex absolute right-4 top-0 bottom-0 w-14 z-20 items-center justify-end pr-2 group"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        )}
      </motion.div>

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={entered ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative z-30 flex items-center justify-between px-5 md:px-8 py-3 md:py-4 shrink-0"
      >
        {/* Prev — always visible on mobile as a button */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-white/30 hover:text-[#C9A84C] active:text-[#C9A84C] disabled:opacity-0 transition-colors py-2 pr-4"
        >
          ← Prev
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {articles.map((a, i) => {
            const tc = TAG_COLORS[a.tag] || { bg: '#C9A84C' };
            const isActive = i === current;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Article ${i + 1}`}
                className="transition-all duration-500 rounded-full touch-manipulation"
                style={{
                  width:      isActive ? '24px' : '7px',
                  height:     '7px',
                  minWidth:   '7px',
                  background: isActive ? tc.bg : 'rgba(255,255,255,0.12)',
                }}
              />
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={current === articles.length - 1}
          className="font-mono text-[8px] md:text-[9px] tracking-[0.25em] uppercase text-white/30 hover:text-[#C9A84C] active:text-[#C9A84C] disabled:opacity-0 transition-colors py-2 pl-4"
        >
          Next →
        </button>
      </motion.div>

      {/* Mobile swipe hint — shows only on first article, fades after 2s */}
      {current === 0 && entered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2.5, delay: 1.5 }}
          className="absolute bottom-14 left-0 right-0 flex justify-center pointer-events-none z-40 md:hidden"
        >
          <span className="font-mono text-[7px] tracking-[0.4em] text-white/30 uppercase">
            ← swipe to browse →
          </span>
        </motion.div>
      )}
    </div>
  );
}
