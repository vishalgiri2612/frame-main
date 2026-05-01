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
      transition={{ delay: 0.1 * i, duration: 0.8 }}
    >
      <Link 
        href={`/shop/${p.id}`} 
        className="group flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[3/4] bg-[#FFFFFF] border border-gold/10 mb-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
          {cardImages.length > 0 ? (
            <Image 
              src={cardImages[imageIdx]} 
              alt={p.name} 
              fill 
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-[2s] group-hover:scale-[1.05]" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[8px] text-navy/20">[ NO_IMG ]</span>
            </div>
          )}
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

      <main className="container mx-auto px-6 max-w-[1800px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_0.45fr] gap-8 lg:gap-12 items-start">

          {/* LEFT: IMAGE ARCHIVE */}
          <div className="lg:sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2"
            >
              {/* Primary Image - Full Width in Grid */}
              <div className="col-span-full relative aspect-[16/10] bg-[#F6F6F6] overflow-hidden group">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain p-2 transition-transform duration-[2s] group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[10px] tracking-[0.5em] text-navy/20">[ NO_IMAGE ]</span>
                  </div>
                )}

                {/* Available Label */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#0F1117] bg-white/80 backdrop-blur-md px-3 py-1.5 uppercase font-bold">
                    {product.stockLabel || 'AVAILABLE'}
                  </span>
                </div>
              </div>

              {/* Secondary Images - 2 Column Grid */}
              {images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-[#F6F6F6] overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`${product.name} perspective ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 30vw"
                    className="object-contain p-2 transition-transform duration-[2s] group-hover:scale-105"
                  />
                </div>
              ))}

              {/* Fallback slots if less than 5 images */}
              {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-[#F6F6F6] flex items-center justify-center opacity-40">
                  <div className="w-12 h-px bg-navy/10 rotate-45" />
                </div>
              ))}
            </motion.div>

          </div>

          {/* RIGHT: SPECIFICATIONS & ACTIONS */}
          <div className="space-y-20 lg:py-6 lg:sticky lg:top-32">
            <header className="space-y-10">
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
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] tracking-[0.5em] text-gold/40 uppercase">Archive Series</span>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-7xl lg:text-8xl font-serif italic text-cream tracking-tighter leading-[0.95]"
                  >
                    {product.name}
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
                className="flex items-end justify-between gap-6"
              >
                <div className="flex flex-col">
                  {product.oldPrice > 0 && (
                    <span className="text-sm text-gold/30 line-through tracking-widest mb-1">₹{product.oldPrice?.toLocaleString('en-IN')}</span>
                  )}
                  <span className="text-6xl md:text-7xl font-light tracking-tight text-cream">₹{product.price?.toLocaleString('en-IN')}</span>
                </div>
                
                <button className="group flex flex-col items-center gap-3 mb-2">
                   <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-colors">
                      <Zap size={18} className="text-gold group-hover:scale-110 transition-transform" />
                   </div>
                   <span className="font-mono text-[8px] tracking-[0.3em] text-gold uppercase font-bold">Virtual Try-On</span>
                </button>
              </motion.div>
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-12"
            >
              {/* COMPOSITION BOX — ENRICHED WITH PRIVILEGES */}
              <div className="bg-[#FFFFFF]/5 backdrop-blur-md p-8 md:p-10 border border-gold/15 rounded-sm space-y-8 group/box">
                <div className="flex justify-between items-center border-b border-gold/15 pb-6">
                   <h3 className="font-mono text-sm tracking-[0.5em] text-gold uppercase font-black">Composition Info</h3>
                   <div className="flex flex-col items-end gap-2">
                      <span className="text-[11px] font-mono tracking-widest text-cream/40 uppercase">Curated by Punjab Optical</span>
                      <span className="text-[10px] font-mono tracking-widest text-gold/60 uppercase">Origin: Italy</span>
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-5 h-5 rounded-full border border-gold/40 flex items-center justify-center mt-1.5 bg-gold/10">
                       <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    </div>
                    <div className="space-y-3">
                       <span className="block text-xs font-mono tracking-widest text-cream/60 uppercase">Selected Archive Piece</span>
                       <p className="text-3xl md:text-4xl font-serif italic text-gold tracking-tight">{product.brand} — {product.name}</p>
                    </div>
                  </div>

                  {/* Archive Privileges */}
                  <div className="grid grid-cols-2 gap-10 pt-6 border-t border-gold/10 mt-8">
                    <div className="flex items-center gap-4 group/item">
                       <Shield size={18} className="text-gold/50 group-hover/item:text-gold transition-colors" />
                       <span className="text-[11px] font-mono tracking-widest text-cream/70 uppercase">Lifetime Warranty</span>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                       <RefreshCw size={18} className="text-gold/50 group-hover/item:text-gold transition-colors" />
                       <span className="text-[11px] font-mono tracking-widest text-cream/70 uppercase">Precision Fitting</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gold/20 flex flex-row justify-between items-center gap-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[0.4em] text-gold/50 uppercase whitespace-nowrap">Total Investment</span>
                      <span className="text-4xl md:text-6xl font-light tracking-tight text-cream whitespace-nowrap">₹{product.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <button className="relative overflow-hidden group/btn px-12 py-7 bg-gold transition-all active:scale-95 shadow-[0_10px_40px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-[#F3E2B5] to-gold animate-shimmer-sweep" style={{ backgroundSize: '200% 100%' }} />
                    <span className="relative z-10 font-mono text-xs font-black tracking-[0.6em] text-navy uppercase whitespace-nowrap">
                      Add to Bag
                    </span>
                  </button>
                </div>
              </div>

              {/* ARCHIVE NARRATIVE — SIDEBAR */}
              <section className="space-y-8 pt-12 border-t border-gold/20">
                <div className="flex items-center gap-6">
                   <h3 className="font-mono text-sm tracking-[0.6em] text-gold uppercase font-black">Archive Narrative</h3>
                   <div className="h-px flex-1 bg-gold/20" />
                </div>
                <div className="space-y-6">
                   <div className="font-mono text-xs tracking-[0.4em] text-gold/60 uppercase flex gap-12">
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] text-gold/30">Piece No</span>
                         <span className="text-cream font-bold">00{product.id || '7550'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] text-gold/30">Curated</span>
                         <span className="text-cream font-bold">EST. 1987</span>
                      </div>
                   </div>
                   <p className="text-2xl md:text-3xl font-serif italic text-cream leading-[1.4] border-l-4 border-gold/20 pl-10 py-2">
                     {product.description || "Crafted from innovative materials, this frame represents the ultimate balance of durability and style. Its sleek design suits an active lifestyle with a sophisticated edge."}
                   </p>
                </div>
              </section>

              {/* TECHNICAL SPECIFICATIONS — SIDEBAR */}
              <div className="grid gap-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-5 border-b border-gold/15 pb-4">
                    <Layers size={22} strokeWidth={1.5} className="text-gold" />
                    <h4 className="font-mono text-sm tracking-[0.4em] uppercase font-black text-cream">Frame Composition</h4>
                  </div>
                  <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                    <li className="flex flex-col gap-3">
                       <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Architecture</span>
                       <span className="text-2xl font-serif italic text-cream tracking-tight">Rectangular</span>
                    </li>
                    <li className="flex flex-col gap-3">
                       <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Primary Material</span>
                       <span className="text-2xl font-serif italic text-cream tracking-tight">High-Grade Alloy</span>
                    </li>
                    <li className="flex flex-col gap-3">
                       <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                       <span className="text-2xl font-serif italic text-cream tracking-tight">Minimalist</span>
                    </li>
                    <li className="flex flex-col gap-3">
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
                    <li className="flex flex-col gap-3">
                       <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                       <span className="text-2xl font-serif italic text-cream tracking-tight">40mm Sweep</span>
                    </li>
                    <li className="flex flex-col gap-3">
                       <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Protection</span>
                       <span className="text-2xl font-serif italic text-cream tracking-tight">UV400 Certified</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-12 border-t border-gold/10 flex justify-between gap-6 overflow-x-auto pb-4 scrollbar-none">
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
              <SimilarProductCard key={p.id} p={p} i={i} />
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <Link 
              href="/shop" 
              className="group relative px-12 py-5 overflow-hidden border border-gold/20 hover:border-gold transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 font-mono text-[10px] tracking-[0.5em] text-gold uppercase font-black flex items-center gap-4">
                Explore Full Archive
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
