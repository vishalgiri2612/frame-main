'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

const VirtualTryOn = dynamic(
  () => import('@/components/ui/VirtualTryOn'),
  { ssr: false }
);

export default function TryOnPage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-cream">

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gold/60 hover:text-gold transition-colors text-[10px] uppercase tracking-widest mb-12 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            Back to Boutique
          </Link>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-teal uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">AR Design Studio</span>
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight mb-4">Mirror of Discovery</h1>
              <p className="text-cream/40 text-xs leading-relaxed max-w-sm uppercase tracking-wider font-bold">
                REAL-TIME BIOMETRIC MAPPING REIMAGINED. EXPLORE THE EYELOVEYOU AESTHETIC ON YOUR OWN FEATURES.
              </p>
            </div>

            <div className="flex bg-[#0A0E1A] p-2 rounded-2xl border border-gold/10">
              <div className="flex items-center gap-3 px-6 py-3 border-r border-gold/10">
                <ShieldCheck className="text-teal" size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-teal">
                  Biometric Secure
                </span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3">
                <Sparkles className="text-gold" size={16} />
                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">MediaPipe v2.0</div>
              </div>
            </div>
          </header>

          <div className="relative">
            {/* Ambient Background Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <VirtualTryOn />
            </motion.div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
            <div className="space-y-4">
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] font-bold">01. Precision Mapping</h4>
              <p className="text-[10px] text-cream/40 uppercase tracking-widest leading-loose">
                Utilizing 468 3D facial landmarks for sub-millimeter accurate frame placement and scaling.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] font-bold">02. Instant Gratification</h4>
              <p className="text-[10px] text-cream/40 uppercase tracking-widest leading-loose">
                Switch between styles, colors, and lens tints in real-time with zero latency.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-gold text-xs uppercase tracking-[0.2em] font-bold">03. Privacy Focused</h4>
              <p className="text-[10px] text-cream/40 uppercase tracking-widest leading-loose">
                All processing happens locally on your device. No biometric data ever leaves your browser.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
