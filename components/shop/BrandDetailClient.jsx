'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function BrandDetailClient({ collection, products }) {
  const [visionStage, setVisionStage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timers = [
      setTimeout(() => setVisionStage(1), 800),
      setTimeout(() => setVisionStage(2), 2400),
      setTimeout(() => setVisionStage(3), 3800),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy text-cream overflow-hidden">
      <AnimatePresence>
        {visionStage < 3 && (
          <motion.div
            key="optical-overlay"
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(40px)', transition: { duration: 1.2, ease: [0.7, 0, 0.3, 1] } }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-navy"
          >
            <div className="relative flex items-center justify-center w-full">
              <motion.h1
                animate={{
                  filter: visionStage === 0 ? 'blur(60px)' : visionStage === 1 ? 'blur(30px)' : 'blur(8px)',
                  scale: visionStage === 0 ? 0.8 : visionStage === 1 ? 0.95 : 1.1,
                  opacity: visionStage === 0 ? 0.05 : visionStage === 1 ? 0.15 : 0.3,
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="text-[20vw] font-serif italic tracking-tighter text-gold select-none uppercase"
              >
                {collection.name}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ filter: visionStage < 3 ? 'blur(40px)' : 'blur(0px)', opacity: visionStage < 3 ? 0 : 1, scale: visionStage < 3 ? 1.1 : 1 }}
        transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
        className="min-h-screen"
      >
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gold/10 pb-12">
              <div className="max-w-2xl">
                <span className="text-teal uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Archive Archive</span>
                <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-6">{collection.name}</h1>
                <p className="text-xl md:text-2xl font-light text-cream/70 leading-relaxed max-w-xl italic">
                  {collection.bio || 'A legacy of precision.'}
                </p>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="text-[10px] uppercase tracking-widest text-gold mb-2">Pieces</div>
                <div className="text-4xl font-mono text-gold/60 tracking-tighter">{String(collection.count).padStart(2, '0')}</div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {!products.length && (
                <div className="md:col-span-3 border border-gold/10 bg-navy-surface p-8 text-center text-cream/50 font-mono text-[10px] tracking-[0.3em] uppercase">
                  No products matched this archive yet.
                </div>
              )}
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group bg-navy-surface border border-white/5 rounded-[40px] p-8 hover:border-gold/30 transition-all cursor-pointer overflow-hidden relative"
                >
                  <Link href={`/shop/${product.id}`} className="block">
                    <div className="aspect-[4/3] bg-navy-deep rounded-3xl mb-8 overflow-hidden relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-contain p-6 transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-cream/20 font-mono text-[10px] tracking-[0.35em]">{product.id}</div>
                      )}
                      <div className="absolute inset-0 bg-navy/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="border border-gold text-gold px-5 py-2 text-[10px] tracking-[0.3em] uppercase font-mono">View Piece</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="border border-gold/20 px-2 py-1 text-[8px] font-mono tracking-[0.2em] uppercase text-gold">{product.brand}</span>
                      <span className="border border-cream/10 px-2 py-1 text-[8px] font-mono tracking-[0.2em] uppercase text-cream/60">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <h3 className="text-xl font-serif tracking-widest mb-1">{product.name}</h3>
                        <p className="text-[10px] text-teal uppercase tracking-widest">{product.details}</p>
                      </div>
                      <span className="text-gold font-mono">₹{product.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </motion.div>
    </main>
  );
}
