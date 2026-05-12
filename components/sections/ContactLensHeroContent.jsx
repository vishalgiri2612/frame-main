'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ContactLensHeroContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/contact_lens_hero.png"
            alt="Premium Contact Lenses"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-[var(--gold)] text-[var(--navy)] rounded-full">
              Vision Redefined
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Experience the <br />
              <span className="text-[var(--gold)] italic">Invisible</span> Edge.
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-lg leading-relaxed">
              Discover our premium collection of contact lenses designed for comfort, 
              clarity, and complete freedom. From daily disposables to color enhancers.
            </p>
            <Link
              href="/shop?category=CONTACT LENSES"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--gold)] text-[var(--navy)] font-bold rounded-full hover:bg-[var(--gold-light)] transition-all group shadow-xl uppercase tracking-widest text-[11px]"
            >
              Explore All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  );
}
