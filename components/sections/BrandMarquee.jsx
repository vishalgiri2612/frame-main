'use client';

const brands = [
  'Ray-Ban', 'Oakley', 'Cartier', 'Tom Ford', 'Persol', 'Prada',
  'Lindberg', 'Silhouette', 'Dior', 'Gucci', 'Lafont', 'Maui Jim',
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
      {/* Label */}
      <div className="container mx-auto px-6 pt-6 pb-4 flex items-center gap-4">
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#111111',
          }}
        >
          Official Stockist
        </span>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(17,17,17,0.3), transparent)' }} />
      </div>

      {/* Dual marquee with fade mask */}
      <div className="marquee-wrapper pb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Row 1 — moves left, 40s */}
        <div className="marquee-primary select-none" aria-hidden="true">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center" style={{ paddingLeft: '48px', paddingRight: '48px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#111111',
                  cursor: 'default',
                  transition: 'color 300ms ease, transform 300ms ease',
                  opacity: 1,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.color = '#C9A84C';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.color = '#111111';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {brand}
              </span>
              <span style={{ margin: '0 32px', color: '#C9A84C', opacity: 0.8, fontSize: '10px' }}>◆</span>
            </div>
          ))}
        </div>

        {/* Row 2 — moves right, 60s (secondary, slower = more premium) */}
        <div className="marquee-secondary select-none" aria-hidden="true">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center" style={{ paddingLeft: '48px', paddingRight: '48px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  opacity: 0.9,
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                  transition: 'color 300ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#111111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#C9A84C';
                }}
              >
                {brand}
              </span>
              <span style={{ margin: '0 32px', color: '#111111', opacity: 0.3, fontSize: '8px' }}>◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
