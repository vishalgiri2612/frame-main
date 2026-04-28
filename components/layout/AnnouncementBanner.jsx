'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BANNER_ITEMS = [
  { icon: '✦', text: 'Free Eye Test with Every Frame Purchase', cta: 'Book Now', href: '#booking' },
  { icon: '◆', text: 'New Arrivals: Tom Ford · Cartier · Prada · Gucci', cta: 'Shop Now', href: '#shop' },
  { icon: '✦', text: 'Free Home Delivery on Orders Above ₹ 5,000', cta: 'Explore', href: '#frames' },
  { icon: '◆', text: 'MediaPipe AR Virtual Try-On — Try Any Frame Instantly', cta: 'Try Now', href: '#tryon' },
  { icon: '✦', text: 'Official Stockist: Ray-Ban · Oakley · Silhouette · Lindberg', cta: null, href: null },
  { icon: '◆', text: '30-Day Hassle-Free Returns · 1 Year International Warranty', cta: null, href: null },
]

export default function AnnouncementBanner({ theme = 'dark' }) {
  const [visible, setVisible] = useState(true)
  const [navHeight, setNavHeight] = useState(0)

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('nav')
      if (nav) setNavHeight(nav.offsetHeight)
    }
    updateNavHeight()
    window.addEventListener('resize', updateNavHeight)
    return () => window.removeEventListener('resize', updateNavHeight)
  }, [])

  if (!visible) return null

  const isDark = theme === 'dark'

  return (
    <div
      data-banner
      style={{ top: navHeight }}
      className={`
        fixed left-0 w-full overflow-hidden z-40 border-b transition-all duration-500
        ${isDark
          ? 'bg-[#0A0E1A] border-[#C9A84C]/15'
          : 'bg-[#F7F4EF] border-[#C9A84C]/30'}
      `}
    >
      <div className="relative h-10 flex items-center">
        {/* LEFT FADE EDGE */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to right, #0A0E1A, transparent)'
              : 'linear-gradient(to right, #F7F4EF, transparent)'
          }}
        />

        {/* RIGHT FADE EDGE */}
        <div
          className="absolute right-8 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to left, #0A0E1A, transparent)'
              : 'linear-gradient(to left, #F7F4EF, transparent)'
          }}
        />

        {/* SCROLLING TRACK */}
        <div className="flex items-center h-full overflow-hidden">
          <div
            className="flex items-center gap-0 whitespace-nowrap"
            style={{
              animation: 'marquee-scroll 35s linear infinite',
              willChange: 'transform',
            }}
          >
            {/* Render items TWICE for seamless loop */}
            {[...BANNER_ITEMS, ...BANNER_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-3 px-8">
                {/* Gold diamond icon */}
                <span
                  className={`text-[8px] flex-shrink-0
                    ${isDark ? 'text-[#C9A84C]' : 'text-[#8B6F2E]'}`}
                >
                  {item.icon}
                </span>

                {/* Message text */}
                <span
                  className={`text-[11px] tracking-[0.18em] uppercase font-light
                    ${isDark ? 'text-[#F7F4EF]/70' : 'text-[#0A0E1A]/65'}`}
                >
                  {item.text}
                </span>

                {/* CTA link (optional) */}
                {item.cta && (
                  <>
                    <span
                      className={`text-[8px] flex-shrink-0
                        ${isDark ? 'text-[#C9A84C]/40' : 'text-[#8B6F2E]/50'}`}
                    >
                      ·
                    </span>
                    <a
                      href={item.href}
                      className={`
                        text-[11px] tracking-[0.18em] uppercase font-medium
                        border-b pb-px transition-all duration-200 flex-shrink-0
                        ${isDark
                        ? 'text-[#C9A84C] border-[#C9A84C]/40 hover:border-[#C9A84C]'
                        : 'text-[#8B6F2E] border-[#8B6F2E]/40 hover:border-[#8B6F2E]'}
                      `}
                    >
                      {item.cta} →
                    </a>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close banner"
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 z-20
            transition-colors duration-200 p-1
            ${isDark
              ? 'text-[#F7F4EF]/30 hover:text-[#F7F4EF]/80'
              : 'text-[#0A0E1A]/30 hover:text-[#0A0E1A]/80'}
          `}
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
