'use client';
import { motion } from 'framer-motion';
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
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="product-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            color: isInWishlist(product.id || product.sku) ? '#C9A84C' : 'var(--text-tertiary)',
          }}
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-transform ${isInWishlist(product.id || product.sku) ? 'fill-current scale-110' : 'hover:scale-110'}`}
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
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
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
            Add to Bag
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
            color: 'var(--text-primary)',
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
    <section style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-3xl)', background: 'var(--navy)' }}>
      <div className="container mx-auto px-6">

        <div className="mb-10 text-left">
          <h2
            className="scroll-reveal"
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
          </h2>
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
      </div>

      <TryOnModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
