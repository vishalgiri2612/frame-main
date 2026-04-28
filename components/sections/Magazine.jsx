'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const articles = [
  {
    tag: 'Style Guide',
    title: 'Framing Your Identity: The Art of Luxury Spectacles',
    excerpt: 'How the right frame transforms not just how you see the world, but how the world sees you.',
    image: '/magazine/editorial.png',
    readTime: '8 min',
  },
  {
    tag: 'Craftsmanship',
    title: 'The Hands Behind the Polish: 90 Days of Acetate Curing',
    excerpt: 'Inside the atelier where patience meets precision.',
    image: '/magazine/craftsmanship.png',
    readTime: '5 min',
  },
  {
    tag: 'Brand Spotlight',
    title: 'Cartier: The Legacy of the Panthère Silhouette',
    excerpt: 'A century of feline elegance in optical design.',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min',
  },
];

export default function Magazine() {
  return (
    <section className="py-28 relative overflow-hidden border-t border-gold/5">
      {/* Ambient glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-teal/40" />
              <span className="text-teal uppercase tracking-[0.5em] text-[9px] font-bold">The Lookbook</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight text-cream leading-[0.95]">
              Editorial<br />
              <span className="italic text-gold">Journal</span>
            </h2>
          </div>
          <Link
            href="/magazine"
            className="group flex items-center gap-3 text-gold/60 hover:text-gold transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.4em]">Read the Journal</span>
            <motion.span className="inline-block" whileHover={{ x: 4 }}>→</motion.span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Book Preview — Left Side */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <Link href="/magazine" className="group block">
              <motion.div
                whileHover={{ y: -8, rotateY: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative mx-auto"
                style={{ perspective: '800px' }}
              >
                {/* Book Shadow */}
                <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-[16px] rounded-full" />

                {/* Book Cover */}
                <div className="relative w-[240px] md:w-[280px] aspect-[3/4] rounded-sm overflow-hidden shadow-2xl border border-white/5">
                  <Image
                    src="/magazine/cover.png"
                    alt="Journal of Sight Vol. IV"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="280px"
                  />
                  {/* Spine edge effect */}
                  <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
                  {/* Gloss effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Stacked pages behind */}
                <div className="absolute -bottom-1 -right-1 w-full h-full border border-white/5 rounded-sm bg-navy-deep -z-10" />
                <div className="absolute -bottom-2 -right-2 w-full h-full border border-white/5 rounded-sm bg-navy-deep -z-20" />
              </motion.div>

              {/* Book Meta */}
              <div className="text-center mt-8">
                <p className="font-serif italic text-xl text-cream group-hover:text-gold transition-colors">Journal of Sight</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-cream/30 mt-2">Vol. IV — Masterworks</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-gold/50 group-hover:text-gold/80 transition-colors">
                  <span>Read Now</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Articles — Right Side */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {articles.map((article, i) => (
              <Link key={i} href="/magazine" className="block group">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-48 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 py-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-teal text-[8px] uppercase tracking-[0.3em] font-bold">{article.tag}</span>
                      <span className="text-[8px] font-mono text-cream/20 tracking-widest">{article.readTime} read</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-cream leading-snug group-hover:text-gold transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-cream/40 mt-2 leading-relaxed hidden sm:block">
                      {article.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-widest text-gold/40 group-hover:text-gold/70 transition-colors">
                      <span>Read Article</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Issue number */}
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-gold/10 group-hover:border-gold/30 transition-colors shrink-0 self-center">
                    <span className="font-mono text-[10px] text-cream/30 group-hover:text-gold transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                {i < articles.length - 1 && (
                  <div className="h-px bg-gold/5 mt-6" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
