'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function BrandShowcase({ brands = [] }) {
  if (!brands || brands.length === 0) return null;
  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-10 bg-navy relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px bg-gold/40" />
              <span className="text-teal uppercase tracking-[0.5em] text-[9px] font-bold">By Heritage</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tight text-cream leading-[0.95]">
              Curated<br />
              <span className="italic text-gold">Maisons</span>
            </h2>
          </div>

          <Link
            href="/brands"
            className="group flex items-center gap-3 text-cream/50 hover:text-gold transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">All Brands</span>
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
            >
              →
            </motion.span>
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-5 md:gap-6 auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[300px]">
          {brands.map((brand, index) => {
            let layoutClass = "col-span-1 md:col-span-3";
            let isHero = false;

            if (index === 0) {
               layoutClass = "col-span-2 row-span-2 md:col-span-7 md:row-span-2";
               isHero = true;
            } else if (index === 1 || index === 2) {
               layoutClass = "col-span-1 md:col-span-5";
            }

            return (
              <BrandCard
                key={brand._id || brand.slug}
                data={brand}
                className={layoutClass}
                isHero={isHero}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ data, className = '', isHero = false }) {
  return (
    <Link href={`/brand/${data.slug}`} className={`block ${className}`}>
      <motion.div
        whileHover="hover"
        initial="rest"
        className={`relative w-full h-full rounded-[2rem] overflow-hidden cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-[#111111] border border-white/5`}
      >
        {/* 3D Dark Studio Lighting Background */}
        <div className="absolute inset-0 bg-[#0a0a0a] z-0" />

        {/* Subtle accent spotlight on hover */}
        <div
          className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${data.accent}40, transparent 70%), radial-gradient(circle at 50% 100%, #ffffff05, transparent 50%)` }}
        />

        {/* Inner 3D Bevel/Shadow for Depth */}
        <div className="absolute inset-0 z-10 shadow-[inset_0_2px_15px_rgba(255,255,255,0.05),inset_0_-5px_20px_rgba(0,0,0,0.8)] rounded-[2rem] pointer-events-none" />

        {/* Floating Product Image */}
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 z-20 pointer-events-none">
          <motion.div
            className="relative w-full h-full"
            variants={{
              rest: { scale: 1, y: 0 },
              hover: { scale: 1.15, y: -10 }
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={data.image}
              alt={data.name}
              fill
              className="object-contain filter drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </motion.div>
        </div>

        {/* Year Badge */}
        <div className="absolute top-5 right-5 md:top-6 md:right-6 z-30 bg-[#1a1a1a]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
          <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/70 transition-colors drop-shadow-sm">
            EST. {data.year}
          </span>
        </div>

        {/* Content Section */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          {/* Origin */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: data.accent }} />
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/60 font-bold truncate">
              {data.origin}
            </span>
          </div>

          {/* Brand Name */}
          <motion.h3
            className={`font-serif text-white tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${isHero ? 'text-5xl md:text-7xl' : 'text-3xl md:text-4xl'}`}
            variants={{
              rest: { x: 0 },
              hover: { x: 8 }
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.name}
          </motion.h3>

          {/* Expandable footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors gap-2">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 transition-colors font-bold">
              {data.count} Styles
            </span>

            <motion.div
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold text-white"
            >
              <span style={{ color: data.accent }}>Explore Collection</span>
              <motion.span
                variants={{
                  rest: { x: 0 },
                  hover: { x: 5 },
                }}
                transition={{ duration: 0.4 }}
                style={{ color: data.accent }}
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
