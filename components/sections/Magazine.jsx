'use client';
import Link from 'next/link';
import Image from 'next/image';

const articles = [
  {
    tag: 'Style Guide',
    readTime: '8 min',
    title: 'Framing Your Identity: The Art of Luxury Spectacles',
    excerpt: 'How the right frame transforms not just how you see the world, but how the world sees you.',
    image: '/m1.png',
  },
  {
    tag: 'Craftsmanship',
    readTime: '5 min',
    title: 'The Hands Behind the Polish: 90 Days of Acetate Curing',
    excerpt: 'Inside the atelier where patience meets precision.',
    image: '/m2.png',
  },
  {
    tag: 'Brand Spotlight',
    readTime: '6 min',
    title: 'Cartier: The Legacy of the Panthère Silhouette',
    excerpt: 'A century of feline elegance in optical design.',
    image: '/m3.png',
  },
];

export default function Magazine() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-6xl font-serif tracking-tight text-gray-900">
              Editorial<br />
              <span className="italic">Journal</span>
            </h2>
          </div>
          <Link href="/magazine" className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Read the Journal →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="/magazine/cover.png"
                  alt="Journal Cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
            </div>
            <div className="mt-8 text-center">
              <h3 className="font-serif text-2xl italic">Journal of Sight</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Vol. IV — Masterworks</p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between h-full py-4">
            {articles.map((article, i) => (
              <Link href="/magazine" key={i} className="group flex gap-10 items-center">
                <div className="relative w-64 aspect-[1.5/1] bg-gray-100 rounded-sm overflow-hidden shrink-0 shadow-lg">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="max-w-md">
                  <div className="flex items-center gap-3 mb-3 text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">
                    <span className="text-gray-900">{article.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-serif text-2xl md:text-3xl text-gray-900 group-hover:text-gray-600 transition-colors leading-tight">
                    {article.title}
                  </h4>
                  <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
