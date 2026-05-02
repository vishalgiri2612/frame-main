'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

/* ─── Article Data ─────────────────────────────────────────────── */
const hero = {
  tag: 'Style Guide',
  issue: 'Issue IV',
  title: 'Framing Your Identity: The Art of Luxury Spectacles',
  excerpt:
    'How the right frame transforms not just how you see the world — but how the world sees you. A deep dive into the philosophy of personal optics.',
  image: '/magazine/editorial.png',
  readTime: '8 min',
};

const articles = [
  {
    tag: 'Craftsmanship',
    issue: 'Issue III',
    title: 'The Hands Behind the Polish: 90 Days of Acetate Curing',
    excerpt: 'Inside the atelier where patience meets precision and every frame tells a story.',
    image: '/magazine/craftsmanship.png',
    readTime: '5 min',
  },
  {
    tag: 'Brand Spotlight',
    issue: 'Issue II',
    title: 'Cartier: The Legacy of the Panthère Silhouette',
    excerpt: 'A century of feline elegance in optical design — and what it means today.',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=600',
    readTime: '6 min',
  },
  {
    tag: 'Trend Report',
    issue: 'Issue I',
    title: 'The Return of Aviators: Reviving the Golden Age',
    excerpt: 'Why the iconic silhouette is reclaiming its throne in modern luxury eyewear.',
    image: '/magazine/cover.png',
    readTime: '4 min',
  },
];

/* ─── Animation Variants ────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Sub-components ────────────────────────────────────────────── */

function SectionTag({ label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-gold/50" />
      <span
        className="text-gold uppercase tracking-[0.55em] text-[8px] font-bold"
        style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
      >
        {label}
      </span>
      <div className="w-8 h-px bg-gold/50" />
    </div>
  );
}

function IssueChip({ label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gold/20 text-gold/50 text-[8px] uppercase tracking-[0.35em]"
      style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
    >
      <span className="w-1 h-1 rounded-full bg-gold/40 inline-block" />
      {label}
    </span>
  );
}

/* ─── Hero Feature Card ─────────────────────────────────────────── */
function HeroFeature({ article }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="relative w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl group"
      style={{ aspectRatio: '16/9', minHeight: '480px', maxHeight: '600px' }}
    >
      {/* Parallax Image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
      </motion.div>

      {/* Cinematic Overlays — Locked to dark for contrast on image */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/95 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060810]/40 to-transparent" />

      {/* Shimmer line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="flex items-center gap-4 mb-5">
          <IssueChip label={article.issue} />
          <span className="text-teal-light text-[8px] uppercase tracking-[0.35em] font-bold">
            {article.tag}
          </span>
          <span className="text-white/40 font-mono text-[8px]">· {article.readTime} read</span>
        </div>

        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] max-w-3xl group-hover:text-gold transition-colors duration-500">
          {article.title}
        </h3>

        <p className="mt-4 text-white/60 text-sm md:text-base max-w-xl leading-relaxed hidden md:block">
          {article.excerpt}
        </p>

        <motion.div
          className="mt-7 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold/60 group-hover:text-gold transition-colors"
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <span>Read Feature</span>
          <span>→</span>
        </motion.div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center">
          <span className="font-mono text-[9px] text-gold/50">01</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Small Article Card ────────────────────────────────────────── */
function ArticleCard({ article, index }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      custom={index * 0.5}
    >
      <Link href="/magazine" className="group block">
        <div className="flex gap-5 items-start">
          {/* Thumbnail */}
          <div className="relative w-24 h-20 md:w-28 md:h-24 shrink-0 rounded-xl overflow-hidden border border-white/5">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="112px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Gloss */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <IssueChip label={article.issue} />
            </div>
            <p className="text-teal/80 text-[7px] uppercase tracking-[0.35em] font-bold mb-1.5">
              {article.tag} · {article.readTime} read
            </p>
            <h4 className="font-serif text-base md:text-lg text-cream leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
              {article.title}
            </h4>
            <div className="mt-2.5 flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-gold/40 group-hover:text-gold/70 transition-colors">
              <span>Read Article</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </div>
          </div>

          {/* Issue Number */}
          <div className="hidden md:flex items-center justify-center w-8 h-8 shrink-0 rounded-full border border-gold/10 group-hover:border-gold/30 transition-colors self-center">
            <span className="font-mono text-[9px] text-cream/25 group-hover:text-gold transition-colors">
              {String(index + 2).padStart(2, '0')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Export ───────────────────────────────────────────────── */
export default function Magazine() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-white/5 bg-[var(--navy)]">
      {/* Background ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-teal/[0.04] blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gold/[0.04] blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">

        {/* ── Section Header ── */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div>
            <SectionTag label="The Lookbook" />
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.9] tracking-tight">
              Editorial
              <br />
              <span className="italic text-gold">Journal</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-cream/35 text-sm max-w-xs md:text-right hidden md:block leading-relaxed">
              Curated stories on style, craft, and the world of luxury eyewear.
            </p>
            <Link
              href="/magazine"
              className="group flex items-center gap-3 text-gold/60 hover:text-gold transition-colors"
            >
              <span className="text-[9px] uppercase tracking-[0.45em]">View All Issues</span>
              <motion.span
                className="inline-block"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* ── Main Grid: Hero + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Hero Feature — 7 cols */}
          <div className="lg:col-span-7">
            <Link href="/magazine" className="block">
              <HeroFeature article={hero} />
            </Link>
          </div>

          {/* Right Sidebar — 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-0">

            {/* Latest Issue Book Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-8"
            >
              <Link href="/magazine" className="group block">
                <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[var(--navy-surface)]/50 backdrop-blur-sm p-5 flex items-center gap-5 hover:border-gold/20 transition-all duration-500 shadow-sm hover:shadow-md">
                  {/* Mini book cover */}
                  <motion.div
                    whileHover={{ y: -4, rotateY: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="relative shrink-0"
                    style={{ perspective: '600px' }}
                  >
                    <div className="relative w-[90px] aspect-[3/4] rounded overflow-hidden shadow-xl border border-white/10">
                      <Image src="/magazine/cover.png" alt="Cover" fill className="object-cover" sizes="90px" />
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    {/* Page stack */}
                    <div className="absolute -bottom-0.5 -right-1 w-full h-full border border-white/5 rounded bg-[var(--navy-surface)] -z-10" />
                  </motion.div>

                  <div className="flex-1">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-gold/40 mb-1">Current Issue</p>
                    <p className="font-serif italic text-xl text-cream group-hover:text-gold transition-colors duration-300">
                      Journal of Sight
                    </p>
                    <p className="font-mono text-[8px] uppercase tracking-[0.35em] text-cream/25 mt-1">
                      Vol. IV — Masterworks
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[8px] uppercase tracking-widest text-gold/50 group-hover:text-gold/80 transition-colors">
                      <span>Read Now</span>
                      <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                    </div>
                  </div>

                  {/* Shimmer border on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </Link>
            </motion.div>

            {/* Gold Divider with label */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-7"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
              <span className="text-[7px] uppercase tracking-[0.5em] text-gold/30">More Stories</span>
              <div className="flex-1 h-px bg-gradient-to-l from-gold/20 to-transparent" />
            </motion.div>

            {/* Article List */}
            <div className="flex flex-col gap-7">
              {articles.map((article, i) => (
                <div key={i}>
                  <ArticleCard article={article} index={i} />
                  {i < articles.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent mt-7" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA Strip ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.4}
          className="mt-16 rounded-2xl border border-gold/10 bg-[var(--navy-surface)]/30 backdrop-blur-sm px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div>
            <p className="text-cream/60 text-sm">Never miss an issue</p>
            <p className="font-serif text-2xl text-cream mt-0.5">
              Subscribe to the <span className="italic text-gold">Journal</span>
            </p>
          </div>
          <Link
            href="/magazine"
            className="group relative flex items-center gap-3 px-7 py-3 rounded-full border border-gold/30 hover:border-gold/70 text-gold text-[9px] uppercase tracking-[0.45em] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--gold-rgb),0.15)]"
          >
            <span className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Explore the Archive</span>
            <motion.span
              className="relative inline-block"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
