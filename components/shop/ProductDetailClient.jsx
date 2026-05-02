'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Shield, Zap, RefreshCw, Layers } from 'lucide-react';

const SimilarProductCard = ({ p, i }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  const cardImages = useMemo(() => {
    const list = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [p.image].filter(Boolean);
    return [...new Set(list)].slice(0, 5);
  }, [p.image, p.images]);

  useEffect(() => {
    let timer;
    if (isHovered && cardImages.length > 1) {
      timer = setInterval(() => {
        setImageIdx((prev) => (prev + 1) % cardImages.length);
      }, 800);
    } else {
      setImageIdx(0);
    }
    return () => clearInterval(timer);
  }, [isHovered, cardImages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/shop/${p.id}`}
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden flex items-center justify-center mb-4"
        style={{ background: 'var(--navy-surface)', border: '1px solid var(--border-subtle)' }}
      >
        {cardImages.length > 0 ? (
          <Image
            src={cardImages[imageIdx]}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[8px] text-gray-300">[ NO_IMG ]</span>
          </div>
        )}

        {/* View Frame hover label */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5"
          style={{ background: 'transparent' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}
          >
            View Frame
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 transition-transform duration-500 group-hover:translate-x-5" style={{ willChange: 'transform' }}>
        <div className="flex justify-between items-end mb-1">
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            {p.brand}
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.2rem, 1.8vw, 1.4rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.2em'
          }}
        >
          {(() => {
            const words = p.name.split(' ');
            if (words.length <= 1) return <em style={{ fontStyle: 'italic' }}>{p.name}<span style={{ color: 'var(--gold)', fontStyle: 'normal', marginLeft: '2px' }}>.</span></em>;
            const firstPart = words.slice(0, -1).join(' ');
            const lastWord = words[words.length - 1];
            return (
              <>
                <span>{firstPart}</span>
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>
                  {lastWord}
                  <span style={{ color: 'var(--gold)', fontStyle: 'normal', marginLeft: '2px' }}>.</span>
                </em>
              </>
            );
          })()}
        </h3>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            display: 'block',
          }}
        >
          {!p.price || p.price <= 0 ? 'Price on Request' : `₹ ${p.price.toLocaleString('en-IN')}`}
        </span>
      </div>
    </motion.div>
  );
};

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
    return [...new Set(list)].slice(0, 5);
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

      <main className="container mx-auto px-6 max-w-[1600px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE ARCHIVE */}
          <div className="lg:sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-[2px] bg-[var(--border-subtle)]"
            >
              {/* Row 1: Full Width Hero */}
              <div
                className="relative aspect-[4/3] bg-[var(--navy-deep)] overflow-hidden group w-full cursor-pointer"
                onClick={() => setActiveImageIdx(0)}
              >
                {images[activeImageIdx] || images[0] ? (
                  <Image
                    src={images[activeImageIdx] || images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-8 transition-transform duration-[2s] group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[10px] tracking-[0.5em] text-navy/20">[ NO_IMAGE ]</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-20">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[var(--text-primary)] bg-[var(--navy-surface)]/80 backdrop-blur-md px-3 py-1.5 uppercase font-bold">
                    {product.stockLabel || 'IN STOCK'}
                  </span>
                </div>
              </div>

              {/* Row 2: Images 2 & 3 */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 gap-[2px]">
                  {[images[1], images[2]].map((img, i) =>
                    img ? (
                      <div
                        key={i}
                        className="relative aspect-square bg-[var(--navy-deep)] overflow-hidden group cursor-pointer"
                        onClick={() => setActiveImageIdx(i + 1)}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${i + 2}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div key={i} className="aspect-square bg-[var(--navy-deep)]" />
                    )
                  )}
                </div>
              )}

              {/* Row 3: Images 4 & 5 */}
              {images.length > 3 && (
                <div className="grid grid-cols-2 gap-[2px]">
                  {[images[3], images[4]].map((img, i) =>
                    img ? (
                      <div
                        key={i}
                        className="relative aspect-square bg-[var(--navy-deep)] overflow-hidden group cursor-pointer"
                        onClick={() => setActiveImageIdx(i + 3)}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} view ${i + 4}`}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div key={i} className="aspect-square bg-[var(--navy-deep)]" />
                    )
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT: SPECIFICATIONS & ACTIONS */}
          <div className="space-y-16 lg:py-6 lg:sticky lg:top-32">
            <header className="space-y-8 w-full">
              <div className="flex justify-between items-center border-b border-gold/10 pb-4">
                <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.4em] uppercase text-gold/60">
                  <Link href="/shop" className="hover:text-gold transition-colors font-bold">Catalog</Link>
                  <span className="opacity-20">/</span>
                  <span className="text-cream/80">{product.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase font-bold">Limited Vault Edition</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[9px] tracking-[0.5em] text-gold uppercase">Archive Series</span>
                    <span className="h-px w-12 bg-gold/20" />
                  </div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-cream tracking-tight leading-[0.95] uppercase"
                  >
                    <span className="block text-6xl md:text-7xl lg:text-8xl font-normal" style={{ fontFamily: 'var(--font-cormorant)' }}>{product.brand}</span>
                    <span className="block text-5xl md:text-6xl lg:text-7xl italic font-light text-gold/90 mt-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {product.name?.replace(product.brand, '').trim() || 'Signature Piece'}
                      <span style={{ fontStyle: 'normal' }}>.</span>
                    </span>
                  </motion.h1>
                </div>

                <div className="flex flex-wrap gap-3">
                  {['Handcrafted', 'High-Grade Alloy', 'Signature Tint'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gold/5 border border-gold/10 rounded-full font-mono text-[8px] tracking-widest text-gold/70 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-48 mt-8">
                  <div className="flex flex-col">
                    {product.oldPrice > 0 && (
                      <span className="text-sm text-gold/30 line-through tracking-widest mb-1">₹{product.oldPrice?.toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-4xl md:text-5xl font-light tracking-tight text-cream">₹{product.price?.toLocaleString('en-IN')}</span>
                  </div>

                  <button className="relative overflow-hidden group/btn px-16 py-4 bg-[#E6D5B8] border border-gold/20 rounded-full transition-all active:scale-95 shadow-[0_15px_40px_rgba(212,175,55,0.15)] hover:bg-[#F3E2B5] hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 font-mono text-[11px] font-black tracking-[0.4em] text-[#0F1117] uppercase whitespace-nowrap">
                      Buy Now
                    </span>
                  </button>
                </div>
              </motion.div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-10"
            >
              {/* COMPOSITION BOX — ENRICHED WITH PRIVILEGES */}


              {/* ARCHIVE NARRATIVE — SIDEBAR */}


              {/* TECHNICAL SPECIFICATIONS — SIDEBAR */}
              <div className="grid gap-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-5 border-b border-gold/15 pb-4">
                    <Layers size={22} strokeWidth={1.5} className="text-gold" />
                    <h4 className="font-mono text-sm tracking-[0.4em] uppercase font-black text-cream">Frame Composition</h4>
                  </div>
                  <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Architecture</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">Rectangular</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Primary Material</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">High-Grade Alloy</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">Minimalist</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Finish</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">Matte / Polished</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-5 border-b border-gold/15 pb-4">
                    <Shield size={22} strokeWidth={1.5} className="text-gold" />
                    <h4 className="font-mono text-sm tracking-[0.4em] uppercase font-black text-cream">Optic Archive</h4>
                  </div>
                  <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">40mm Sweep</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Protection</span>
                      <span className="text-2xl font-serif italic text-cream tracking-tight">UV400 Certified</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-gold/10 flex justify-start gap-10 overflow-x-auto pb-2 scrollbar-none">
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <Layers size={20} className="text-gold" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">Signature Case</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <RefreshCw size={20} className="text-gold" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">Optical Cloth</span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <RefreshCw size={26} strokeWidth={1} className="text-gold/80" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">30 Day Vision</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>



        {/* SIMILAR PRODUCTS */}
        <section className="mt-20 pt-16 border-t border-gold/10" style={{ background: 'var(--navy-deep)' }}>
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 gap-4 px-2">
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              You May Also Like
            </h2>
            <Link
              href="/shop"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              View All
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-2">
            {similarProducts.map((p, i) => (
              <SimilarProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
