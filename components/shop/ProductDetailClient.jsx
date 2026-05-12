'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRight, Shield, Zap, RefreshCw, Layers, ShoppingBag, X, ChevronLeft, Eye, Star } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

const SimilarProductCard = ({ p, i }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  const cardImages = useMemo(() => {
    const list = [
      p.image,
      ...(Array.isArray(p.images) ? p.images : [])
    ].filter(Boolean);
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
      onClick={() => router.push(`/shop/${p.id}`)}
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
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.6rem, 2.5vw, 2rem)',
              fontWeight: 400,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            {p.brand}
          </h2>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          {(() => {
            const nameWithoutBrand = p.name.replace(new RegExp('^' + p.brand + '\\s*', 'i'), '');
            const words = nameWithoutBrand.split(' ');
            return words.slice(0, 2).join(' ');
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
  const { addToCart } = useCart();
  const router = useRouter();
  const images = useMemo(() => {
    const list = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image].filter(Boolean);
    return [...new Set(list)].slice(0, 5);
  }, [product.image, product.images]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/shop/checkout');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]); // Added images.length to dependencies

  const cleanId = `${product.id?.substring(0, 15)}...`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`min-h-screen pt-32 pb-32 ${product.category === 'CONTACT LENSES' ? 'bg-white text-zinc-900 selection:bg-gold/20 selection:text-zinc-900' : 'bg-navy text-cream selection:bg-gold selection:text-navy'}`}
    >
      <div className={`fixed top-0 left-1/2 -ml-px w-px h-full ${product.category === 'CONTACT LENSES' ? 'bg-zinc-100' : 'bg-gold/5'} pointer-events-none hidden lg:block`} />

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
                className={`relative aspect-[4/3] ${product.category === 'CONTACT LENSES' ? 'bg-zinc-50' : 'bg-[var(--navy-deep)]'} overflow-hidden group w-full cursor-pointer`}
                onClick={() => openLightbox(activeImageIdx)}
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
                        onClick={() => openLightbox(i + 1)}
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
                        onClick={() => openLightbox(i + 3)}
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
              <div className={`flex justify-between items-center border-b ${product.category === 'CONTACT LENSES' ? 'border-zinc-200' : 'border-gold/10'} pb-4`}>
                <div className={`flex items-center gap-4 text-[10px] font-mono tracking-[0.4em] uppercase ${product.category === 'CONTACT LENSES' ? 'text-zinc-400' : 'text-gold/60'}`}>
                  <Link href="/shop" className={`transition-colors font-bold ${product.category === 'CONTACT LENSES' ? 'hover:text-gold' : 'hover:text-gold'}`}>Catalog</Link>
                  <span className="opacity-20">/</span>
                  <span className={product.category === 'CONTACT LENSES' ? 'text-zinc-600' : 'text-cream/80'}>{product.category}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${product.category === 'CONTACT LENSES' ? 'bg-gold' : 'bg-gold'} animate-pulse`} />
                    <span className={`font-mono text-[9px] tracking-[0.3em] uppercase font-bold ${product.category === 'CONTACT LENSES' ? 'text-gold' : 'text-gold'}`}>
                      {product.category === 'CONTACT LENSES' ? 'Precision Optics' : 'Limited Vault Edition'}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gold/20" />
                  <div className="flex items-center gap-3">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} strokeWidth={2} />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-gold/60 uppercase">4.8 / 5.0</span>
                  </div>
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
                    className={`font-serif tracking-tight leading-[0.95] uppercase ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}
                  >
                    <span className="block text-6xl md:text-7xl lg:text-8xl font-normal" style={{ fontFamily: 'var(--font-cormorant)' }}>{product.brand}</span>
                    <span className={`block text-5xl md:text-6xl lg:text-7xl italic font-light mt-2 ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-gold/90'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {(() => {
                        const nameWithoutBrand = product.name?.replace(new RegExp('^' + product.brand + '\\s*', 'i'), '') || '';
                        return nameWithoutBrand.split(' ').slice(0, 2).join(' ');
                      })() || 'Signature Piece'}
                      <span style={{ fontStyle: 'normal' }}>.</span>
                    </span>
                  </motion.h1>
                  <div className="flex items-center gap-2 mt-4 opacity-40">
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-cream">Model No.</span>
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold font-bold">{product.sku || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(product.tags) && product.tags.length > 0 ? product.tags : ['Handcrafted', 'High-Grade Alloy', 'Signature Tint']).map((tag) => (
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
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 mt-12 w-full border-b border-gold/10 pb-12">
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-mono tracking-[0.4em] uppercase mb-2 ${product.category === 'CONTACT LENSES' ? 'text-zinc-400' : 'text-gold/50'}`}>Investment</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl md:text-6xl font-light tracking-tighter ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>₹{product.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full max-w-2xl">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 px-10 py-5 bg-[#E2D1B3] border border-zinc-900 rounded-full transition-all active:scale-[0.98] hover:bg-[#D4C3A5] group/btn shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                    >
                      <span className="font-mono text-[11px] font-bold tracking-[0.4em] text-zinc-900 uppercase whitespace-nowrap">
                        Add to Bag
                      </span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 px-10 py-5 bg-[#E2D1B3] border border-zinc-900 rounded-full transition-all active:scale-[0.98] hover:bg-[#D4C3A5] group/btn shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                    >
                      <span className="font-mono text-[11px] font-bold tracking-[0.4em] text-zinc-900 uppercase whitespace-nowrap">
                        Buy Now
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {product.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="pt-12 border-t border-gold/10"
                >
                  <div className="space-y-4">
                    <span className={`font-mono text-[9px] tracking-[0.5em] uppercase opacity-60 ${product.category === 'CONTACT LENSES' ? 'text-zinc-400' : 'text-gold'}`}>The Narrative</span>
                    <p className={`font-serif text-xl md:text-2xl leading-relaxed italic ${product.category === 'CONTACT LENSES' ? 'text-zinc-600' : 'text-cream/80'}`}>
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-10"
            >
              {/* POWER SELECTION FOR CONTACT LENSES */}
              {product.category === 'CONTACT LENSES' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-8 bg-zinc-50 p-8 rounded-3xl border border-zinc-200"
                >
                  <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-5">
                      <Eye size={22} strokeWidth={1.5} className="text-zinc-900" />
                      <h4 className="font-mono text-sm tracking-[0.4em] uppercase font-black text-zinc-900">Power Configuration</h4>
                    </div>
                    {Array.isArray(product.tags) && product.tags.length > 0 && (
                      <span className="font-mono text-[9px] tracking-widest text-gold font-bold uppercase bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                        Available: {product.tags.join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          <th className="pb-6">Power</th>
                          <th className="pb-6 text-center">Left (OS)</th>
                          <th className="pb-6 text-center">Right (OD)</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-6">
                        <tr>
                          <td className="py-4 font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest">SPH</td>
                          <td className="py-2 px-4">
                            <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all appearance-none cursor-pointer">
                              <option value="">Select</option>
                              {Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map(val => (
                                <option key={val} value={val}>{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-4">
                            <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all appearance-none cursor-pointer">
                              <option value="">Select</option>
                              {Array.from({ length: 41 }, (_, i) => (i - 20) * 0.25).map(val => (
                                <option key={val} value={val}>{val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest">No. of Boxes</td>
                          <td className="py-2 px-4">
                            <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all appearance-none cursor-pointer">
                              {[1, 2, 3, 4, 5, 6, 12].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Box' : 'Boxes'}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2 px-4">
                            <select className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all appearance-none cursor-pointer">
                              {[1, 2, 3, 4, 5, 6, 12].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Box' : 'Boxes'}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-[10px] text-zinc-400 font-medium italic mt-4">* Standard delivery takes 3-5 business days.</p>
                </motion.div>
              )}

              {/* TECHNICAL SPECIFICATIONS — SIDEBAR */}
              <div className="grid gap-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-5 border-b pb-4 mt-12" style={{ borderColor: product.category === 'CONTACT LENSES' ? '#e4e4e7' : 'rgba(212,175,55,0.15)' }}>
                    <Layers size={22} strokeWidth={1.5} className={product.category === 'CONTACT LENSES' ? 'text-gold' : 'text-gold'} />
                    <h4 className={`font-mono text-sm tracking-[0.4em] uppercase font-black ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>
                      {product.category === 'CONTACT LENSES' ? 'Lens Composition' : 'Frame Composition'}
                    </h4>
                  </div>
                  {product.category === 'CONTACT LENSES' ? (
                    <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                      <li className="flex flex-col gap-2">
                        <span className={`font-mono text-[10px] tracking-[0.4em] uppercase font-bold ${product.category === 'CONTACT LENSES' ? 'text-gold/70' : 'text-gold/70'}`}>Replacement</span>
                        <span className={`text-2xl font-serif italic tracking-tight ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>{product.lensMetadata?.replacementSchedule || 'Daily Disposable'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Pack Size</span>
                        <span className={`text-2xl font-serif italic tracking-tight ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>{product.lensMetadata?.lensesPerPack || '30'} Lenses</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Material</span>
                        <span className={`text-2xl font-serif italic tracking-tight ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>{product.lensMetadata?.lensMaterial || 'Silicone Hydrogel'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Water Content</span>
                        <span className={`text-2xl font-serif italic tracking-tight ${product.category === 'CONTACT LENSES' ? 'text-zinc-900' : 'text-cream'}`}>{product.lensMetadata?.waterContent ? `${product.lensMetadata.waterContent}%` : '55%'}</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Architecture</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.architecture || 'Rectangular'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Primary Material</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.material || 'High-Grade Alloy'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.silhouette || 'Minimalist'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Finish</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.finish || 'Matte / Polished'}</span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-5 border-b border-gold/15 pb-4">
                    <Shield size={22} strokeWidth={1.5} className="text-gold" />
                    <h4 className="font-mono text-sm tracking-[0.4em] uppercase font-black text-cream">
                      {product.category === 'CONTACT LENSES' ? 'Optic Archive' : 'Optic Archive'}
                    </h4>
                  </div>
                  {product.category === 'CONTACT LENSES' ? (
                    <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Base Curve</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">
                          {Array.isArray(product.lensMetadata?.availableBC) ? product.lensMetadata.availableBC[0] : (product.lensMetadata?.availableBC || '8.6mm')}
                        </span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Diameter</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">
                          {Array.isArray(product.lensMetadata?.availableDia) ? product.lensMetadata.availableDia[0] : (product.lensMetadata?.availableDia || '14.2mm')}
                        </span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Wear Type</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.lensMetadata?.wearType || 'Daily Wear'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">UV Blocking</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.lensMetadata?.uvBlocking || 'None'}</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="grid grid-cols-2 gap-y-8 gap-x-16">
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Silhouette</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.lensSweep || '40mm Sweep'}</span>
                      </li>
                      <li className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-gold/70 uppercase font-bold">Protection</span>
                        <span className="text-2xl font-serif italic text-cream tracking-tight">{product.protection || 'UV400 Certified'}</span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="pt-8 border-t border-gold/10 flex justify-start gap-10 overflow-x-auto pb-2 scrollbar-none">
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <Layers size={20} className="text-gold" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">
                      {product.category === 'CONTACT LENSES' ? 'Sterile Pack' : 'Signature Case'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <RefreshCw size={20} className="text-gold" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">
                      {product.category === 'CONTACT LENSES' ? 'Lens Solution' : 'Optical Cloth'}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-4 group text-center min-w-[80px]">
                    <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-gold/5">
                      <Shield size={20} strokeWidth={1.5} className="text-gold" />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/70 font-bold">Vision Guard</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>        {/* REVIEWS SECTION */}
        <section className="mt-32 pt-20 border-t border-gold/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <span className="font-mono text-[9px] tracking-[0.5em] text-gold uppercase">Consumer Sentiment</span>
                     <span className="h-px w-12 bg-gold/20" />
                  </div>
                  <h2 className="text-5xl font-serif italic text-cream">The Archive <span className="text-gold">Dialogues</span>.</h2>
                  <div className="flex items-center gap-4 mt-6">
                     <div className="flex text-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />)}
                     </div>
                     <span className="font-mono text-[11px] tracking-widest text-cream/40 uppercase">4.8 Average across 24 acquisitions</span>
                  </div>
               </div>
               
               <button 
                 onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                 className="px-8 py-4 border border-gold/20 text-gold font-mono text-[10px] tracking-widest uppercase hover:bg-gold/5 transition-all rounded-full"
               >
                 Contribute to Archive
               </button>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-12 mb-24">
               {[
                 { user: 'Vikram S.', date: 'April 12, 2024', rating: 5, text: 'The weight of the frame is perfectly balanced. The gold detailing is even more impressive in person. A true heirloom piece.' },
                 { user: 'Ananya R.', date: 'March 28, 2024', rating: 4, text: 'Exceptional clarity in the lenses. The handcrafted finish is evident in the bridge details. Highly recommended for daily luxury.' }
               ].map((rev, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="p-8 bg-gold/5 border border-gold/10 rounded-3xl space-y-6"
                 >
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="font-serif italic text-xl text-cream">{rev.user}</p>
                          <p className="font-mono text-[9px] tracking-widest text-cream/40 uppercase">{rev.date}</p>
                       </div>
                       <div className="flex text-gold">
                          {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < rev.rating ? "currentColor" : "none"} />)}
                       </div>
                    </div>
                    <p className="text-cream/60 leading-relaxed font-sans text-sm">{rev.text}</p>
                 </motion.div>
               ))}
            </div>

            {/* Review Form */}
            <div id="review-form" className="p-12 bg-navy-surface border border-gold/10 rounded-[3rem] space-y-10">
               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-serif italic text-cream">Share Your Experience</h3>
                  <p className="font-mono text-[9px] tracking-widest text-cream/40 uppercase">Your feedback preserves our heritage quality</p>
               </div>
               
               <div className="space-y-8">
                  <div className="flex justify-center gap-4">
                     {[...Array(5)].map((_, i) => (
                       <button key={i} className="text-gold/20 hover:text-gold transition-colors">
                          <Star size={32} />
                       </button>
                     ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <input 
                       type="text" 
                       placeholder="Identity Name" 
                       className="bg-navy border border-gold/10 rounded-2xl px-6 py-4 text-cream font-mono text-[10px] tracking-widest uppercase outline-none focus:border-gold/40 transition-all"
                     />
                     <input 
                       type="email" 
                       placeholder="Digital Contact (Email)" 
                       className="bg-navy border border-gold/10 rounded-2xl px-6 py-4 text-cream font-mono text-[10px] tracking-widest uppercase outline-none focus:border-gold/40 transition-all"
                     />
                  </div>
                  
                  <textarea 
                    rows={4}
                    placeholder="Your detailed acquisition narrative..." 
                    className="w-full bg-navy border border-gold/10 rounded-2xl px-6 py-4 text-cream font-mono text-[10px] tracking-widest uppercase outline-none focus:border-gold/40 transition-all resize-none"
                  />
                  
                  <button className="w-full py-6 bg-gold text-navy font-mono text-[11px] font-bold tracking-[0.4em] uppercase rounded-full hover:bg-gold-light transition-all shadow-xl">
                     Submit to Archive
                  </button>
               </div>
            </div>
          </div>
        </section>


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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            {similarProducts.map((p, i) => (
              <SimilarProductCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </section>
      </main>

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#050505]/fb backdrop-blur-3xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Background Content Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full max-w-[90vw] max-h-[80vh] flex items-center justify-center p-4 md:p-12"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[lightboxIndex]}
                  alt="Full view"
                  fill
                  sizes="100vw"
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  priority
                />
              </motion.div>
            </div>

            {/* UI CONTROLS - Positioned on Top */}
            <div className="absolute inset-0 pointer-events-none z-[1000]">
              {/* Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="absolute top-14 right-10 md:top-24 md:right-24 flex items-center gap-4 group pointer-events-auto"
              >
                <span className="font-mono text-[10px] tracking-[0.5em] text-white/40 group-hover:text-gold transition-colors font-bold">CLOSE ARCHIVE</span>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/60 backdrop-blur-md group-hover:border-gold transition-all">
                  <X size={20} className="text-white group-hover:text-gold" />
                </div>
              </button>

              {/* Navigation Arrows */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:border-gold hover:text-gold transition-all shadow-2xl"
                >
                  <ChevronLeft size={36} strokeWidth={1} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:border-gold hover:text-gold transition-all shadow-2xl"
                >
                  <ChevronRight size={36} strokeWidth={1} />
                </button>
              </div>

              {/* Bottom Info & Thumbnails */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 w-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-6">
                  <div className="h-px w-8 bg-gold/30" />
                  <span className="font-mono text-[11px] tracking-[0.6em] text-gold uppercase font-black">
                    {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                  </span>
                  <div className="h-px w-8 bg-gold/30" />
                </div>

                <div className="flex gap-3 p-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-500 ${idx === lightboxIndex ? 'ring-2 ring-gold scale-110 shadow-lg' : 'opacity-30 hover:opacity-100'}`}
                    >
                      <Image src={img} alt="thumb" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
