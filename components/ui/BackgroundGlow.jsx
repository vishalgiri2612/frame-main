'use client';

/**
 * BackgroundGlow — static radial gradients only.
 * NO filter:blur animation (it's the #1 GPU perf killer).
 * The gradients themselves provide the soft atmospheric effect.
 */
export default function BackgroundGlow() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      {/* Gold — top right, static */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '80vw',
          height: '80vh',
          background:
            'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Teal — bottom left, static */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '70vw',
          height: '70vh',
          background:
            'radial-gradient(ellipse at center, rgba(46,116,112,0.05) 0%, rgba(46,116,112,0.01) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
