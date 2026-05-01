'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const collections = [
  {
    id: 'men',
    label: "Men's Collection",
    subtext: 'Bold. Refined. Authoritative.',
    href: '/shop?category=MEN',
    image: '/men-collection.png',
    accent: 'from-[#0F1117]/90 via-[#0F1117]/50 to-transparent',
    tag: 'MEN',
  },
  {
    id: 'women',
    label: "Women's Collection",
    subtext: 'Elegance Redefined.',
    href: '/shop?category=WOMEN',
    image: '/women-collection.png',
    accent: 'from-[#0F1117]/90 via-[#0F1117]/50 to-transparent',
    tag: 'WOMEN',
  },
  {
    id: 'kids',
    label: "Children's Collection",
    subtext: 'Playful. Protected. Premium.',
    href: '/shop?category=KIDS',
    image: '/kids-collection.png',
    accent: 'from-[#0F1117]/90 via-[#0F1117]/50 to-transparent',
    tag: 'KIDS',
  },
];

const CollectionCard = ({ col, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={col.href} className="block w-full h-full">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0F1117]">
          <Image
            src={col.image}
            alt={col.label}
            fill
            className={`object-cover transition-transform duration-[2.5s] ease-out ${hovered ? 'scale-110' : 'scale-100'}`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Dark gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${col.accent} transition-opacity duration-700`} />

          {/* Gold shimmer line on hover */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-700 ${hovered ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          />

          {/* Top tag */}
          <div className="absolute top-8 left-8 z-20">
            <span className="font-mono text-[10px] tracking-[0.5em] text-white font-bold uppercase bg-black/30 px-3 py-1.5 backdrop-blur-sm">
              {col.tag}
            </span>
          </div>

          {/* Bottom label area */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            {/* Subtext — slides in on hover */}
            <motion.p
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase mb-4 font-bold"
            >
              {col.subtext}
            </motion.p>

            <h3 className="font-serif italic text-white font-black text-4xl md:text-5xl tracking-tight leading-none mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {col.label}
            </h3>

            {/* Explore CTA */}
            <div className={`flex items-center gap-3 transition-all duration-500 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
              <div className="h-px w-8 bg-gold" />
              <span className="font-mono text-[9px] tracking-[0.4em] text-gold uppercase">Explore</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function CollectionGallery() {
  return (
    <section className="relative bg-[#0F1117] py-0 overflow-hidden">
      {/* Background texture line */}
      <div className="absolute top-0 left-1/2 -ml-px w-px h-full bg-gold/5 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[1600px]">
        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <CollectionCard key={col.id} col={col} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
