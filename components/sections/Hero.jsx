'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressRunning, setProgressRunning] = useState(true);

  const [arRevealed, setArRevealed] = useState(false);
  const [arProgress, setArProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const slides = [
    {
      src: "/m1.png",
      badge: "ESTABLISHED 1987 / LUXURY EYEWEAR",
      titleTop: "SEE THE",
      titleItalic: "UNSEEN.",
      sub: "Engineering the perfect balance between architectural precision and timeless editorial aesthetics. Explore our curated selection of global masterpieces."
    },
    {
      src: "/m2.png",
      badge: "CRAFTED EXCELLENCE / PREMIUM SERIES",
      titleTop: "TIMELESS",
      titleItalic: "ELEGANCE.",
      sub: "A fusion of heritage craftsmanship and cutting-edge design. Discover eyewear that defines your unique perspective with unparalleled clarity."
    },
    {
      src: "/m3.png",
      badge: "MODERN VISION / ARTISAN FRAMES",
      titleTop: "BEYOND",
      titleItalic: "SIGHT.",
      sub: "Sculpting the future of optics with sustainable materials and bold silhouettes. Elevate your everyday style with a vision for tomorrow."
    }
  ];

  const timerRef = useRef(null);
  const scanTimerRef = useRef(null);

  const toggleAR = () => {
    if (!arRevealed && !isScanning) {
      setIsScanning(true);
      setArProgress(0);
      let pct = 0;
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = setInterval(() => {
        pct += 2.5;
        setArProgress(pct);
        if (pct >= 100) {
          clearInterval(scanTimerRef.current);
          setArRevealed(true);
          setIsScanning(false);
        }
      }, 35);
    } else if (arRevealed) {
      setArRevealed(false);
      setArProgress(0);
      setIsScanning(false);
    }
  };

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
        }
        .hero-slide.active .slide-img {
          transform: scale(1.02);
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
        }

        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: flex-end;
          padding: 0 6vw 7vh;
        }

        .hero-text {
          max-width: 520px;
          animation: fadeUp 0.8s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          display: inline-block;
          color: #111;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 20px;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
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
        }

        .hero-heading em {
          font-style: italic;
          font-weight: 400;
        }

        .hero-sub {
          color: #111;
          font-family: var(--font-inter), sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 500px;
          margin-bottom: 36px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 20px 24px;
          border-left: 3px solid #111;
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
      `}} />

      <section className="hero-section">
        {/* SLIDES */}
        {slides.map((slide, index) => (
          <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
            <img className="slide-img" src={slide.src} alt={slide.alt} />
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



        {/* AR Scanner Box */}
        <div className="ar-wrapper">
          <div className="ar-label">Virtual Try-On</div>

          <div className="ar-box" onClick={toggleAR}>
            {/* Animated scan line */}
            <div className={`scan-line ${isScanning ? 'fast' : ''}`} style={{ opacity: arRevealed ? 0 : 1 }}></div>

            {/* Corner brackets */}
            <div className="corner tl"></div>
            <div className="corner tr"></div>
            <div className="corner bl"></div>
            <div className="corner br"></div>

            {/* Initial overlay without text */}
            <div className="scan-overlay" style={{ opacity: arRevealed ? 0 : 1, pointerEvents: arRevealed ? 'none' : 'auto' }}>
            </div>

            {/* Glasses revealed after scan */}
            <div className="glasses-reveal" style={{ opacity: arRevealed ? 1 : 0 }}>
              <svg viewBox="0 0 220 130" width="210" height="124" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="lGr" cx="38%" cy="33%" r="68%">
                    <stop offset="0%" stopColor="#8a5828" stopOpacity="0.82"/>
                    <stop offset="100%" stopColor="#3a1800" stopOpacity="0.97"/>
                  </radialGradient>
                  <radialGradient id="rGr" cx="62%" cy="33%" r="68%">
                    <stop offset="0%" stopColor="#7a4818" stopOpacity="0.82"/>
                    <stop offset="100%" stopColor="#2a1000" stopOpacity="0.97"/>
                  </radialGradient>
                  
                  <radialGradient id="lGrAv" cx="38%" cy="33%" r="68%">
                    <stop offset="0%" stopColor="#4a5828" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#1a2800" stopOpacity="0.9"/>
                  </radialGradient>
                  <radialGradient id="rGrAv" cx="62%" cy="33%" r="68%">
                    <stop offset="0%" stopColor="#3a4818" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#0a1000" stopOpacity="0.9"/>
                  </radialGradient>
                </defs>

                {currentSlide === 0 && (
                  <g className="wayfarer">
                    {/* Wayfarer Lenses/Frames */}
                    <path d="M 30 40 C 50 30 90 35 100 45 C 110 70 90 95 65 95 C 40 95 20 80 30 40 Z" fill="url(#lGr)" stroke="#3a1800" strokeWidth="6"/>
                    <path d="M 190 40 C 170 30 130 35 120 45 C 110 70 130 95 155 95 C 180 95 200 80 190 40 Z" fill="url(#rGr)" stroke="#3a1800" strokeWidth="6"/>
                    <line x1="120" y1="50" x2="100" y2="50" stroke="#3a1800" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M30 40 C 15 35 5 45 0 50" stroke="#3a1800" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    <path d="M190 40 C 205 35 215 45 220 50" stroke="#3a1800" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    {/* Highlights */}
                    <ellipse cx="60" cy="56" rx="20" ry="12" fill="rgba(255,255,255,0.06)"/>
                    <ellipse cx="160" cy="56" rx="20" ry="12" fill="rgba(255,255,255,0.06)"/>
                    <text x="110" y="120" textAnchor="middle" fontFamily="var(--font-inter), sans-serif" fontSize="7" letterSpacing="2.5" fill="rgba(212,175,55,0.85)">
                      CLASSIC WAYFARER
                    </text>
                  </g>
                )}

                {currentSlide === 1 && (
                  <g className="aviator">
                    {/* Aviator Lenses/Frames */}
                    <path d="M 35 50 C 45 35 80 35 95 45 C 105 70 90 100 65 100 C 40 100 25 80 35 50 Z" fill="url(#lGrAv)" stroke="#d4af37" strokeWidth="2.5"/>
                    <path d="M 185 50 C 175 35 140 35 125 45 C 115 70 130 100 155 100 C 180 100 195 80 185 50 Z" fill="url(#rGrAv)" stroke="#d4af37" strokeWidth="2.5"/>
                    <line x1="125" y1="45" x2="95" y2="45" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M 118 36 C 110 32 110 32 102 36" stroke="#d4af37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M35 50 C 20 45 10 45 0 50" stroke="#d4af37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M185 50 C 200 45 210 45 220 50" stroke="#d4af37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <ellipse cx="60" cy="65" rx="12" ry="20" fill="rgba(255,255,255,0.06)" transform="rotate(30 60 65)"/>
                    <ellipse cx="160" cy="65" rx="12" ry="20" fill="rgba(255,255,255,0.06)" transform="rotate(-30 160 65)"/>
                    <text x="110" y="120" textAnchor="middle" fontFamily="var(--font-inter), sans-serif" fontSize="7" letterSpacing="2.5" fill="rgba(212,175,55,0.85)">
                      SIGNATURE AVIATOR
                    </text>
                  </g>
                )}

                {currentSlide === 2 && (
                  <g className="round">
                    {/* Round Lenses/Frames */}
                    <ellipse cx="70" cy="66" rx="38" ry="38" fill="url(#lGr)" stroke="#6a4220" strokeWidth="3.5"/>
                    <ellipse cx="150" cy="66" rx="38" ry="38" fill="url(#rGr)" stroke="#6a4220" strokeWidth="3.5"/>
                    <path d="M 125 58 C 110 52 110 52 95 58" stroke="#d4af37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M32 60 C 20 50 10 55 0 60" stroke="#d4af37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M188 60 C 200 50 210 55 220 60" stroke="#d4af37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <ellipse cx="60" cy="56" rx="16" ry="10" fill="rgba(255,220,170,0.08)"/>
                    <ellipse cx="140" cy="56" rx="16" ry="10" fill="rgba(255,220,170,0.08)"/>
                    <text x="110" y="120" textAnchor="middle" fontFamily="var(--font-inter), sans-serif" fontSize="7" letterSpacing="2.5" fill="rgba(212,175,55,0.85)">
                      VINTAGE ROUND
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Scan progress bar */}
            <div className="ar-progress-bar" style={{ width: `${Math.min(arProgress, 100)}%` }}></div>
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