'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatPrice = (price) => {
  if (!price || price <= 0) return 'Price on Request';
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function ProductCard({ product, index }) {
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
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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

        {/* New Arrival Badge */}
        {product.isNew && (
          <div 
            className="absolute top-4 left-0 z-20 px-3 py-1 text-[8px] font-bold tracking-[0.2em] uppercase"
            style={{ 
              background: 'var(--gold)', 
              color: 'var(--navy-deep)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            New Arrival
          </div>
        )}

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
