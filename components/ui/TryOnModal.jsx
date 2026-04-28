'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

const VirtualTryOn = dynamic(
  () => import('./VirtualTryOn'),
  { ssr: false }
);

export default function TryOnModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-[#05070a] border border-gold/20 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 text-cream/40 hover:text-gold transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <header className="mb-8">
                <span className="text-teal uppercase tracking-[0.4em] text-[10px] font-bold mb-2 block">Interactive Session</span>
                <h3 className="text-3xl font-serif italic text-cream">Virtual Fitting Room</h3>
              </header>
              
              <VirtualTryOn />
              
              <footer className="mt-8 flex justify-center">
                <p className="text-[10px] text-cream/30 uppercase tracking-widest">
                  Powered by MediaPipe Tracking Engine • Local Processing
                </p>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
