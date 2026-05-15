'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, TrendingUp, History, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPortal } from 'react-dom';

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
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Fetch results when query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-[#0A0B14] flex flex-col items-center pt-[12vh] px-6"
        >
          {/* Grain Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal/5 blur-[70px] rounded-full" />

          {/* Close Button - MADE MORE PROMINENT AS REQUESTED */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 md:top-12 md:right-16 p-4 text-gold hover:text-white transition-all duration-500 group z-[10001]"
            aria-label="Cancel Search"
          >
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-gold transition-all duration-500 shadow-[0_0_20px_rgba(201,168,76,0.1)] group-hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                <X size={28} strokeWidth={1.5} className="group-hover:text-[#0A0B14] transition-colors" />
              </div>
              <span className="text-[10px] tracking-[0.6em] uppercase text-gold/60 group-hover:text-gold transition-all duration-500 font-bold">
                Cancel
              </span>
            </div>
          </button>

          {/* Search Input Area */}
          <div className="w-full max-w-6xl relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative group mb-12"
            >
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gold/30 group-focus-within:text-gold transition-colors duration-700" size={36} strokeWidth={1} />
              <input
                autoFocus
                type="text"
                placeholder="DISCOVER THE ARCHIVE..."
                className="w-full bg-transparent border-b border-gold/20 py-12 pl-20 text-4xl md:text-8xl font-serif text-[#F7F4EF] placeholder:text-gold/10 outline-none focus:border-gold/60 transition-all duration-1000 uppercase tracking-tight"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 border border-gold/10 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </motion.div>

            {/* Content Area */}
            <div className="mt-20 overflow-y-auto max-h-[60vh] pr-6 scrollbar-thin scrollbar-thumb-gold/10 hover:scrollbar-thumb-gold/30 transition-colors pb-20">
              {query.length >= 2 ? (
                /* Search Results */
                <div className="space-y-16">
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                      {results.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.6 }}
                          onClick={() => {
                            router.push(`/shop/${product.id}`);
                            onClose();
                          }}
                          className="group cursor-pointer"
                        >
                          <div className="relative aspect-[5/4] bg-[#0E121D] border border-white/5 rounded-sm overflow-hidden mb-6 group-hover:border-gold/40 transition-all duration-700">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-contain p-8 transition-transform duration-1000 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-white/5 uppercase tracking-[0.6em]">Visual Archive</div>
                            )}
                            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.03] transition-colors duration-700" />

                            {/* Hover Reveal "View Detail" */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gold flex justify-between items-center">
                              <span className="text-[#0A0B14] text-[10px] font-bold tracking-widest uppercase">View Details</span>
                              <ArrowRight size={14} className="text-[#0A0B14]" />
                            </div>
                          </div>
                          <div>
                            <span className="text-gold/50 text-[10px] tracking-[0.6em] uppercase font-mono block mb-3">{product.brand}</span>
                            <h4 className="text-[#F7F4EF] font-serif text-3xl group-hover:text-gold transition-colors duration-700 mb-2">{product.name}</h4>
                            <div className="flex items-center gap-6">
                              <span className="text-teal/50 text-[10px] tracking-widest uppercase">{product.category}</span>
                              <span className="w-1 h-1 rounded-full bg-gold/20" />
                              <span className="text-[#F7F4EF]/60 font-mono text-sm tracking-tighter">₹{product.price?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : !isLoading && (
                    <div className="text-center py-40">
                      <p className="text-gold/20 font-serif text-5xl italic mb-10">No matches in the archive for &quot;{query}&quot;</p>
                      <button
                        onClick={() => setQuery('')}
                        className="text-[11px] tracking-[0.7em] uppercase text-gold/40 hover:text-gold transition-all duration-700 border-b border-gold/10 pb-2 hover:border-gold"
                      >
                        Clear Archive Search
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Default Suggestions/History */
                <div className="grid lg:grid-cols-2 gap-40">
                  {/* Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-12 text-gold/40 text-[12px] tracking-[0.6em] uppercase font-mono">
                      <TrendingUp size={16} strokeWidth={1} />
                      <span>Trending Archive</span>
                    </div>
                    <div className="flex flex-wrap gap-5">
                      {SUGGESTIONS.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-10 py-4 border border-gold/10 hover:border-gold/80 text-white/50 hover:text-gold transition-all duration-700 text-[12px] tracking-[0.4em] uppercase bg-white/[0.01] hover:bg-white/[0.04] backdrop-blur-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent History */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-12 text-gold/40 text-[12px] tracking-[0.6em] uppercase font-mono">
                      <History size={16} strokeWidth={1} />
                      <span>Recently Viewed</span>
                    </div>
                    <div className="space-y-10">
                      {RECENT_VIEWS.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-8 hover:border-gold/30 transition-all duration-700"
                        >
                          <div>
                            <h4 className="text-white/70 font-serif text-3xl group-hover:text-gold transition-all duration-700 mb-2">{item.name}</h4>
                            <span className="text-teal/40 text-[11px] tracking-[0.4em] uppercase">{item.category}</span>
                          </div>
                          <div className="w-14 h-14 rounded-full border border-white/5 group-hover:border-gold/40 flex items-center justify-center transition-all duration-700">
                            <ArrowRight size={20} className="text-white/10 group-hover:text-gold transition-all duration-700" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
