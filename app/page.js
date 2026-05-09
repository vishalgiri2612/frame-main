import { getProductsDB, getFeaturedProductsDB, getTopSellingProductsDB, getShowcaseBrandsDB, getHeroSlidesDB } from '@/lib/feed';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import BrandMarquee from '@/components/sections/BrandMarquee';
import BrandShowcase from '@/components/sections/BrandShowcase';
import FeaturedFrames from '@/components/sections/FeaturedFrames';
import CollectionGallery from '@/components/sections/CollectionGallery';
import Magazine from '@/components/sections/Magazine';
import AboutStrip from '@/components/sections/AboutStrip';
import BookingSection from '@/components/sections/BookingSection';
import TopSellingSection from '@/components/sections/TopSellingSection';
import TheRevealLoader from '@/components/ui/TheRevealLoader';

export default async function Home() {
  try {
    const displayProducts = await getFeaturedProductsDB(6);
    const topSellingProducts = await getTopSellingProductsDB(5);
    const showcaseBrands = await getShowcaseBrandsDB();
    const heroSlides = await getHeroSlidesDB();

    return (
      <main className="min-h-screen transition-colors duration-500" style={{ background: 'var(--navy)' }}>
        <TheRevealLoader />
        <Hero slides={heroSlides} />
        <BrandMarquee />
        <BrandShowcase brands={showcaseBrands} />
        <TopSellingSection products={topSellingProducts} />
        <FeaturedFrames initialProducts={displayProducts} />
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
