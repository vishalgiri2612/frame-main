import { getProductsDB, getFeaturedProductsDB, getTopSellingProductsDB, getShowcaseBrandsDB, getHeroSlidesDB } from '@/lib/feed';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import BrandMarquee from '@/components/sections/BrandMarquee';
import BrandShowcase from '@/components/sections/BrandShowcase';
import FeaturedFrames from '@/components/sections/FeaturedFrames';
import TheRevealLoader from '@/components/ui/TheRevealLoader';

// Dynamic imports for below-the-fold components
const TopSellingSection = dynamic(() => import('@/components/sections/TopSellingSection'), { ssr: true });
const CollectionGallery = dynamic(() => import('@/components/sections/CollectionGallery'), { ssr: true });
const Magazine = dynamic(() => import('@/components/sections/Magazine'), { ssr: true });
const BookingSection = dynamic(() => import('@/components/sections/BookingSection'), { ssr: true });
const AboutStrip = dynamic(() => import('@/components/sections/AboutStrip'), { ssr: true });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: true });

export default async function Home() {
  try {
    const [displayProducts, topSellingProducts, showcaseBrands, heroSlides] = await Promise.all([
      getFeaturedProductsDB(6),
      getTopSellingProductsDB(5),
      getShowcaseBrandsDB(),
      getHeroSlidesDB()
    ]);

    return (
      <main className="min-h-screen transition-colors duration-500" style={{ background: 'var(--navy)' }}>
        <TheRevealLoader />
        <Hero slides={heroSlides} />
        <BrandMarquee />
        <TopSellingSection products={topSellingProducts} />
        <FeaturedFrames initialProducts={displayProducts} />
        <BrandShowcase brands={showcaseBrands} />
        <CollectionGallery />
        <Magazine />
        <BookingSection />
        <AboutStrip />
        <Footer />
      </main>
    );
  } catch (error) {
    console.error("HOME_PAGE_ERROR", error);
    return (
       <div className="min-h-screen bg-navy flex items-center justify-center text-gold font-mono uppercase tracking-widest text-[10px]">
          Vault Connection Error. Please refresh.
       </div>
    );
  }
}
