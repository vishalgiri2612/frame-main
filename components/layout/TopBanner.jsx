'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MESSAGES = [
  { text: 'Free Eye Test with Every Frame Purchase', cta: 'Book Now', href: '#booking' },
  { text: 'New Arrivals: Tom Ford · Cartier · Prada', cta: 'Shop Now', href: '#shop' },
  { text: 'Free Home Delivery on Orders Above ₹ 5,000', cta: 'Explore', href: '#frames' },
]

export default function TopBanner() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const [navHeight, setNavHeight] = useState(0)

  // Measure Navbar height to place banner below it
  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) setNavHeight(nav.offsetHeight);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  // Rotate message every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (!visible) return null

  return (
    <div 
      data-banner
      style={{ top: navHeight }}
      className="fixed left-0 w-full bg-navy border-b border-gold/10 py-2.5 px-6 flex items-center justify-center z-[45] transition-all duration-500"
    >
      {/* Left decorative line */}
      <div className="hidden md:block absolute left-6 w-12 h-px bg-navy/30" />

      {/* Rotating message */}
      <div className="overflow-hidden h-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="flex items-center gap-3"
          >
            <span className="text-cream text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold text-center">
              {MESSAGES[index].text}
            </span>

            {/* Dot separator */}
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40 flex-shrink-0" />

            {/* CTA link */}
            <Link 
              href={MESSAGES[index].href}
              className="text-gold text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold
                         border-b border-gold/40 hover:border-gold transition-all
                         pb-px leading-none whitespace-nowrap"
            >
              {MESSAGES[index].cta} →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative lines */}
      <div className="hidden md:block absolute left-6 w-12 h-px bg-gold/20" />
      <div className="hidden md:block absolute right-12 w-12 h-px bg-gold/20" />

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30
                   hover:text-gold transition-colors"
        aria-label="Close banner"
      >
        <X size={14} />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 pb-0.5">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-0.5 transition-all rounded-full
              ${i === index ? 'w-4 bg-gold/60' : 'w-1.5 bg-cream/20'}`}
          />
        ))}
      </div>
    </div>
  )
}
