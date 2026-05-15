'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCardItem = ({ product, index, toggleWishlist, isInWishlist, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id || product.sku}`)}
    >
      <div className="relative aspect-[4/3] bg-[var(--navy-surface)] overflow-hidden rounded-3xl border border-[var(--border-subtle)] transition-all duration-500 group-hover:shadow-2xl group-hover:border-[var(--gold)]/20 flex items-center justify-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <Eye className="w-16 h-16 text-[var(--text-disabled)]" />
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[var(--background)]/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-[var(--background)] border border-[var(--border-subtle)]"
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist(product.id || product.sku) ? 'fill-red-500 text-red-500' : 'text-[var(--text-tertiary)]'}`}
          />
        </button>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[var(--gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <div className="bg-[var(--text-primary)] text-[var(--background)] text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full whitespace-nowrap">
              View Details
           </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-center">
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--gold)]">
          {product.brand}
        </div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {product.name}
        </h3>
        <div className="text-sm font-bold text-[var(--text-secondary)] font-mono">
          ₹ {product.price?.toLocaleString('en-IN')}
        </div>
      </div>
    </motion.div>
  );
};

export default function ContactLensShopSection({ products = [] }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--background)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-px bg-[var(--gold)]/20" />
               <span className="text-[var(--gold)] uppercase tracking-[0.5em] text-[9px] font-bold">The Collection</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight leading-none">
              Featured <br />
              <span className="text-[var(--gold)] italic">Lenses</span>
            </h2>
          </div>

          <Link 
            href="/shop?category=CONTACT LENSES"
            className="group flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">View Full Catalog</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product, i) => (
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
    </section>
  );
}
