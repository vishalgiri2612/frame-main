'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, TrendingUp, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const router = useRouter();

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-navy/95 backdrop-blur-xl flex flex-col items-center pt-[10vh] px-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-10 right-10 p-4 text-gold hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {/* Search Input Area */}
          <div className="w-full max-w-4xl">
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
              {isLoading && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                   <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="mt-16 overflow-y-auto max-h-[60vh] pr-4 scrollbar-thin scrollbar-thumb-gold/20">
              {query.length >= 2 ? (
                /* Search Results */
                <div className="space-y-12">
                   {results.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {results.map((product) => (
                          <div 
                            key={product.id} 
                            onClick={() => {
                              router.push(`/shop/${product.id}`);
                              onClose();
                            }}
                            className="flex gap-6 group cursor-pointer bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-gold/20"
                          >
                             <div className="relative w-24 h-24 bg-navy rounded-lg overflow-hidden shrink-0">
                                {product.image ? (
                                   <Image 
                                      src={product.image} 
                                      alt={product.name} 
                                      fill 
                                      sizes="96px"
                                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110" 
                                   />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-[10px] text-white/10 uppercase tracking-tighter">No Img</div>
                                )}
                             </div>
                             <div className="flex flex-col justify-center">
                                <span className="text-gold text-[9px] tracking-[0.3em] uppercase font-bold mb-1">{product.brand}</span>
                                <h4 className="text-cream font-serif text-xl group-hover:text-gold transition-colors line-clamp-1">{product.name}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                   <span className="text-teal text-[9px] tracking-widest uppercase">{product.category}</span>
                                   <span className="text-cream/40 text-[10px] font-mono">₹{product.price?.toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   ) : !isLoading && (
                      <div className="text-center py-20">
                         <p className="text-gold/40 font-serif text-2xl italic">No specimens found for &quot;{query}&quot;</p>
                         <button 
                            onClick={() => setQuery('')}
                            className="mt-4 text-[10px] tracking-[0.4em] uppercase text-gold hover:text-white transition-colors"
                         >
                            Clear Search
                         </button>
                      </div>
                   )}
                </div>
              ) : (
                /* Default Suggestions/History */
                <div className="grid md:grid-cols-2 gap-20">
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
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between group cursor-pointer border-b border-gold/5 pb-4"
                          onClick={() => {
                             // Assuming item.id or some field can be used for routing
                             // For now just placeholders
                          }}
                        >
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
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
