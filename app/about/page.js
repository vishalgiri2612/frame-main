'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen pt-32 pb-32 bg-navy text-cream transition-colors duration-700"
    >
      <main className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gold/20 pb-12">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-gold">OUR HERITAGE</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter">
              LEGACY OF <br /><span className="italic font-serif text-gold">VISION.</span>
            </motion.h1>
          </div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="md:max-w-xs text-sm text-cream/60 leading-relaxed font-light"
          >
            Eyewear is more than sight; it&pos;s the architectural framework of personal identity. Our legacy bridges the rich history of Punjab with global excellence.
          </motion.div>
        </section>

        {/* Core Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-32">
          {/* Main Image Plate */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-5 relative aspect-[3/4] bg-navy-surface border border-gold/10 p-2 lg:p-4 group overflow-hidden"
          >
            <div className="relative w-full h-full overflow-hidden border border-gold/5 bg-navy group-hover:border-gold/20 transition-colors duration-700">
              <Image 
                src="/foundry.png" 
                alt="1987 Optical Foundry" 
                fill
                className="object-cover grayscale opacity-70 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[2s] ease-out"
              />
            </div>
            
            {/* Decals */}
            <div className="absolute top-8 left-8 font-mono text-[9px] tracking-widest text-cream z-10 drop-shadow-md">ARCHIVE: PNJ-87</div>
            <div className="absolute bottom-1 w-full text-center font-mono text-[8px] tracking-[0.3em] uppercase text-gold/60">
              The Original 1987 Foundry
            </div>
            <div className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-gold/80" />
          </motion.div>

          <div className="lg:col-span-7 space-y-16 lg:pt-8">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-serif italic text-gold">From Punjab to the World</h2>
              <p className="text-lg lg:text-xl text-cream/80 font-light leading-relaxed">
                Founded in 1987, EYELOVEYOU began as a singular vision in the heart of Punjab. Our mission was never merely to correct sight, but to elevate it. Eyewear is humanity&apos;s most intimate accessory—it alters perception, and in turn, how the world perceives you.
              </p>
            </motion.div>

            <div className="w-full h-px bg-gold/10" />

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-serif italic text-gold">Craftsmanship Over Mass Production</h2>
              <p className="text-lg lg:text-xl text-cream/80 font-light leading-relaxed">
                We believe in the enduring value of proper engineering. Every joint, every hinge, and every lacquer finish is curated with an obsessive attention to detail. Partnering with elite ateliers across Europe and Japan, we bridge the gap between architectural precision and timeless haute couture.
              </p>
            </motion.div>

            <div className="flex gap-16 pt-8 font-mono text-xs tracking-[0.2em] uppercase text-gold">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="block text-4xl lg:text-5xl font-light text-cream mb-4 pl-4 border-l border-gold">39+</span>
                <span className="opacity-80">Years Mastered</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <span className="block text-4xl lg:text-5xl font-light text-cream mb-4 pl-4 border-l border-gold">100k</span>
                <span className="opacity-80">Acquired Frames</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Extrapolated Content: The Future */}
        <section className="bg-navy-surface/50 border border-gold/10 p-12 lg:p-20 relative overflow-hidden group">
           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-navy to-navy pointer-events-none group-hover:opacity-10 transition-opacity duration-1000" />
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
              <div className="max-w-2xl space-y-6">
                <span className="text-xs uppercase tracking-[0.3em] font-mono text-teal">OUR NEXT EPOCH</span>
                <h3 className="text-4xl lg:text-6xl font-serif italic text-cream">Sustainably Seeing the Future</h3>
                <p className="text-cream/60 leading-relaxed font-light text-lg">
                  As we move into our fourth decade, we are revolutionizing our material sourcing. Transitioning toward advanced bio-acetates and recycled titanium, our upcoming collections ensure that protecting your vision also means protecting the world you see.
                </p>
              </div>
              <div className="shrink-0">
                <Link href="/shop" className="group/btn flex items-center justify-center w-32 h-32 rounded-full border border-gold/30 hover:bg-gold transition-all duration-500">
                  <span className="sr-only">Go to shop</span>
                  <ArrowRight className="text-gold group-hover/btn:text-navy group-hover/btn:-rotate-45 transition-all duration-300 w-8 h-8" />
                </Link>
                <div className="mt-6 text-center font-mono text-[9px] tracking-widest text-gold uppercase">
                   Explore Collection
                </div>
              </div>
           </div>
        </section>
      </main>
    </motion.div>
  );
}
