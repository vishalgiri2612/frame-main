'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressRunning, setProgressRunning] = useState(true);

  const [miniFrameLoaded, setMiniFrameLoaded] = useState(false);

  const slides = [
    {
      src: "/m1.png",
      frameImg: "/image copy.png",
      frameName: "Mega Wayfarer II — Tortoise",
      frameLink: "/shop/RB0832S-902/R5",
      theme: "rgba(212,175,55,0.4)", // Gold/Amber theme
      badge: "ESTABLISHED 1987 / LUXURY EYEWEAR",
      titleTop: "SEE THE",
      titleItalic: "UNSEEN.",
      sub: "Engineering the perfect balance between architectural precision and timeless editorial aesthetics. Explore our curated selection of global masterpieces."
    },
    {
      src: "/m2.png",
      frameImg: "/image.png",
      frameName: "Mega Wayfarer II — Black",
      frameLink: "/shop/RB0832S-901/58",
      theme: "rgba(255,255,255,0.25)", // White/Silver theme
      badge: "CRAFTED EXCELLENCE / PREMIUM SERIES",
      titleTop: "TIMELESS",
      titleItalic: "ELEGANCE.",
      sub: "A fusion of heritage craftsmanship and cutting-edge design. Discover eyewear that defines your unique perspective with unparalleled clarity."
    },
    {
      src: "/m3.png",
      frameImg: "/image copy.png",
      frameName: "Mega Wayfarer II — Tortoise",
      frameLink: "/shop/RB0832S-902/R5",
      theme: "rgba(212,175,55,0.4)", // Gold/Amber theme
      badge: "MODERN VISION / ARTISAN FRAMES",
      titleTop: "BEYOND",
      titleItalic: "SIGHT.",
      sub: "Sculpting the future of optics with sustainable materials and bold silhouettes. Elevate your everyday style with a vision for tomorrow."
    }
  ];

  const timerRef = useRef(null);


  const startAutoplay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 3000);
    resetProgress();
  };

  const resetProgress = () => {
    setProgressRunning(false);
    setTimeout(() => setProgressRunning(true), 50); // slight delay to re-trigger animation
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, []);

  const next = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    startAutoplay();
  };

  const prev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    startAutoplay();
  };

  const goTo = (index) => {
    setCurrentSlide(index);
    startAutoplay();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-section {
          position: relative;
          width: 100%;
          height: 92vh;
          min-height: 560px;
          overflow: hidden;
          background: var(--navy);
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          will-change: opacity;
          transform: translateZ(0);
        }
        .hero-slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          filter: brightness(0.72);
          transition: transform 8s ease;
          will-change: transform;
        }
        .hero-slide.active .slide-img {
          transform: scale(1.02) translateZ(0);
        }

        .hero-slide::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(10,14,26,0.55) 0%,
            rgba(10,14,26,0.12) 55%,
            transparent 100%
          );
          pointer-events: none;
          transform: translateZ(0);
        }

        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: flex-end;
          padding: 0 6vw 7vh;
          contain: layout;
        }

        .hero-text {
          max-width: 520px;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px) translateZ(0); }
          to   { opacity: 1; transform: translateY(0) translateZ(0); }
        }

        .hero-badge {
          display: inline-block;
          color: var(--text-primary);
          font-family: var(--font-inter), sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 20px;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
          transform: translateZ(0);
        }
        
        :global(.dark-mode) .hero-badge {
          color: rgba(247,244,239,0.9);
        }

        .hero-heading {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(4.5rem, 9vw, 8rem);
          font-weight: 600;
          color: var(--gold);
          line-height: 1.05;
          margin-bottom: 30px;
          letter-spacing: -0.02em;
          text-shadow: 2px 4px 15px rgba(0,0,0,0.4);
          transform: translateZ(0);
        }

        .hero-heading em {
          font-style: italic;
          font-weight: 400;
        }

        .hero-sub {
          color: var(--text-primary);
          font-family: var(--font-inter), sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 500px;
          margin-bottom: 36px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 20px 24px;
          border-left: 3px solid var(--text-primary);
          transform: translateZ(0);
        }

        :global(.dark-mode) .hero-sub {
          color: rgba(247,244,239,0.9);
          background: rgba(10, 14, 26, 0.4);
          border-left-color: var(--gold);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--gold);
          color: var(--navy);
          font-family: var(--font-inter), sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 13px 26px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
        }
        .btn-primary .arrow {
          width: 28px; height: 28px;
          background: var(--navy);
          color: var(--gold);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 0.85rem;
        }



        .indicators {
          position: absolute;
          left: 50%;
          bottom: 30px;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          gap: 8px;
        }
        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: background 0.3s, transform 0.3s;
          padding: 0;
        }
        .dot.active {
          background: var(--gold);
          transform: scale(1.3);
        }

        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          font-size: 1.1rem;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .arrow-btn:hover { background: rgba(255,255,255,0.32); }
        .arrow-btn.prev { left: 24px; }
        .arrow-btn.next { right: 24px; }

        .slide-counter {
          position: absolute;
          top: 36px;
          right: 6vw;
          z-index: 20;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-inter), sans-serif;
          font-size: 0.82rem;
          letter-spacing: 0.05em;
        }
        .slide-counter span { color: white; font-weight: 600; }

        .hero-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: var(--gold);
          z-index: 20;
          animation: none;
        }
        .hero-progress-bar.running {
          animation: progress 3s linear forwards;
        }
        @keyframes progress {
          from { width: 0; }
          to   { width: 100%; }
        }

        /* ── MINI FRAME PANEL (Glasses Only) ── */
        .mini-frame-panel {
          position: absolute;
          right: 40px;
          bottom: 40px;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .mini-frame-label {
          font-family: var(--font-inter), sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        .mini-frame-card {
          position: relative;
          width: 400px;
          height: 280px;
          background: rgba(8, 11, 22, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--slide-theme, rgba(212,175,55,0.35));
          border-radius: 6px;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 16px 48px rgba(0,0,0,0.7),
            inset 0 0 40px rgba(212,175,55,0.04),
            0 0 28px var(--slide-theme-glow, rgba(212,175,55,0.12));
          display: flex;
          align-items: center;
          justify-content: center;
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.3s ease;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
        }
        .mini-frame-card:hover {
          border-color: rgba(212,175,55,0.65);
          transform: translateY(-4px) scale(1.02);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 24px 64px rgba(0,0,0,0.8),
            inset 0 0 60px rgba(212,175,55,0.07),
            0 0 48px rgba(212,175,55,0.25);
        }

        /* "View Product" badge shown on hover */
        .mini-frame-card::after {
          content: 'View Product ↗';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px 0;
          text-align: center;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(10,14,26,0.95);
          background: rgba(212,175,55,0.92);
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mini-frame-card:hover::after {
          transform: translateY(0);
        }

        /* Gold corner brackets */
        .mfc-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--slide-theme, rgba(212,175,55,0.75));
          border-style: solid;
          pointer-events: none;
          transition: border-color 0.4s ease;
        }
        .mfc-corner.tl { top: 8px; left: 8px;  border-width: 2px 0 0 2px; }
        .mfc-corner.tr { top: 8px; right: 8px;  border-width: 2px 2px 0 0; }
        .mfc-corner.bl { bottom: 8px; left: 8px;  border-width: 0 0 2px 2px; }
        .mfc-corner.br { bottom: 8px; right: 8px;  border-width: 0 2px 2px 0; }

        /* Glasses real image wrapper — fade in/out on slide change */
        .mf-glasses-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transform: scale(0.96) translateY(4px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
        }
        .mf-glasses-wrap.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .mf-glasses-img {
          width: 100%;
          height: 140px;
          object-fit: contain;
          object-position: center;
          /* removed mix-blend-mode: multiply to prevent color change */
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.55));
        }

        .mf-glasses-name {
          font-family: var(--font-cormorant), serif;
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--gold);
          white-space: nowrap;
          margin-top: 15px;
          opacity: 0.9;
          display: flex;
          justify-content: center;
          gap: 0.3em;
        }

        .mf-glasses-name em {
          font-style: italic;
          font-weight: 300;
        }

        /* Subtle ambient glow behind glasses */
        .mf-glow {
          position: absolute;
          width: 200px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(ellipse, var(--slide-theme-glow, rgba(212,175,55,0.10)) 0%, transparent 70%);
          pointer-events: none;
          transition: background 0.4s ease;
        }

        .mini-frame-dots {
          display: flex;
          gap: 6px;
        }
        .mini-frame-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          transition: background 0.3s, transform 0.3s;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .mini-frame-dot.active {
          background: var(--gold);
          transform: scale(1.35);
        }

        @media (max-width: 900px) {
          .mini-frame-panel { display: none; }
        }
      `}} />

      <section className="hero-section">
        {/* SLIDES */}
        {slides.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <Image
              className="slide-img"
              src={slide.src}
              alt={slide.frameName}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}

        {/* SLIDE COUNTER */}
        <div className="slide-counter">
          <span>{String(currentSlide + 1).padStart(2, '0')}</span> / {String(slides.length).padStart(2, '0')}
        </div>

        {/* HERO CONTENT */}
        <div className="hero-content">
          <div className="hero-text" key={currentSlide}>
            <span className="hero-badge">{slides[currentSlide].badge}</span>
            <h1 className="hero-heading">
              {slides[currentSlide].titleTop}<br /><em>{slides[currentSlide].titleItalic}</em>
            </h1>
            <p className="hero-sub">
              {slides[currentSlide].sub}
            </p>
            <Link href="/shop" className="btn-primary">
              Shop the Collection
              <span className="arrow">↗</span>
            </Link>
          </div>
        </div>



        {/* MINI FRAME PANEL — Glasses Only, synced with carousel */}
        <div className="mini-frame-panel">
          <span className="mini-frame-label">Featured Frame</span>

          <Link
            href={slides[currentSlide].frameLink}
            className="mini-frame-card"
            style={{
              '--slide-theme': slides[currentSlide].theme,
              '--slide-theme-glow': slides[currentSlide].theme.replace('0.4', '0.12').replace('0.25', '0.08')
            }}
          >
            {/* Corner brackets */}
            <div className="mfc-corner tl" />
            <div className="mfc-corner tr" />
            <div className="mfc-corner bl" />
            <div className="mfc-corner br" />

            {/* Ambient glow */}
            <div className="mf-glow" />

            {/* All glasses images stacked, only active one visible */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`mf-glasses-wrap${index === currentSlide ? ' visible' : ''}`}
              >
                <div className="relative w-full h-[260px]">
                  <Image
                    src={slide.frameImg}
                    alt={slide.frameName}
                    fill
                    sizes="300px"
                    className="mf-glasses-img"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="mf-glasses-name">
                  {(() => {
                    const words = slide.frameName.split(' ');
                    if (words.length <= 1) return <em>{slide.frameName}<span style={{ fontStyle: 'normal' }}>.</span></em>;
                    const firstPart = words.slice(0, -1).join(' ');
                    const lastWord = words[words.length - 1];
                    return (
                      <>
                        <span>{firstPart}</span>
                        <em>{lastWord}<span style={{ fontStyle: 'normal' }}>.</span></em>
                      </>
                    );
                  })()}
                </span>
              </div>
            ))}
          </Link>

          {/* Mini dots — synced with main carousel */}
          <div className="mini-frame-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`mini-frame-dot${index === currentSlide ? ' active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ARROW CONTROLS */}
        <button className="arrow-btn prev" onClick={prev}>&#8592;</button>
        <button className="arrow-btn next" onClick={next}>&#8594;</button>

        {/* DOTS */}
        <div className="indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className={`hero-progress-bar ${progressRunning ? 'running' : ''}`} />
      </section>
    </>
  );
}