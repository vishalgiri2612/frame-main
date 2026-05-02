'use client';
import Link from 'next/link';

const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const footerBg = '#060810';

export default function Footer() {
  return (
    <footer style={{ background: footerBg, paddingTop: '96px', paddingBottom: '48px', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">

          {/* Brand */}
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '0.3em', color: '#F7F4EF', lineHeight: 1 }}>
                EYELOVEYOU
              </span>
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-inter)', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7ECAC3' }}>
                Punjab Optical · Est. 1987
              </span>
            </div>

            {/* Since 1987 badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(201,168,76,0.35)', padding: '8px 16px' }}>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '13px', fontWeight: 400, letterSpacing: '0.2em', color: '#C9A84C' }}>
                SINCE 1987
              </span>
            </div>

            <p style={{ color: '#8A8078', fontSize: '14px', lineHeight: 1.65, maxWidth: '260px', fontFamily: 'var(--font-inter)' }}>
              Defining the cutting edge of luxury vision care for over three decades. The ultimate destination for premium eyewear.
            </p>

            <div className="flex space-x-6">
              {[InstagramIcon, FacebookIcon, XIcon].map((Icon, i) => (
                <Link key={i} href="#" style={{ color: '#8A8078', transition: 'color 200ms ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8078')}
                  aria-label={['Instagram', 'Facebook', 'X'][i]}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          <FooterNav title="Shop" links={["Men's Frames", "Women's Frames", 'Sunglasses', 'Luxury Brands', 'New Arrivals']} />
          <FooterNav title="Support" links={['Shape & Style Guide', 'FAQs', 'Orders', 'Shipping', 'Returns & Exchanges', 'Privacy Policy', 'Terms of Service', 'Refund policy']} />
          <FooterNav title="Company" links={['Our Heritage', 'Eye Examination', 'Lens Experts', 'Store Locator', 'Careers']} />

          {/* Newsletter */}
          <div className="space-y-6">
            <div className="luxury-label" style={{ justifyContent: 'flex-start' }}>
              Join the Circle
            </div>
            <p style={{ color: '#8A8078', fontSize: '14px', fontFamily: 'var(--font-inter)', lineHeight: 1.65 }}>
              Subscribe to receive stylistic updates and vision health news.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent py-4 outline-none transition-colors"
                style={{
                  borderBottom: '1px solid rgba(201,168,76,0.20)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#C8BFB4',
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#C9A84C')}
                onBlur={(e) => (e.target.style.borderBottomColor = 'rgba(201,168,76,0.20)')}
              />
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform hover:translate-x-1"
                style={{ color: '#C9A84C' }}
                aria-label="Subscribe"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#4A4540', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            © 2026 EYELOVEYOU Punjab Optical. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Visa', 'Mastercard', 'Easypaisa', 'JazzCash'].map((method) => (
              <span key={method} style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: '#4A4540', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, links }) {
  const getSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ & /g, '-and-')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="space-y-6">
      <div className="luxury-label" style={{ justifyContent: 'flex-start' }}>{title}</div>
      <ul className="space-y-4">
        {links.map((link) => {
          const isSupport = title.toLowerCase() === 'support';
          const href = isSupport ? `/support/${getSlug(link)}` : '#';
          
          return (
            <li key={link}>
              <Link
                href={href}
                style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: '#8A8078', transition: 'color 200ms ease', display: 'block' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8078')}
              >
                {link}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
