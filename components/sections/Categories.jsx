'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: "Sunglasses",
    desc: "Iconic silhouettes for the modern sun-seeker.",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3025_001_58_030a_new.png",
    link: "/shop?category=sunglasses"
  },
  {
    name: "Eyeglasses",
    desc: "Precision crafted for refined clarity and comfort.",
    image: "https://india.ray-ban.com/media/catalog/product/cache/c5a5bd13e2650a156913221dd914de35/0/r/0rb3447_919631_030a.png",
    link: "/shop?category=eyeglasses"
  }
];

export default function Categories() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-cream mb-4"
          >
            Shop By <span className="italic text-gold">Category</span>
          </motion.h2>
          <div className="h-0.5 w-24 bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={cat.link} className="group block relative">
                <div className="aspect-[16/10] bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5 group-hover:border-gold/20 transition-all duration-700">
                  {/* Floating Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-12 z-20">
                    <motion.div
                      whileHover={{ y: -10, scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                    >
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={400}
                        height={200}
                        className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                      />
                    </motion.div>
                  </div>

                  {/* Removed Gradient Background to prevent color change */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Category Title */}
                  <div className="absolute bottom-0 left-0 w-full p-10 z-30">
                    <h3 className="text-3xl font-serif text-cream mb-2">{cat.name}</h3>
                    <p className="text-cream/40 text-[10px] uppercase tracking-[0.3em] group-hover:text-gold transition-colors">
                      {cat.desc}
                    </p>
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
