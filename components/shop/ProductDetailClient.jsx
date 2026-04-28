'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Shield, Zap, RefreshCw, Layers } from 'lucide-react';

export default function ProductDetailClient({ product, similarProducts }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const images = useMemo(() => {
    const list = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image].filter(Boolean);
    return [...new Set(list)].slice(0, 4);
  }, [product.image, product.images]);

  const cleanId = `${product.id?.substring(0, 15)}...`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen pt-32 pb-32 bg-navy text-cream selection:bg-gold selection:text-navy"
    >
      <div className="fixed top-0 left-1/2 -ml-px w-px h-full bg-gold/5 pointer-events-none hidden lg:block" />

      <main className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: IMAGE ARCHIVE */}
          <div className="lg:sticky top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="relative aspect-[4/3] bg-navy-surface border border-gold/10 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-50" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIdx}
                    initial={{ opacity: 0, filter: 'blur(8px)', scale: 1.02 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {images[activeImageIdx] ? (
                      <Image
                        src={images[activeImageIdx]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-[3s] ease-out group-hover:scale-[1.02]"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-navy-deep">
                        <span className="font-mono text-[10px] tracking-[0.5em] text-gold/20">[ NO_SIG_DETECTED ]</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                  <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-navy bg-gold px-4 py-1.5 uppercase font-bold shadow-[0_4px_20px_rgba(212,175,55,0.4)]">
                    {product.stockLabel || 'AVAILABLE'}
                  </span>
                </div>


              </div>

              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative aspect-[3/2] overflow-hidden border transition-all duration-500 group ${activeImageIdx === i ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-gold/10 hover:border-gold/40'
                      }`}
                  >
                    <div className={`absolute inset-0 z-10 transition-colors duration-500 ${activeImageIdx === i ? 'bg-transparent' : 'bg-navy/40 group-hover:bg-transparent'}`} />
                    <Image src={img} alt={`Thumbnail ${i + 1}`} fill className={`object-cover transition-transform duration-[2s] ${activeImageIdx === i ? 'scale-110' : 'group-hover:scale-115 grayscale group-hover:grayscale-0'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-80 z-20 pointer-events-none" />

                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: SPECIFICATIONS */}
          <div className="space-y-16 lg:py-6">
            <header className="space-y-8">
              <div className="flex items-center gap-4 text-[10px] md:text-sm font-mono tracking-[0.3em] uppercase text-gold/80 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none border-b border-gold/10">
                <Link href="/shop" className="hover:text-cream transition-colors font-bold">Catalog</Link>
                <span className="text-gold/30">/</span>
                <span className="text-cream/60 cursor-default">{product.category}</span>
                <span className="text-gold/30">/</span>
                <span className="text-cream/40 cursor-default">{product.brand}</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-cream tracking-tight leading-[1]"
              >
                {product.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row sm:items-end gap-4"
              >
                {product.oldPrice > 0 ? (
                  <>
                    <span className="text-xl md:text-2xl text-gold/40 line-through">₹{product.oldPrice?.toLocaleString('en-IN')}</span>
                    <span className="text-5xl font-light tracking-widest text-gold drop-shadow-lg">₹{product.price?.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="text-5xl font-light tracking-widest text-gold drop-shadow-lg">₹{product.price?.toLocaleString('en-IN')}</span>
                )}
                <span className="font-mono text-xs tracking-[0.3em] text-cream/40 uppercase mb-2">Net Value / Excl. Prescr. Lenses</span>
              </motion.div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-12"
            >
              <div className="bg-navy-surface/40 p-8 border border-gold/15 rounded-sm space-y-6">
                <h3 className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-gold uppercase font-black">Composition Info</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-cream/70">
                    <span className="w-2 h-2 bg-gold rounded-full" />
                    <span>Selected: {product.name} — <span className="text-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</span></span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="space-y-1">
                    <span className="block font-mono text-[9px] tracking-widest text-cream/40 uppercase">Total Value</span>
                    <span className="text-3xl font-light tracking-widest text-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
                  </div>
                  <button className="w-full sm:w-auto bg-gold text-navy px-12 py-5 font-mono text-xs font-black tracking-[0.5em] uppercase hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)] transition-all">
                    ADD TO ARCHIVE
                  </button>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-12 pt-12 border-t border-gold/20">
                {Object.entries(product.sections || {}).map(([key, specs]) => {
                  if (key === 'intro' || key === 'features' || specs.length === 0) return null;
                  return (
                    <div key={key} className="space-y-8 border-t border-gold/20 pt-12 first:border-t-0 first:pt-0">
                      <h3 className="font-mono text-xs md:text-sm tracking-[0.5em] text-gold/90 uppercase flex items-center gap-6 font-black italic">
                        {key.toUpperCase()} DESCRIPTION
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-6">
                        {specs.map((spec, i) => (
                          <div key={i} className="flex justify-between items-baseline border-b border-gold/10 pb-4 group hover:border-gold/30 transition-colors">
                            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-cream/50 uppercase group-hover:text-gold/60 transition-colors">{spec.label || 'INFO'}</span>
                            <span className="text-base md:text-lg font-light tracking-tight text-cream group-hover:text-gold-gradient transition-all">{spec.value || spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guarantees */}
              <div className="flex justify-center pt-16 border-t border-gold/20 font-mono text-[9px] md:text-xs tracking-[0.2em] text-cream/60 uppercase font-bold">
                <div className="flex flex-col items-center text-center gap-5 group">
                  <RefreshCw size={32} strokeWidth={1} className="text-gold group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
                  <span className="group-hover:text-gold transition-colors">30 Day Vision Period</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RELATED PIECES */}
        <section className="mt-40 pt-24 border-t border-gold/20">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-6">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-[0.9]">
              SIMILAR <br />
              <span className="italic font-serif text-gold">COMPOSITIONS.</span>
            </h2>
            <Link href="/shop" className="group font-mono text-[10px] tracking-[0.4em] text-gold hover:text-cream transition-all flex items-center gap-4 bg-navy-surface border border-gold/10 px-6 py-3 rounded-full hover:border-gold/30">
              VIEW ARCHIVE
              <span className="transition-transform group-hover:translate-x-2">
                <ChevronRight size={14} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {similarProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 * i, duration: 0.8 }}
              >
                <Link href={`/shop/${p.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] bg-navy-surface border border-gold/5 mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
                    {p.image && <Image src={p.image} alt={p.name} fill className="object-contain p-4 transition-transform duration-[2s] group-hover:scale-[1.05]" />}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-20" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] tracking-[0.3em] text-gold/60 uppercase">{p.brand}</span>
                    <h3 className="text-xl md:text-2xl font-serif italic tracking-tight group-hover:text-gold transition-colors">{p.name}</h3>
                    <div className="flex justify-between items-center pt-3 border-t border-cream/5">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-cream/40 uppercase">{p.category}</span>
                      <div className="flex items-center gap-3">
                      <span className="text-xl tracking-widest font-bold text-gold">₹{p.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
