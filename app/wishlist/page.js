'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Heart, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const WishlistProductCard = ({ product, toggleWishlist, handleMoveToCart, index }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

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
        setImageIdx((prev) => (prev + 1) % images.length);
      }, 800);
    } else {
      setImageIdx(0);
    }
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.05 * (index % 12), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id || product.sku}`)}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden flex items-center justify-center bg-navy-surface border border-gold/10"
      >
        {images.length > 0 ? (
          <Image
            src={images[imageIdx]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.04]"
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

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="p-2.5 bg-navy-deep/80 backdrop-blur-md border border-gold/10 text-gold hover:text-red-400 transition-all hover:scale-110 rounded-full"
            title="Remove from Archive"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMoveToCart(product);
            }}
            className="p-2.5 bg-gold text-navy hover:bg-white transition-all hover:scale-110 rounded-full"
            title="Add to Bag"
          >
            <ShoppingBag size={16} />
          </button>
        </div>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-end pb-5 pointer-events-none"
        >
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-gold">View Frame</span>
        </div>
      </div>

      <div className="mt-6 space-y-2 transition-transform duration-500 group-hover:translate-x-4">
        <h2 className="text-3xl font-serif text-cream uppercase leading-none tracking-tight">
          {product.brand}
        </h2>
        <h3 className="text-[13px] font-mono font-semibold tracking-[0.15em] uppercase text-gold/60">
          {(() => {
            const nameWithoutBrand = product.name?.replace(new RegExp('^' + product.brand + '\\s*', 'i'), '') || '';
            const words = nameWithoutBrand.split(' ');
            return words.slice(0, 2).join(' ');
          })()}
        </h3>
        <div className="pt-2">
          <span className="text-sm font-mono font-bold tracking-widest text-gold">
            ₹{product.price?.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function WishlistPage() {
  const { wishlist, toggleWishlist, setWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
    toast.success('Moved to Bag');
  };

  const clearAll = () => {
    if (window.confirm('Clear all items from your personal archive?')) {
      setWishlist([]);
      toast.success('Archive Cleared');
    }
  };

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

      {/* Subtle grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23C9A84C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px] relative z-10">
        <header className="mb-16 sm:mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-gold/60"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span className="w-12 h-px bg-gold" />
              PERSONAL ARCHIVE
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl sm:text-8xl font-light tracking-tighter leading-none text-cream"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              YOUR <span className="italic text-gold">WISHLIST.</span>
            </motion.h1>
          </div>

          {wishlist.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearAll}
              className="text-[9px] tracking-[0.4em] uppercase text-gold/40 hover:text-gold transition-colors pb-2 border-b border-gold/10"
            >
              Clear Archive
            </motion.button>
          )}
        </header>

        {wishlist.length === 0 ? (
          <div className="py-40 border border-dashed border-gold/10 bg-navy-surface/20 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-gold/20" />
            </div>
            <div className="space-y-2">
              <p className="text-cream/60 font-serif text-2xl italic">The archive is currently empty</p>
              <p className="text-gold/30 font-mono text-[10px] tracking-widest uppercase">Start curating your collection</p>
            </div>
            <Link 
              href="/shop" 
              className="px-10 py-4 bg-gold text-navy font-mono text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-xl"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-20">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, idx) => (
                <WishlistProductCard 
                  key={product.id || product.sku} 
                  product={product} 
                  toggleWishlist={toggleWishlist} 
                  handleMoveToCart={handleMoveToCart} 
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
