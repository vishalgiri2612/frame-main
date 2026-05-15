'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function ArrivalsClient({ products = [] }) {
  return (
    <div className="min-h-screen pt-32 pb-24 selection:bg-gold selection:text-navy" style={{ background: 'var(--navy)', color: 'var(--text-primary)' }}>
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23C9A84C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      <div className="fixed top-0 left-1/2 -ml-px w-px h-full pointer-events-none hidden lg:block" style={{ background: 'var(--border-subtle)' }} />

      <main className="container mx-auto px-4 sm:px-6 max-w-[1400px] relative z-10">
        <header className="mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-[9px] sm:text-xs tracking-[0.4em] uppercase text-[var(--text-tertiary)]"
          >
            <span className="w-12 h-px bg-[var(--gold)]" />
            Season Premiere
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.85]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              NEW <br />
              <span className="italic text-gold">ARRIVALS.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-md text-sm sm:text-base text-[var(--text-tertiary)] font-light leading-relaxed tracking-wide"
            >
              Discover our latest drop. A curated selection of avant-garde frames designed for the modern visionary. Handcrafted excellence meets timeless aesthetic.
            </motion.p>
          </div>
        </header>

        {products.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-gold/10 rounded-3xl">
            <p className="text-gold/40 font-mono tracking-widest uppercase">The next drop is coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-20">
            {products.map((product, idx) => (
              <ProductCard key={product.id || product.sku} product={product} index={idx} />
            ))}
          </div>
        )}

        {/* Explore More Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 pt-20 border-t border-gold/10 flex flex-col items-center gap-10"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>Continue the Journey</h2>
            <p className="text-xs sm:text-sm text-[var(--text-tertiary)] tracking-widest uppercase">Explore the full FRAME archive</p>
          </div>
          
          <Link href="/shop" className="group relative px-16 py-6 overflow-hidden transition-all duration-700">
            <div className="absolute inset-0 border border-gold/30 group-hover:border-gold group-hover:scale-[1.05] transition-all duration-700" />
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <span className="text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase text-gold group-hover:text-navy transition-colors duration-500">Explore All Pieces</span>
              <ArrowRight className="w-4 h-4 text-gold group-hover:text-navy group-hover:translate-x-2 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
