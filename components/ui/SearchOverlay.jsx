'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, TrendingUp, History } from 'lucide-react';
import { useState, useEffect } from 'react';

const SUGGESTIONS = [
  'Titanium Aviators',
  'Tortoiseshell Frames',
  'Limited Edition Journal',
  'Bespoke Gold Series'
];

const RECENT_VIEWS = [
  { id: 1, name: 'The Architect V.1', category: 'Titanium' },
  { id: 2, name: ' पंजाब Classic', category: 'Acetate' }
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-navy/95 backdrop-blur-xl flex flex-col items-center pt-[15vh] px-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-10 right-10 p-4 text-gold hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {/* Search Input Area */}
          <div className="w-full max-w-3xl">
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="DISCOVER THE ARCHIVE..."
                className="w-full bg-transparent border-b border-gold/20 py-6 pl-12 text-3xl md:text-5xl font-serif text-cream placeholder:text-gold/10 outline-none focus:border-gold transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Results/Suggestions */}
            <div className="mt-16 grid md:grid-cols-2 gap-20">
              {/* Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-8 text-gold/40 text-[10px] tracking-[0.4em] uppercase font-mono">
                  <TrendingUp size={12} />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-6 py-2 border border-gold/10 hover:border-gold/40 text-cream/70 hover:text-gold transition-all text-xs tracking-widest uppercase bg-navy-surface"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent History */}
              <div>
                <div className="flex items-center gap-2 mb-8 text-gold/40 text-[10px] tracking-[0.4em] uppercase font-mono">
                  <History size={12} />
                  <span>Recently Viewed</span>
                </div>
                <div className="space-y-6">
                  {RECENT_VIEWS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group cursor-pointer border-b border-gold/5 pb-4">
                      <div>
                        <h4 className="text-cream font-serif text-xl group-hover:text-gold transition-colors">{item.name}</h4>
                        <span className="text-teal text-[9px] tracking-widest uppercase">{item.category}</span>
                      </div>
                      <span className="text-gold/20 group-hover:text-gold transition-colors">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
