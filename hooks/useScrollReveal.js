'use client';
import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — uses IntersectionObserver with a small delay
 * to ensure SSR-hydrated elements are available in the DOM.
 * Adds `.is-visible` once 15% is in view. Fires once only.
 */
export default function useScrollReveal() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Small delay to let hydration settle
    const init = () => {
      const elements = document.querySelectorAll('.scroll-reveal:not(.is-visible)');
      if (!elements.length) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => observerRef.current?.observe(el));
    };

    const t = setTimeout(init, 300);
    return () => {
      clearTimeout(t);
      observerRef.current?.disconnect();
    };
  }, []);
}
