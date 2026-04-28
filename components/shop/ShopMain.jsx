'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to bag`, {
       icon: '🛒',
       style: {
         borderRadius: '0px',
         background: '#0A0E1A',
         color: '#D4AF37',
         border: '1px solid rgba(212,175,55,0.2)',
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
    >
      <div
        className="card-image relative aspect-[4/3] overflow-hidden flex items-center justify-center"
        style={{
          background: '#FFFFFF',
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            color: isLiked ? '#C9A84C' : 'var(--text-tertiary)',
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'hover:scale-110'}`}
          />
        </button>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-end pb-5"
          style={{ background: 'rgba(10,14,26,0.55)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: '#F7F4EF',
            }}
          >
            View Frame
          </span>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-center p-3">
          <Link
            href={`/shop/${product.id || product.sku}`}
            className="w-full max-w-[160px] py-2.5 text-center transition-colors"
            style={{
              background: '#F7F4EF',
              color: '#0F1117',
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C9A84C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F7F4EF')}
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-full max-w-[160px] py-2.5 transition-all"
            style={{
              border: '1px solid #C9A84C',
              color: '#C9A84C',
              background: 'transparent',
              fontFamily: 'var(--font-inter)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0A0E1A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C'; }}
          >
            {added ? 'Added to Bag' : 'Add to Bag'}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            display: 'block',
          }}
        >
          {product.brand}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            fontWeight: 600,
            color: '#111111',
            letterSpacing: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
              fontWeight: 700,
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
    <div className="min-h-screen pt-24 sm:pt-32 pb-24 selection:bg-gold selection:text-navy" style={{ background: '#FFFFFF', color: '#111111' }}>
      {/* Dynamic Premium Background */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{ 
          background: '#FFFFFF',
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
              style={{ fontFamily: 'var(--font-cormorant)', color: '#111111' }}
              className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9]"
            >
              CURATED <br />
              <span className="italic text-gold" style={{ fontFamily: 'var(--font-cormorant)' }}>MAISONS.</span>
            </motion.h1>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row-reverse lg:flex-row items-center justify-between lg:justify-end gap-6 w-full lg:w-auto"
            >
              <div className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase lg:text-right leading-relaxed flex flex-col items-start lg:items-end">
                <span style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-tertiary)' }}>COLLECTION_V2.0</span>
                <span className="font-semibold tracking-[0.4em]" style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}>
                  {filtered.length} PIECES DETECTED
                </span>
              </div>
              <button 
                onClick={() => setFilterOpen(true)}
                className="flex items-center gap-3 px-6 py-3.5 border rounded-full transition-all duration-300 group hover:shadow-lg"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--navy-surface)' }}
              >
                <SlidersHorizontal size={16} className="text-gold group-hover:scale-110 transition-transform" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-primary)' }}>Filters</span>
              </button>
            </motion.div>
          </div>
        </header>

        {/* TOP FILTERS (DESKTOP) */}
        <div className="hidden lg:flex flex-wrap items-center gap-4 mb-12">
          {categories.map(cat => {
            const name = typeof cat === 'string' ? cat : cat.name;
            const isActive = activeCategory === name;
            return (
              <button
                key={name}
                onClick={() => setCategory(name)}
                className="px-6 py-2.5 text-[10px] uppercase transition-all duration-500 rounded-full border"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.15em',
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
               className="fixed inset-0 bg-navy/90 backdrop-blur-md z-[100]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               className="fixed right-0 top-0 bottom-0 w-full max-w-[350px] bg-navy-deep border-l border-gold/10 z-[101] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-2xl font-serif italic text-gold">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="text-cream/50 hover:text-cream"><X size={24} /></button>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase">Sort By</h3>
                   <div className="flex flex-col gap-2">
                     {sortOptions.map(opt => (
                       <button 
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setFilterOpen(false); }}
                          className={`text-left px-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase border ${sortBy === opt.value ? 'bg-gold text-navy border-gold' : 'border-gold/10 text-cream/40'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase">Brand Archive</h3>
                   <div className="flex flex-wrap gap-2">
                     {brands.map(b => {
                       const name = typeof b === 'string' ? b : b.name;
                       return (
                         <button 
                            key={name}
                            onClick={() => { setBrand(name); setFilterOpen(false); }}
                            className={`px-4 py-2 text-[8px] font-mono tracking-[0.2em] uppercase border ${activeBrand === name ? 'bg-gold text-navy border-gold' : 'border-gold/10 text-cream/40'}`}
                         >
                           {name}
                         </button>
                       );
                     })}
                   </div>
                </div>
              </div>

              <button 
                  onClick={() => { resetFilters(); setFilterOpen(false); }}
                  className="absolute bottom-10 left-10 right-10 py-4 border border-gold/20 text-gold font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-gold/5"
              >
                Reset Archive
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
