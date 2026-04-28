'use client';
import { motion } from 'framer-motion';
import { Eye, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const stats = [
  { icon: Eye, label: 'Free Eye Test', desc: 'Precision examination by experts' },
  { icon: ShieldCheck, label: '1yr Warranty', desc: 'International quality guarantee' },
  { icon: Truck, label: 'Home Delivery', desc: 'Secure worldwide shipping' },
  { icon: RotateCcw, label: '30-day Returns', desc: 'Hassle-free exchange policy' },
];

export default function AboutStrip() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Visual */}
        <div className="relative aspect-square">
          <div className="absolute inset-0 border border-gold/10 rotate-12 scale-90" />
          <div className="absolute inset-0 border border-teal/10 -rotate-6 scale-95" />
          <div className="absolute inset-0 bg-navy-surface flex items-center justify-center p-12">
            <div className="text-center space-y-6">
              <span className="text-gold font-accent text-8xl opacity-20">1987</span>
              <p className="text-cream/40 max-w-xs font-serif italic text-lg leading-relaxed">
                &quot;Vision is the art of seeing what is invisible to others.&quot;
              </p>
              <div className="h-20 w-[1px] bg-gold/20 mx-auto" />
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-teal uppercase tracking-[0.4em] text-[10px]">Our Legacy</span>
            <h2 className="text-5xl font-serif text-cream leading-tight">
              Crafting Clarity
              <br />
              <span className="text-gold italic">Since 1987</span>
            </h2>
            <p className="text-cream/50 text-lg font-light leading-relaxed">
              EYELOVEYOU by Punjab Optical represents over three decades of optical excellence. We don&apos;t just sell frames; we curate vision as a lifestyle choice. From the heart of Punjab to the world&apos;s luxury hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-all duration-500">
                  <item.icon size={20} className="text-gold group-hover:text-navy transition-colors" />
                </div>
                <div>
                  <h4 className="text-cream font-bold text-sm uppercase tracking-widest mb-1">{item.label}</h4>
                  <p className="text-cream/40 text-[11px] leading-relaxed tracking-wider">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
