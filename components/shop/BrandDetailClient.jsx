'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';

const BrandProductCard = ({ product, index }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: index * 0.05, 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        y: { duration: 0.3, ease: "easeOut" }
      }}
      className="product-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/shop/${product.id}`}
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
            sizes="(max-width: 768px) 50vw, 25vw"
            className="next-image object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/20 font-mono text-[10px] tracking-[0.35em]">
            {product.id}
          </div>
        )}

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
            const nameWithoutBrand = product.name?.replace(new RegExp('^' + product.brand + '\\s*', 'i'), '') || '';
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
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function BrandDetailClient({ collection, products }) {
  const [visionStage, setVisionStage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timers = [
      setTimeout(() => setVisionStage(1), 800),
      setTimeout(() => setVisionStage(2), 2400),
      setTimeout(() => setVisionStage(3), 3800),
    ];
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-navy text-cream overflow-hidden">
      <AnimatePresence>
        {visionStage < 3 && (
          <motion.div
            key="optical-overlay"
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(40px)', transition: { duration: 1.2, ease: [0.7, 0, 0.3, 1] } }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-navy"
          >
            <div className="relative flex items-center justify-center w-full">
              <motion.h1
                animate={{
                  filter: visionStage === 0 ? 'blur(60px)' : visionStage === 1 ? 'blur(30px)' : 'blur(8px)',
                  scale: visionStage === 0 ? 0.8 : visionStage === 1 ? 0.95 : 1.1,
                  opacity: visionStage === 0 ? 0.05 : visionStage === 1 ? 0.15 : 0.3,
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="text-[20vw] font-serif italic tracking-tighter text-gold select-none uppercase"
              >
                {collection.name}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ filter: visionStage < 3 ? 'blur(40px)' : 'blur(0px)', opacity: visionStage < 3 ? 0 : 1, scale: visionStage < 3 ? 1.1 : 1 }}
        transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
        className="min-h-screen"
      >
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gold/10 pb-12">
              <div className="max-w-2xl">
                <span className="text-teal uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">Archive Archive</span>
                <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-6">{collection.name}</h1>
                <p className="text-xl md:text-2xl font-light text-cream/70 leading-relaxed max-w-xl italic">
                  {collection.bio || 'A legacy of precision.'}
                </p>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="text-[10px] uppercase tracking-widest text-gold mb-2">Pieces</div>
                <div className="text-4xl font-mono text-gold/60 tracking-tighter">{String(collection.count).padStart(2, '0')}</div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {!products.length && (
                <div className="lg:col-span-3 border border-gold/10 bg-navy-surface p-8 text-center text-cream/50 font-mono text-[10px] tracking-[0.3em] uppercase">
                  No products matched this archive yet.
                </div>
              )}
              {products.map((product, index) => (
                <BrandProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </motion.div>
    </main>
  );
}
