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
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
          }}
        >
          Official Stockist
        </span>
        <div style={{ height: '1px', flex: 1, background: 'var(--border-subtle)' }} />
      </div>

      {/* Dual marquee with fade mask */}
      <div className="marquee-wrapper pb-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Row 1 — moves left, 40s */}
        <div className="marquee-primary select-none" aria-hidden="true">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center" style={{ paddingLeft: '48px', paddingRight: '48px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.3rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  cursor: 'default',
                  transition: 'color 300ms ease, opacity 300ms ease',
                  opacity: 0.6,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.opacity = '0.6'; }}
              >
                {brand}
              </span>
              <span style={{ margin: '0 32px', color: 'var(--gold)', opacity: 0.25, fontSize: '6px' }}>◆</span>
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
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  opacity: 0.4,
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                  transition: 'opacity 300ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
              >
                {brand}
              </span>
              <span style={{ margin: '0 32px', color: 'var(--teal)', opacity: 0.2, fontSize: '6px' }}>◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
