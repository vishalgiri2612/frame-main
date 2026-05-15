'use client';

import Image from 'next/image';

const brandList = [
  { name: 'Ray-Ban', logo: '/brands/rayban.svg', width: 140 },
  { name: 'Oakley', logo: '/brands/oakley.svg', width: 160 },
  { name: 'Prada', logo: '/brands/prada.svg', width: 150 },
  { name: 'Emporio Armani', logo: '/brands/armani.svg', width: 180 },
  { name: 'Giorgio Armani', logo: '/brands/giorgio_armani.svg', width: 220 },
  { name: 'Valentino', logo: '/brands/valentino.svg', width: 140 },
  { name: 'Gucci', logo: '/brands/gucci.svg', width: 150 },
  { name: 'Tom Ford', logo: '/brands/tomford.svg', width: 160 },
];

export default function BrandMarquee() {
  return (
    <div
      style={{
        background: 'var(--navy-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      {/* Dual marquee with fade mask */}
      <div className="marquee-wrapper py-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Row 1 — moves left */}
        <div className="marquee-primary select-none flex items-center" aria-hidden="true">
          {[...brandList, ...brandList, ...brandList].map((brand, i) => (
            <div key={i} className="flex items-center" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
              <div
                style={{
                  position: 'relative',
                  width: `${brand.width}px`,
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  color: 'var(--text-primary)', // Use theme text color (black in light mode)
                  transition: 'opacity 300ms ease, transform 300ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Fallback to text if image fails or for development */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    color: 'inherit', // Ensure SVG currentColor works
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'block';
                  }}
                />
                <span
                  style={{
                    display: 'none',
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-primary)',
                  }}
                >
                  {brand.name}
                </span>
              </div>
              <span style={{ margin: '0 40px', color: '#C9A84C', opacity: 0.5, fontSize: '12px' }}>◆</span>
            </div>
          ))}
        </div>

        {/* Row 2 — moves right (secondary) */}
        <div className="marquee-secondary select-none flex items-center" aria-hidden="true">
          {[...brandList, ...brandList, ...brandList].reverse().map((brand, i) => (
            <div key={i} className="flex items-center" style={{ paddingLeft: '60px', paddingRight: '60px' }}>
              <div
                style={{
                  position: 'relative',
                  width: `${brand.width * 0.8}px`,
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                  color: 'var(--text-secondary)', // Subtler color for second row
                  transition: 'opacity 300ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.5';
                }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    color: 'inherit',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'block';
                  }}
                />
                <span
                  style={{
                    display: 'none',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {brand.name}
                </span>
              </div>
              <span style={{ margin: '0 40px', color: 'var(--text-tertiary)', opacity: 0.2, fontSize: '10px' }}>◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


