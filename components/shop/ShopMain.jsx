'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatPrice = (price) => {
  if (!price || price <= 0) return 'Price on Request';
  return `₹${price.toLocaleString('en-IN')}`;
};

function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const isLiked = isInWishlist(product.id || product.sku);

  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const router = useRouter();

  const images = useMemo(() => {
    const list = [
      product.image,
      ...(Array.isArray(product.images) ? product.images : [])
    ].filter(Boolean);
    return [...new Set(list)];
  }, [product.image, product.images]);

  useEffect(() => {
    let timer;
    if (isHovered && images.length > 1) {
      timer = setInterval(() => {
        setImageIdx(prev => (prev + 1) % images.length);
      }, 800);
    } else {
      setImageIdx(0);
    }
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    const shortName = (() => {
      const nameWithoutBrand = product.name.replace(new RegExp('^' + product.brand + '\\s*', 'i'), '');
      return nameWithoutBrand.split(' ').slice(0, 2).join(' ');
    })();
    toast.success(`${product.brand} ${shortName} added to bag`, {
      icon: '🛍️',
      style: {
        borderRadius: '0px',
        background: 'var(--navy-deep)',
        color: 'var(--gold)',
        border: '1px solid var(--border-subtle)',
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.1em'
      }
    });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * (index % 12), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="product-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id || product.sku}`)}
    >
      <div
        className="card-image relative aspect-[4/3] overflow-hidden flex items-center justify-center"
        style={{
          background: 'var(--navy-surface)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {images.length > 0 ? (
          <Image
            src={images[imageIdx]}
            alt={product.name}
            fill
            loading="lazy"
            className="next-image object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="60%" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--border-subtle)', maxWidth: '200px' }}>
              <path d="M20 60C20 40 40 30 60 30H90C110 30 120 40 120 60V70C120 90 110 100 90 100H60C40 100 20 90 20 70V60Z" stroke="currentColor" strokeWidth="2" />
              <path d="M120 50C120 50 130 40 150 40C170 40 180 50 180 50" stroke="currentColor" strokeWidth="2" />
              <path d="M180 60C180 40 200 30 220 30H250C270 30 280 40 280 60V70C280 90 270 100 250 100H220C200 100 180 90 180 70V60Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: 'var(--navy-deep)',
            backdropFilter: 'blur(8px)',
            color: isLiked ? 'var(--gold)' : 'var(--text-tertiary)',
            border: '1px solid var(--border-subtle)',
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`}
          />
        </button>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-end pb-5"
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

      <div className="mt-4 space-y-2 transition-transform duration-500 group-hover:translate-x-5" style={{ willChange: 'transform' }}>
        <div className="flex justify-between items-end">
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
            {product.brand}
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
            // Remove brand from name if it exists at the start, then take first 2 words
            const nameWithoutBrand = product.name.replace(new RegExp('^' + product.brand + '\\s*', 'i'), '');
            const words = nameWithoutBrand.split(' ');
            return words.slice(0, 2).join(' ');
          })()}
        </h3>
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}
          >
            {!product.price || product.price <= 0
              ? 'Price on Request'
              : `₹ ${product.price.toLocaleString('en-IN')}`}
          </span>
          {product.oldPrice > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--text-disabled)', textDecoration: 'line-through' }}>
              ₹ {product.oldPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopMain({ initialProducts = [], brands = [], categories = [], sortOptions = [] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setCategory] = useState('ALL');
  const [activeBrand, setBrand] = useState('ALL');
  const [sortBy, setSort] = useState('newest');
  const [isFilterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...initialProducts];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        (p.name?.toLowerCase() || '').includes(q) ||
        (p.sku?.toLowerCase() || '').includes(q) ||
        (p.brand?.toLowerCase() || '').includes(q)
      );
    }

    if (activeCategory !== 'ALL') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (activeBrand !== 'ALL') {
      list = list.filter((p) => (typeof p.brand === 'string' ? p.brand : p.brand?.name) === activeBrand);
    }

    // Sort Logic
    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [initialProducts, query, activeCategory, activeBrand, sortBy]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('ALL');
    setBrand('ALL');
    setSort('newest');
  }, []);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 selection:bg-gold selection:text-navy" style={{ background: 'var(--navy)', color: 'var(--text-primary)' }}>
      {/* Dynamic Premium Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'var(--navy)',
          opacity: 1
        }}
      />

      {/* Subtle grid pattern overlay for texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23C9A84C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="fixed top-0 left-1/2 -ml-px w-px h-full pointer-events-none hidden lg:block" style={{ background: 'var(--border-subtle)' }} />

      <main className="container mx-auto px-4 sm:px-6 max-w-[1400px] relative z-10">
        {/* HERO SECTION */}
        <header className="mb-10 sm:mb-16 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 text-[9px] sm:text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-tertiary)' }}
          >
            <span className="w-8 sm:w-12 h-px" style={{ background: 'var(--gold)' }} />
            BEYOND WORTH ARCHIVE
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--text-primary)' }}
              className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9]"
            >
              CURATED <br />
              <span className="italic text-gold" style={{ fontFamily: 'var(--font-cormorant)' }}>MAISONS.</span>
            </motion.h1>

            {/* Metadata moved to filters row */}
          </div>
        </header>

        {/* UNIFIED FILTERS DASHBOARD */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 pb-8 border-b border-gold/5">
          <div className="flex flex-wrap items-center gap-4">
            {categories.map(cat => {
              const name = typeof cat === 'string' ? cat : cat.name;
              const isActive = activeCategory === name;
              return (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className="px-8 py-3 text-[10px] uppercase transition-all duration-500 rounded-full border"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.2em',
                    borderColor: isActive ? 'var(--gold)' : 'var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--gold)' : 'transparent',
                    color: isActive ? 'var(--navy)' : 'var(--text-primary)'
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] tracking-[0.4em] text-gold/40 uppercase font-mono">Archive Status</span>
              <span className="text-[10px] tracking-[0.3em] text-[var(--text-primary)] uppercase font-bold font-mono">
                {filtered.length} PIECES DETECTED
              </span>
            </div>

            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-4 px-10 py-4 border rounded-full transition-all duration-500 group hover:border-gold hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--navy-surface)' }}
            >
              <SlidersHorizontal size={14} className="text-gold group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-black" style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}>Filter Archive</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-12 sm:mb-16 group flex items-center border-b pb-4 transition-all" style={{ borderColor: 'var(--border-subtle)' }}>
          <Search size={22} className="group-focus-within:text-gold transition-colors shrink-0" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by SKU, Brand, or Frame Shape..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-6 bg-transparent outline-none text-sm sm:text-base transition-all placeholder:opacity-40"
            style={{
              fontFamily: 'var(--font-inter)',
              color: 'var(--text-primary)',
            }}
          />
          <div className="absolute bottom-[-1px] left-0 h-[1px] w-0 group-focus-within:w-full transition-all duration-700" style={{ background: 'var(--gold)' }} />
        </div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 sm:py-40 border border-dashed border-gold/10 bg-navy-surface/20 space-y-4 sm:space-y-6"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gold/5 rounded-full flex items-center justify-center">
                <X size={24} className="text-gold/20" />
              </div>
              <p className="text-gold/40 font-mono tracking-[0.3em] sm:tracking-[0.5em] text-[8px] sm:text-[10px] uppercase">No archives match the signature</p>
              <button
                onClick={resetFilters}
                className="text-gold border-b border-gold/30 pb-1 text-[8px] sm:text-[9px] font-mono tracking-[0.4em] uppercase hover:text-cream hover:border-cream transition-all"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-20"
            >
              {filtered.map((product, idx) => (
                <ProductCard
                  key={product.id || product.sku}
                  product={product}
                  index={idx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MOBILE FILTER SIDEBAR (WIP) */}

      {/* MOBILE FILTER SIDEBAR (WIP) */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-navy/40 backdrop-blur-md z-[9998]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[var(--navy)] z-[9999] p-10 shadow-[0_0_100px_rgba(0,0,0,0.03)] flex flex-col"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-light tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-cormorant)' }}>Archive Filter</h2>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-gold/60 font-medium">Bespoke Collection</p>
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-gold/10 rounded-full transition-all duration-500 hover:rotate-90"
                >
                  <X size={18} className="text-[var(--text-primary)]" />
                </button>
              </div>

              <div className="flex-1 space-y-12">
                {/* SORTING - COMPACT */}
                <div className="space-y-6">
                  <h3 className="text-[9px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase font-bold border-b border-gold/10 pb-2">Sort By</h3>
                  <div className="flex flex-col">
                    {sortOptions.map(opt => {
                      const isActive = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setFilterOpen(false); }}
                          className="group py-3.5 flex items-center gap-4 text-left transition-all duration-500"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 shrink-0 ${isActive ? 'bg-gold scale-100' : 'bg-transparent scale-0 group-hover:bg-gold/30 group-hover:scale-100'}`} />
                          <span
                            className={`text-[11px] tracking-[0.15em] uppercase transition-all duration-500 ${isActive ? 'text-[var(--text-primary)] font-bold translate-x-0' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] font-medium translate-x-[-10px] group-hover:translate-x-0'}`}
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BRANDS - COMPACT */}
                <div className="space-y-6">
                  <h3 className="text-[9px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase font-bold border-b border-gold/10 pb-2">Maison Archive</h3>
                  <div className="flex flex-col gap-1 py-2">
                    {brands.map(b => {
                      const name = typeof b === 'string' ? b : b.name;
                      const isActive = activeBrand === name;
                      return (
                        <button
                          key={name}
                          onClick={() => { setBrand(name); setFilterOpen(false); }}
                          className="group py-3 flex items-center justify-between transition-all duration-500"
                        >
                          <span
                            className={`text-[11px] tracking-[0.15em] uppercase transition-all duration-500 ${isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] font-medium'}`}
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            {name}
                          </span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <button
                  onClick={() => { resetFilters(); setFilterOpen(false); }}
                  className="group relative w-full py-6 transition-all duration-700"
                >
                  <div className="absolute inset-0 border border-gold/20 scale-100 group-hover:scale-[1.02] transition-transform duration-700" />
                  <span className="relative z-10 text-gold text-[9px] tracking-[0.4em] uppercase font-bold group-hover:text-gold/60 transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                    Reset Archive
                  </span>
                </button>

                <div className="flex justify-between items-center px-1 mt-8 opacity-20">
                  <span className="text-[7px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase font-medium">Punjab Optical</span>
                  <span className="text-[7px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase font-medium">V2.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
