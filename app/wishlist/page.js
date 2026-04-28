'use client';

import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
    toast.success('Moved to Bag');
  };

  return (
    <div className="min-h-screen bg-navy pt-40 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-20">
          <div className="flex items-center gap-4 text-xs font-mono tracking-[0.4em] uppercase text-gold/60 mb-6">
            <span className="w-12 h-px bg-gold/30" />
            PERSONAL ARCHIVE
          </div>
          <h1 className="text-7xl font-serif italic text-gold tracking-tighter">Your Wishlist.</h1>
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
              className="px-10 py-4 bg-gold text-navy font-mono text-[10px] font-black tracking-[0.5em] uppercase hover:bg-white transition-all shadow-xl"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence>
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-navy-surface border border-gold/10 p-6 flex flex-col gap-6"
                >
                  <div className="relative aspect-square overflow-hidden bg-navy-deep border border-gold/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 group-hover:scale-110 transition-transform duration-700"
                    />
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-4 right-4 p-2 bg-navy-deep/80 text-gold hover:text-red-400 transition-colors z-20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif text-cream italic">{product.name}</h3>
                      <p className="text-gold/60 font-mono text-[10px] tracking-widest uppercase mt-1">{product.brand}</p>
                    </div>

                    <div className="flex justify-between items-center py-4 border-y border-gold/5">
                       <span className="text-gold font-mono text-sm">₹{product.price?.toLocaleString()}</span>
                       <span className="text-cream/20 font-mono text-[8px] uppercase">{product.category}</span>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-gold text-navy py-4 font-mono text-[10px] font-black tracking-[0.5em] uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-4"
                    >
                      ADD TO BAG <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
