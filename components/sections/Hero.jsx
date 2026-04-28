'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressRunning, setProgressRunning] = useState(true);

  const slides = [
    {
      src: "/m1.png",
      alt: "Model 1"
    },
    {
      src: "/m2.png",
      alt: "Model 2"
    },
    {
      src: "/m3.png",
      alt: "Model 3"
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
      <style dangerouslySetInnerHTML={{ __html: `
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
          background: var(--gold);
          color: var(--navy);
          font-family: var(--font-inter), sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 18px;
        }

        .hero-sub {
          color: rgba(247,244,239,0.9);
          font-family: var(--font-inter), sans-serif;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 360px;
          margin-bottom: 28px;
        }

        .hero-heading {
          font-family: var(--font-cormorant), serif;
          font-size: clamp(2.4rem, 5.5vw, 4.2rem);
          font-weight: 700;
          color: #F7F4EF;
          line-height: 1.08;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .hero-heading em {
          font-style: italic;
          color: var(--gold);
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

        .proof-card {
          position: absolute;
          bottom: 7vh;
          right: 3vw;
          z-index: 10;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          border-radius: 20px;
          padding: 20px 24px;
          width: 280px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          animation: fadeLeft 0.9s 0.3s ease both;
        }
        
        :global(.dark-mode) .proof-card {
          background: rgba(10,14,26,0.85);
          border: 1px solid var(--border-subtle);
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .avatars {
          display: flex;
          margin-bottom: 10px;
        }
        .avatars img {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 2px solid white;
          margin-left: -8px;
          object-fit: cover;
        }
        :global(.dark-mode) .avatars img {
          border-color: var(--navy);
        }
        .avatars img:first-child { margin-left: 0; }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .rating-score {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0d0d0d;
        }
        :global(.dark-mode) .rating-score {
          color: #F7F4EF;
        }
        .star { font-size: 1.1rem; }

        .proof-title {
          font-family: var(--font-cormorant), serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 6px;
        }
        :global(.dark-mode) .proof-title {
          color: #F7F4EF;
        }
        .proof-desc {
          font-size: 0.78rem;
          font-family: var(--font-inter), sans-serif;
          color: #6b6b6b;
          line-height: 1.5;
          margin-bottom: 14px;
        }
        :global(.dark-mode) .proof-desc {
          color: rgba(247,244,239,0.7);
        }

        .btn-ghost {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #efefef;
          color: #0d0d0d;
          border: none;
          border-radius: 50px;
          padding: 10px 10px 10px 18px;
          font-size: 0.8rem;
          font-family: var(--font-inter), sans-serif;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: background 0.2s;
        }
        :global(.dark-mode) .btn-ghost {
          background: var(--navy-surface);
          color: var(--text-primary);
        }
        .btn-ghost:hover { background: #e0e0e0; }
        :global(.dark-mode) .btn-ghost:hover { background: rgba(247,244,239,0.1); }
        
        .btn-ghost .arrow {
          width: 28px; height: 28px;
          background: var(--gold);
          color: var(--navy);
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
          <div className="hero-text">
            <span className="hero-badge">Designed for Modern Vision</span>
            <p className="hero-sub">
              Thoughtfully designed sunglasses and eyeglasses crafted for clarity, comfort, and balance—made to feel effortless, look refined.
            </p>
            <h1 className="hero-heading">
              Eyewear with<br /><em>Purpose</em> and<br />Presence
            </h1>
            <Link href="/shop" className="btn-primary">
              Shop the Collection
              <span className="arrow">↗</span>
            </Link>
          </div>
        </div>

        {/* SOCIAL PROOF CARD */}
        <div className="proof-card">
          <div className="avatars">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" />
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="user" />
            <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="user" />
          </div>
          <div className="rating-row">
            <span className="rating-score">4.9</span>
            <span className="star">⭐</span>
          </div>
          <p className="proof-title">Loved by Thousands</p>
          <p className="proof-desc">Trusted worldwide for premium quality, comfortable fit, and eyewear that looks refined in every setting.</p>
          <button className="btn-ghost">
            See What Customers Say
            <span className="arrow">↗</span>
          </button>
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