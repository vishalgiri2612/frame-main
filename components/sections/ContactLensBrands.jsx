'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';

export default function ContactLensBrands() {
  return (
    <section className="py-20 bg-zinc-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gold-light)]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--gold-light)]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight"
          >
            Find Your Perfect Match
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-500 leading-relaxed"
          >
            We partner with the world&apos;s most trusted manufacturers to bring you 
            superior vision technology tailored to your specific needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              name: 'Cooper Vision', 
              desc: 'World-leading silicone hydrogel lenses for exceptional eye health and comfort.',
              accent: 'bg-[var(--gold)]',
              lightAccent: 'bg-[var(--gold)]/10',
              textColor: 'text-[var(--gold)]'
            },
            { 
              name: 'Bausch + Lomb', 
              desc: 'Innovation in vision care since 1853, offering ultra-clear high-definition optics.',
              accent: 'bg-zinc-950',
              lightAccent: 'bg-zinc-950/10',
              textColor: 'text-zinc-950'
            },
            { 
              name: 'Johnson & Johnson', 
              desc: 'The makers of Acuvue, providing the world\'s best-selling daily disposable lenses.',
              accent: 'bg-[var(--gold)]',
              lightAccent: 'bg-[var(--gold)]/10',
              textColor: 'text-[var(--gold)]'
            },
          ].map((brand, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100 transition-all duration-500"
            >
              {/* Brand Accent Bar */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-b-full ${brand.accent} opacity-20 group-hover:opacity-100 transition-all duration-500`} />
              
              <div className={`w-16 h-16 rounded-2xl ${brand.lightAccent} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <Eye className={`w-8 h-8 ${brand.textColor}`} />
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-[var(--gold)] transition-colors">
                {brand.name}
              </h3>
              
              <p className="text-zinc-500 mb-10 leading-relaxed text-sm">
                {brand.desc}
              </p>

              <Link 
                href={`/shop?category=CONTACT LENSES&brand=${encodeURIComponent(brand.name.toUpperCase())}`} 
                className="inline-flex items-center gap-2 font-bold text-zinc-900 group-hover:gap-4 transition-all"
              >
                <span className="relative">
                  Explore Brand
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
                <ArrowRight className="w-5 h-5 group-hover:text-[var(--gold)] transition-colors" />
              </Link>

              {/* Decorative background number */}
              <span className="absolute bottom-6 right-10 text-8xl font-black text-zinc-50 opacity-[0.03] pointer-events-none select-none">
                0{idx + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
