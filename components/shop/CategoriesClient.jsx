'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoriesClient({ categories, productCount }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="min-h-screen pt-32 pb-32 bg-navy text-cream"
    >
      <main className="container mx-auto px-6">
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gold/20 pb-12">
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {categories.map((category, idx) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.7 }}
              className="group border-t border-gold/10 pt-8 transition-colors duration-500 hover:border-gold"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-[10px] tracking-[0.2em] text-cream/40">0{idx + 1}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-gold">{category.count} ITEMS</span>
              </div>
              <Link href={`/shop?category=${encodeURIComponent(category.name)}`} className="block">
                <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-4 group-hover:italic group-hover:font-serif group-hover:text-gold transition-all duration-300">
                  {category.name}
                </h2>
              </Link>
              <p className="font-mono text-[10px] tracking-[0.1em] text-cream/50 uppercase max-w-sm">
                View products tagged for {category.name?.toLowerCase()}.
              </p>
            </motion.div>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
