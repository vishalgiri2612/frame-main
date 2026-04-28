'use client';
import { useEffect, useRef } from 'react';

/**
 * CustomCursor — zero React state, all DOM manipulation via refs.
 * No re-renders. RAF loop runs once and stays alive.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const state = useRef({
    pos: { x: -200, y: -200 },
    cur: { x: -200, y: -200 },
    visible: false,
    hovering: false,
    clicking: false,
    raf: null,
  });

  useEffect(() => {
    // Skip on touch/mobile devices
    if (window.matchMedia('(hover: none)').matches) return;

    const s = state.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    // Apply all visual state directly to DOM — zero React re-renders
    const applyState = () => {
      // Dot
      dot.style.opacity = s.visible && !s.hovering ? '1' : '0';
      dot.style.transform = `translate(${s.cur.x - 4}px, ${s.cur.y - 4}px) scale(${s.clicking ? 0.6 : 1})`;
      // Ring
      ring.style.opacity = s.visible && s.hovering ? '1' : '0';
      ring.style.transform = `translate(${s.cur.x - 20}px, ${s.cur.y - 20}px) scale(${s.clicking ? 0.8 : 1})`;
    };

    // RAF lerp loop — runs once, never restarted
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      s.cur.x = lerp(s.cur.x, s.pos.x, 0.13);
      s.cur.y = lerp(s.cur.y, s.pos.y, 0.13);
      applyState();
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);

    // Event handlers — only update state ref, no React setState
    const onMove = (e) => {
      s.pos.x = e.clientX;
      s.pos.y = e.clientY;
      if (!s.visible) {
        s.visible = true;
      }
    };

    const onOver = (e) => {
      s.hovering = !!(
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('[data-cursor]') ||
        e.target.closest('.product-card')
      );
    };

    const onDown = () => { s.clicking = true; };
    const onUp = () => { s.clicking = false; };
    const onLeave = () => { s.visible = false; };
    const onEnter = () => { s.visible = true; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []); // empty dep array — runs once, never re-runs

  return (
    <>
      {/* Gold dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#C9A84C',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          transition: 'opacity 200ms ease',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid #C9A84C',
          pointerEvents: 'none',
          zIndex: 99997,
          opacity: 0,
          transition: 'opacity 200ms ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '7px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            userSelect: 'none',
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}
