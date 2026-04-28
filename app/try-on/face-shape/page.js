'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

const SHAPES = [
  { 
    id: 'oval', 
    name: 'Oval', 
    desc: 'Balanced proportions with high cheekbones and a narrow chin.',
    recommend: 'Most frames look great. Try geometric squares for contrast.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-gold/30">
        <path d="M50 10C30 10 20 25 20 50C20 75 30 90 50 90C70 90 80 75 80 50C80 25 70 10 50 10Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: 'square', 
    name: 'Square', 
    desc: 'Strong jawline and broad forehead with similar width and length.',
    recommend: 'Round and oval frames to soften sharp angles.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-gold/30">
        <rect x="25" y="25" width="50" height="50" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: 'round', 
    name: 'Round', 
    desc: 'Soft curves with similar width and length. No sharp angles.',
    recommend: 'Rectangular or angular frames to add definition.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-gold/30">
        <circle cx="50" cy="50" r="35" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: 'heart', 
    name: 'Heart', 
    desc: 'Broad forehead tapering down to a narrow, pointed chin.',
    recommend: 'Frames that are wider at the bottom or rimless styles.',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full text-gold/30">
        <path d="M50 85C50 85 20 65 20 40C20 25 35 15 50 25C65 15 80 25 80 40C80 65 50 85 50 85Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  }
];

export default function FaceShapeGuide() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen pt-40 pb-20 bg-navy overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] tracking-[0.4em] text-gold uppercase block mb-4">Fit Diagnostic</span>
            <h1 className="text-5xl md:text-7xl font-serif text-cream italic leading-none">The Geometry of Sight</h1>
            <p className="mt-8 text-cream/60 font-sans font-light text-lg leading-relaxed">
              Choosing the right frame is a clinical exercise in balancing facial geometry. 
              Select your face shape to discover the architectural silhouettes that complement your natural structure.
            </p>
          </div>
          <div className="flex items-center gap-4 text-gold/40 border-l border-gold/10 pl-8 hidden lg:flex">
             <Info size={32} strokeWidth={1} />
             <p className="text-[10px] font-mono tracking-widest uppercase leading-tight">
               Precision recommendation <br/> based on Osaka standards.
             </p>
          </div>
        </div>

        {/* Shape Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {SHAPES.map((shape) => (
            <motion.div
              key={shape.id}
              onClick={() => setSelected(shape)}
              whileHover={{ y: -10 }}
              className={`cursor-pointer p-8 border transition-all duration-500 flex flex-col items-center text-center ${
                selected?.id === shape.id 
                  ? 'bg-navy-surface border-gold' 
                  : 'bg-navy-deep border-gold/10 hover:border-gold/30'
              }`}
            >
              <div className="w-24 h-24 mb-8">
                {shape.svg}
              </div>
              <h3 className="text-2xl font-serif text-cream mb-4">{shape.name}</h3>
              <p className="text-[11px] text-cream/40 font-mono tracking-wider leading-relaxed">
                {shape.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-surface p-12 border border-gold/10 flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <span className="font-mono text-[10px] tracking-[0.4em] text-teal uppercase block mb-6">Expert Recommendation</span>
              <h2 className="text-4xl font-serif text-cream italic mb-6">Silhouettes for the {selected.name} Structure</h2>
              <p className="text-cream/70 font-sans font-light text-lg mb-8">
                {selected.recommend}
              </p>
              <Link 
                href="/shop"
                className="inline-flex items-center gap-4 text-gold group font-mono text-[10px] tracking-[0.3em] uppercase"
              >
                Explore {selected.name} Collection
                <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="w-full md:w-1/3 aspect-square border border-gold/5 flex items-center justify-center p-8 bg-navy-deep relative overflow-hidden group">
               <div className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  {selected.svg}
               </div>
               <div className="relative z-10 text-center">
                  <span className="text-4xl font-serif text-gold">V</span>
                  <p className="text-[9px] font-mono text-gold/40 mt-2 uppercase">Visio Certified</p>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
