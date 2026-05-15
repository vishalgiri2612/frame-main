'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

function CategoryImageSlideshow({ images, alt, categoryName }) {
  const [index, setIndex] = useState(0);
  const displayImages = images?.filter(Boolean) || [];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  if (displayImages.length === 0) {
    return (
      <div className="w-full h-full bg-navy-surface flex items-center justify-center">
        <span className="font-mono text-[10px] text-gold/20 tracking-widest uppercase">No Visuals Available</span>
      </div>
    );
  }

  return (
    <Link href={`/shop?category=${encodeURIComponent(categoryName)}`} className="block w-full h-full relative group">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={displayImages[index]}
          alt={`${alt} view ${index + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-full h-full object-contain object-center absolute inset-0 p-12 md:p-20 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/40 to-transparent pointer-events-none md:hidden" />
      <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-700" />

      {/* Slideshow Progress Indicators */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayImages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-gold' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

export default function CategoriesClient({ categories, productCount }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="min-h-screen pt-6 pb-20 bg-navy text-cream"
    >
      <main className="container mx-auto px-6">
        <section className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gold/20 pb-4">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-gold">FORM & FUNCTION</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter">
              AESTHETIC <br /><span className="italic font-serif text-gold">ARCHITECTURES.</span>
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-mono text-[10px] tracking-[0.2em] uppercase text-right text-cream/50 space-y-2">
            <p>Categories: {String(categories.length).padStart(2, '0')}</p>
            <p>Total Assets: {productCount}</p>
          </motion.div>
        </section>

        <section className="flex flex-col gap-4">
          {categories
            .sort((a, b) => {
              if (a.name === 'SUNGLASSES') return -1;
              if (b.name === 'SUNGLASSES') return 1;
              return a.name.localeCompare(b.name);
            })
            .map((category, idx) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="group relative"
              >
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4 min-h-[200px]">

                  {/* Information (Open Layout) */}
                  <div className={`w-full md:w-1/2 flex flex-col justify-center ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] tracking-[0.5em] text-gold uppercase">Series 0{idx + 1}</span>
                        <div className="h-px w-12 bg-gold/30" />
                        <span className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase">{category.count} ARCHIVES</span>
                      </div>

                      <Link href={`/shop?category=${encodeURIComponent(category.name)}`} className="block group/title">
                        <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.9] mb-4 transition-all duration-700 group-hover/title:text-gold">
                          {category.name}
                        </h2>
                      </Link>

                      <p className="font-light text-lg text-cream/60 max-w-sm leading-relaxed border-l border-gold/20 pl-6">
                        A curated study in {category.name?.toLowerCase()}, balancing structural innovation with iconic silhouettes.
                      </p>

                      <Link
                        href={`/shop?category=${encodeURIComponent(category.name)}`}
                        className="group/btn inline-flex items-center gap-6 mt-4"
                      >
                        <div className="relative px-10 py-4 overflow-hidden border border-gold/50 rounded-full transition-all duration-500 group-hover/btn:border-gold group-hover/btn:shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                          {/* Background Slide Effect */}
                          <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />

                          <div className="relative z-10 flex items-center gap-3">
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-gold group-hover/btn:text-navy transition-colors duration-500">
                              Explore Archives
                            </span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="text-gold group-hover/btn:text-navy transition-colors duration-500"
                            >
                              →
                            </motion.span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Visual Slideshow (Floating - No Box) */}
                  <div className={`w-full md:w-1/2 relative h-[300px] md:h-[450px] ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="w-full h-full relative overflow-hidden">
                      <CategoryImageSlideshow
                        images={category.images}
                        alt={category.name}
                        categoryName={category.name}
                      />
                    </div>

                    {/* Subtle Floating Accent Line */}
                    <div className={`absolute bottom-0 ${idx % 2 === 0 ? 'right-0' : 'left-0'} w-24 h-px bg-gold/30 -z-10`} />
                  </div>

                </div>
              </motion.div>
            ))}
        </section>
      </main>
    </motion.div>
  );
}
