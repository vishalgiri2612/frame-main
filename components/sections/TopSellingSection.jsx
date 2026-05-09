'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';

const TopProductCard = ({ product, index }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/shop/${product.id || product.sku}`)}
      className="relative flex-shrink-0 w-[300px] md:w-[400px] group cursor-pointer"
    >
      <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden border border-zinc-100 rounded-2xl transition-all duration-700 group-hover:border-gold/30 shadow-xl group-hover:shadow-2xl">
        {/* Rank Number */}
        <div className="absolute top-6 left-6 z-10 flex items-baseline gap-1">
          <span className="text-4xl md:text-6xl font-black italic text-zinc-200/50 group-hover:text-gold/20 transition-colors duration-500 font-serif">
            0{index + 1}
          </span>
          {index === 0 && <Trophy className="w-4 h-4 text-gold animate-bounce" />}
        </div>

        {/* Image */}
        <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-110">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-12 mix-blend-multiply"
            />
          ) : (
             <div className="text-zinc-200 text-6xl font-black">FRAME</div>
          )}
        </div>

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute bottom-8 left-8 right-8 transition-transform duration-500 group-hover:-translate-y-2">
          <div className="text-xs font-black tracking-[0.3em] text-gold uppercase mb-2">
            {product.brand}
          </div>
          <h3 className="text-xl md:text-2xl font-light text-zinc-900 tracking-tight leading-tight uppercase font-serif mb-4">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-zinc-600 tracking-widest font-mono">
              ₹ {product.price?.toLocaleString('en-IN')}
            </span>
            <div className="flex items-center gap-2 text-gold group-hover:gap-4 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Explore</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TopSellingSection({ products = [] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-12 pb-4 bg-white overflow-hidden relative border-y border-zinc-100">
      {/* Background Text */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="text-[20vw] font-black whitespace-nowrap leading-none select-none tracking-tighter text-zinc-900 font-sans uppercase">
          TOP 5 SELLING • TOP 5 SELLING • TOP 5 SELLING
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6"
            >
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Best Sellers</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter font-sans leading-none uppercase"
            >
              Top 5 Selling.
            </motion.h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-zinc-400 text-[10px] max-w-[200px] leading-relaxed uppercase tracking-[0.2em] font-bold"
          >
            Curated by our specialists based on seasonal trends and aesthetic excellence.
          </motion.p>
        </header>

        {/* Infinite Marquee Wrapper */}
        <div className="relative mt-12 overflow-hidden">
          <motion.div 
            className="flex gap-10"
            animate={{ x: [0, '-50%'] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ width: 'fit-content', display: 'flex' }}
          >
            {/* Double the products for seamless loop */}
            {[...products, ...products].map((product, idx) => (
              <TopProductCard key={`${product.id || idx}-${idx}`} product={product} index={idx % products.length} />
            ))}
          </motion.div>
        </div>

        {/* Status Indicator Bar */}
        <div className="mt-12 h-[1px] bg-zinc-100 w-full relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gold w-1/4"
            animate={{ x: ['0%', '300%', '0%'] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
