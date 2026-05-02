'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const showcaseBrands = [
  {
    name: "Ray-Ban",
    origin: "MILAN, ITALY",
    styles: "142 STYLES",
    est: "EST. 1937",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    gridClass: "lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[600px]",
    color: "#ff3333"
  },
  {
    name: "Oakley",
    origin: "CALIFORNIA, USA",
    styles: "89 STYLES",
    est: "EST. 1975",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
    gridClass: "lg:col-span-2 lg:row-span-1 h-[284px]",
    color: "#ff7700"
  },
  {
    name: "Gucci",
    origin: "FLORENCE, ITALY",
    styles: "112 STYLES",
    est: "EST. 1921",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    gridClass: "lg:col-span-2 lg:row-span-1 h-[284px]",
    color: "#00aa00"
  },
  {
    name: "Prada",
    origin: "MILAN, ITALY",
    styles: "78 STYLES",
    est: "EST. 1913",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb2224__901_32__p21__shad__al2.png",
    gridClass: "lg:col-span-1 lg:row-span-1 h-[280px]",
    color: "#333333"
  },
  {
    name: "Versace",
    origin: "REGGIO CALABRIA, ITALY",
    styles: "94 STYLES",
    est: "EST. 1978",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    gridClass: "lg:col-span-1 lg:row-span-1 h-[280px]",
    color: "#ffcc00"
  },
  {
    name: "Tom Ford",
    origin: "AUSTIN, USA",
    styles: "65 STYLES",
    est: "EST. 2005",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb0832s__684532__p21__shad__al2_1.png",
    gridClass: "lg:col-span-1 lg:row-span-1 h-[280px]",
    color: "#443322"
  },
  {
    name: "Carrera",
    origin: "VERONA, ITALY",
    styles: "54 STYLES",
    est: "EST. 1956",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    gridClass: "lg:col-span-1 lg:row-span-1 h-[280px]",
    color: "#cc0000"
  }
];

export default function BrandShowcase() {
  return (
    <section className="py-24 bg-navy relative">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Heritage Collection</span>
            <h2 className="text-4xl md:text-6xl font-serif text-cream leading-tight">
              Iconic <span className="italic text-gold">Maisons</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showcaseBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-[1.5rem] border border-white/5 hover:border-white/20 transition-all duration-700 ${brand.gridClass}`}
              style={{ backgroundColor: 'var(--navy-surface)' }}
            >
              <Link href={`/shop?brand=${brand.name}`} className="block w-full h-full relative">

                {/* Atmospheric Aurora Glows */}
                <div
                  className="absolute -top-24 -left-24 w-72 h-72 rounded-full mix-blend-screen opacity-10 group-hover:opacity-40 group-hover:scale-150 transition-all duration-1000 ease-out"
                  style={{ background: brand.color, filter: 'blur(90px)' }}
                />

                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full mix-blend-screen opacity-5 group-hover:opacity-20 group-hover:scale-[2] transition-all duration-1000 delay-100 ease-out"
                  style={{ background: 'var(--gold)', filter: 'blur(60px)' }}
                />

                <div
                  className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full mix-blend-screen opacity-10 group-hover:opacity-30 group-hover:scale-150 transition-all duration-1000 delay-200 ease-out"
                  style={{ background: brand.color, filter: 'blur(90px)' }}
                />

                {/* Cinematic Film Grain Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Background Image (Floating Glasses) */}
                <div className="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-1 z-10">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-[85%] h-[85%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                  />
                </div>

                {/* HUD Overlay Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  {/* Top: Origin and EST */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }}></span>
                      <span className="text-[9px] tracking-[0.2em] font-medium text-cream-warm uppercase font-inter">{brand.origin}</span>
                    </div>
                    <span className="text-[9px] tracking-[0.2em] font-medium text-cream-warm/50 uppercase font-inter">{brand.est}</span>
                  </div>

                  {/* Bottom: Name and Styles */}
                  <div className="space-y-4">
                    <h3 className="text-4xl lg:text-5xl font-serif text-cream tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                      {brand.name}
                    </h3>

                    <div className="pt-4 border-t border-cream/10 flex justify-between items-center">
                      <span className="text-[9px] tracking-[0.3em] font-bold text-cream/40 uppercase font-inter">{brand.styles}</span>
                      {brand.gridClass.includes('lg:col-span-2') && (
                        <div className="flex items-center gap-2 text-[8px] tracking-[0.4em] text-cream/60 uppercase font-bold">
                          EXPLORE <span className="text-sm">→</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
