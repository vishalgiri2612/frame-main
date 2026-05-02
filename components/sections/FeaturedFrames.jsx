'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TryOnModal from '@/components/ui/TryOnModal';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCardItem = ({ product, index, toggleWishlist, isInWishlist, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const router = useRouter();

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="product-card group cursor-pointer"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id || product.sku}`)}
    >
      <div
        className="card-image relative aspect-[4/3] overflow-hidden flex items-center justify-center"
        style={{
          background: 'var(--navy-surface)',
          border: '1px solid var(--border-subtle)',
          transform: 'translateZ(0)',
          contain: 'paint'
        }}
      >
        {images.length > 0 ? (
          <Image
            src={images[imageIdx]}
            alt={product.name}
            fill
            loading="lazy"
            className="next-image object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            color: isInWishlist(product.id || product.sku) ? '#C9A84C' : 'var(--text-tertiary)',
            transform: 'translateZ(0)'
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-transform ${isInWishlist(product.id || product.sku) ? 'fill-current scale-110' : 'hover:scale-110'}`}
          />
        </button>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-end pb-5"
          style={{ background: 'transparent', transform: 'translateZ(0)' }}
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

      <div className="mt-4 space-y-3 transition-transform duration-500 group-hover:translate-x-5" style={{ willChange: 'transform' }}>
        <div className="flex justify-between items-end">
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            {product.brand}
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.3em'
          }}
        >
          {(() => {
            const words = product.name.split(' ');
            if (words.length <= 1) return <em style={{ fontStyle: 'italic' }}>{product.name}<span style={{ color: 'var(--gold)', fontStyle: 'normal', marginLeft: '2px' }}>.</span></em>;
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
};

export default function FeaturedFrames({ initialProducts = [] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = ['All', ...new Set(initialProducts.map((p) => p.category))];
  const filteredProducts = initialProducts.filter(
    (p) => activeFilter === 'All' || p.category === activeFilter
  );

  return (
    <section style={{ paddingTop: 'var(--space-xl)', paddingBottom: '60px', background: 'var(--navy)' }}>
      <div className="container mx-auto px-6">

        <div className="mb-10 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 300,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            Shop
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
          {filteredProducts.map((product, i) => (
            <ProductCardItem
              key={product.sku || product._id}
              product={product}
              index={i}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
              addToCart={addToCart}
            />
          ))}
        </div>

        {/* SHOW MORE / SHOP ALL BUTTON */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/shop"
            className="group relative px-16 py-4 overflow-hidden bg-[#E6D5B8] border border-gold/20 rounded-full transition-all duration-500 shadow-[0_15px_40px_rgba(212,175,55,0.1)] hover:bg-[#F3E2B5] hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 font-mono text-[11px] tracking-[0.4em] text-[#0F1117] uppercase font-black flex items-center gap-6 transition-colors duration-500">
              Explore Full Archive
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.span>
            </span>
          </Link>
        </div>
      </div>

      <TryOnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
