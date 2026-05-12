import { getProductsDB } from '@/lib/feed';
import ContactLensHeroContent from '@/components/sections/ContactLensHeroContent';
import ContactLensBrands from '@/components/sections/ContactLensBrands';
import ContactLensShopSection from '@/components/sections/ContactLensShopSection';
import Link from 'next/link';

export const revalidate = 3600;

export default async function ContactLensPage() {
  const allProducts = await getProductsDB();
  let lensProducts = allProducts.filter(p => p.category === 'CONTACT LENSES' && p.showcaseLens);
  
  // Fallback: If no products are explicitly showcased, show the first 4 contact lenses
  if (lensProducts.length === 0) {
    lensProducts = allProducts.filter(p => p.category === 'CONTACT LENSES').slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <ContactLensHeroContent />
      
      <ContactLensBrands />

      {/* New Shop Section for Contact Lenses */}
      <ContactLensShopSection products={lensProducts} />

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to see the world clearly?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/shop?category=CONTACT LENSES"
                  className="px-8 py-4 bg-[var(--gold)] text-[var(--navy)] font-bold rounded-full hover:bg-[var(--gold-light)] transition-all shadow-lg uppercase tracking-widest text-[11px]"
                >
                  Shop Contact Lenses
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-bold rounded-full hover:bg-zinc-800 transition-all"
                >
                  Consult an Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
