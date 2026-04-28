'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const showcaseProducts = [
  {
    brand: "Ray-Ban",
    name: "Aviator Classic",
    price: "₹14,990",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    slug: "ray-ban-aviator-classic",
    accent: "#C9A96E"
  },
  {
    brand: "Ray-Ban",
    name: "Mega Wayfarer",
    price: "₹13,650",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
    slug: "ray-ban-mega-wayfarer",
    accent: "#C9A96E"
  },
  {
    brand: "Ray-Ban",
    name: "Round Metal",
    price: "₹12,790",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    slug: "ray-ban-round-metal",
    accent: "#C9A96E"
  },
  {
    brand: "Ray-Ban",
    name: "Clubmaster",
    price: "₹11,450",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_32__p21__shad__al2.png",
    slug: "ray-ban-clubmaster",
    accent: "#C9A96E"
  }
];

export default function BrandShowcase() {
  return (
    <section className="py-24 bg-navy overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Heritage Collection</span>
            <h2 className="text-4xl md:text-6xl font-serif text-cream leading-tight">
              Iconic <span className="italic text-gold">Maisons</span>
            </h2>
          </motion.div>

          <Link href="/shop" className="group flex items-center gap-3 text-gold text-[10px] uppercase tracking-[0.3em] pb-2 border-b border-gold/20 hover:border-gold transition-all">
            Browse All Styles
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {showcaseProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-[3/4] bg-white/[0.03] rounded-3xl overflow-hidden border border-white/5 group-hover:border-gold/30 transition-all duration-500">
                  {/* Floating Image Effect */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                      />
                    </motion.div>
                  </div>

                  {/* Brand Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] text-8xl font-serif font-bold pointer-events-none select-none uppercase tracking-tighter">
                    {product.brand}
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-30">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gold text-[8px] uppercase tracking-[0.3em] mb-1 font-bold">{product.brand}</p>
                        <h3 className="text-xl font-serif text-cream">{product.name}</h3>
                      </div>
                      <p className="text-cream/50 text-xs font-light">{product.price}</p>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
