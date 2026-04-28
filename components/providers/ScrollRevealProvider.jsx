'use client';
import useScrollReveal from '@/hooks/useScrollReveal';

/**
 * Mounts the global scroll-reveal IntersectionObserver.
 * Include once in layout.js.
 */
export default function ScrollRevealProvider() {
  useScrollReveal();
  return null;
}
