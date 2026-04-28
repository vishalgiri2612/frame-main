'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const brands = [
  { slug: 'ray-ban', location: 'Milan, Italy', name: 'Ray-Ban', year: '1937', styles: 142, image: '/brands/rayban.png', accent: '#C41E3A' },
  { slug: 'oakley', location: 'California, USA', name: 'Oakley', year: '1975', styles: 89, image: '/brands/oakley.png', accent: '#F26F21' },
  { slug: 'gucci', location: 'Florence, Italy', name: 'Gucci', year: '1921', styles: 112, image: '/brands/gucci.png', accent: '#00A86B' },
  { slug: 'prada', location: 'Milan, Italy', name: 'Prada', year: '1913', styles: 76, image: '/brands/prada.png', accent: '#C9A84C' },
  { slug: 'versace', location: 'Reggio Calabria, Italy', name: 'Versace', year: '1978', styles: 94, image: '/brands/versace.png', accent: '#FFD700' },
  { slug: 'tom-ford', location: 'Austin, USA', name: 'Tom Ford', year: '2005', styles: 65, image: '/brands/tomford.png', accent: '#8B7355' },
  { slug: 'carrera', location: 'Verona, Italy', name: 'Carrera', year: '1956', styles: 54, image: '/brands/carrera.png', accent: '#1E90FF' },
];

export default function BrandsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen pt-32 pb-32 text-cream transition-colors duration-700"
    >
      <main className="container mx-auto px-6">
        {/* Hero Header */}
        <section className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-gold/15">
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-4">
              <span className="w-10 h-px bg-gold/40" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-teal">By Heritage</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight"
            >
              Curated<br />
              <span className="italic text-gold">Maisons</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-cream/40 max-w-md text-sm leading-relaxed"
            >
              Seven legendary houses, each with a distinct vision for eyewear excellence.
              Explore heritage collections spanning over a century of craftsmanship.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-end gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif text-gold">{brands.length}</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-cream/30">Partner Houses</span>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.4em] text-gold/60 hover:text-gold transition-colors flex items-center gap-2">
              Explore All Brands <span>→</span>
            </Link>
          </motion.div>
        </section>

        {/* Brand Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {brands.map((brand, idx) => (
            <Link key={brand.slug} href={`/brand/${brand.slug}`} className={idx === 0 ? 'md:col-span-2' : ''}>
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.65 }}
                whileHover="hover"
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{ minHeight: idx === 0 ? '420px' : '320px' }}
              >
                {/* Background Image */}
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={idx === 0 ? '100vw' : '50vw'}
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
                  style={{ background: `linear-gradient(135deg, ${brand.accent}20 0%, transparent 60%)` }}
                />

                {/* Accent top line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] z-20 origin-left"
                  style={{ backgroundColor: brand.accent }}
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  initial="rest"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Year badge */}
                <div className="absolute top-5 right-6 z-20">
                  <span className="text-[9px] font-mono tracking-widest text-white/25 group-hover:text-white/50 transition-colors">
                    EST. {brand.year}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full opacity-60" style={{ backgroundColor: brand.accent }} />
                    <span className="text-[8px] uppercase tracking-[0.3em] text-white/35 font-mono">{brand.location}</span>
                  </div>

                  <h2 className={`font-serif text-white tracking-tight leading-none ${idx === 0 ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'}`}>
                    {brand.name}
                  </h2>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                      {brand.styles} Styles
                    </span>
                    <motion.div
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: brand.accent }}
                    >
                      <span>Explore</span>
                      <motion.span variants={{ rest: { x: 0 }, hover: { x: 4 } }} transition={{ duration: 0.3 }}>→</motion.span>
                    </motion.div>
                  </div>
                </div>

                {/* Inner border glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-all duration-500 z-20 pointer-events-none" />
              </motion.article>
            </Link>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
