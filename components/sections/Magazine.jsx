'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Magazine() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`/api/magazine/latest?t=${Date.now()}`);
      const json = await res.json();
      if (json.success) {
        if (json.data.length > 0) {
          setArticles(json.data);

          // Check if latest article is older than 2 days
          const latestDate = new Date(json.data[0].createdAt);
          const diffDays = (new Date() - latestDate) / (1000 * 60 * 60 * 24);

          if (diffDays >= 2) {
            console.log("AI Magazine is stale (2+ days). Triggering background generation...");
            fetch('/api/magazine/generate', { method: 'POST' });
          }
        }
      }
    } catch (error) {
      console.error("FAILED_TO_LOAD_MAGAZINE", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) return (
    <div className="py-24 text-center font-mono text-[10px] tracking-[0.5em] text-[var(--text-disabled)] uppercase animate-pulse">
      Curating Editorial Journal...
    </div>
  );

  return (
    <section className="py-12 bg-[var(--background)] border-t border-[var(--border-subtle)]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-6xl font-serif tracking-tight text-[var(--text-primary)]">
              Editorial<br />
              <span className="italic">Journal</span>
            </h2>
          </div>
          <Link href="/magazine" className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
            Read the Journal →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] bg-[var(--navy-surface)] rounded-sm overflow-hidden shadow-2xl group border border-[var(--border-subtle)]">
              <img
                src={articles[0]?.image || "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1080&auto=format&fit=crop"}
                alt={articles[0]?.title || "Journal Cover"}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-[4s] ease-out ${heroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                onLoad={() => setHeroLoaded(true)}
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1080&auto=format&fit=crop";
                  setHeroLoaded(true);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
              <div className="absolute top-6 left-6 flex flex-col gap-1">
                <span className="font-mono text-[7px] tracking-[0.5em] text-white/40 uppercase">Issue No. 04</span>
                <span className="font-mono text-[7px] tracking-[0.3em] text-[#C9A84C] uppercase">Spring/Summer 2026</span>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h3 className="font-serif text-2xl italic text-[var(--text-primary)]">Journal of Sight</h3>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] mt-2 font-medium">
                AI Editorial — {articles[0] ? new Date(articles[0].createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Curated Masterworks'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between h-full py-4 space-y-8">
            {articles.length > 1 ? articles.slice(1, 5).map((article, i) => (
              <Link href="/magazine" key={i} className="group flex gap-10 items-center">
                <div className="relative w-64 aspect-[1.5/1] bg-[var(--navy-surface)] rounded-sm overflow-hidden shrink-0 shadow-lg border border-[var(--border-subtle)]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-100"
                    loading="lazy"
                    onError={(e) => {
                      const fallbacks = [
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800",
                        "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800",
                        "https://images.unsplash.com/photo-1511499767390-a733502666ee?q=80&w=800",
                        "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800"
                      ];
                      e.target.src = fallbacks[i % fallbacks.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="max-w-md">
                  <div className="flex items-center gap-3 mb-3 text-[10px] uppercase tracking-[0.3em] font-black text-[var(--text-tertiary)]">
                    <span className="text-[var(--text-primary)]">{article.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-serif text-2xl md:text-3xl text-[var(--text-primary)] group-hover:text-[#C9A84C] transition-colors leading-tight line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="mt-4 text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-[var(--text-disabled)] font-mono text-[10px] uppercase tracking-widest text-center py-10 border-2 border-dashed border-[var(--border-subtle)] rounded-lg">
                More editorial pieces<br />being curated...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
