import { getProductsDB } from '@/lib/feed';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import BrandMarquee from '@/components/sections/BrandMarquee';
import BrandShowcase from '@/components/sections/BrandShowcase';
import FeaturedFrames from '@/components/sections/FeaturedFrames';
import Magazine from '@/components/sections/Magazine';
import AboutStrip from '@/components/sections/AboutStrip';
import BookingSection from '@/components/sections/BookingSection';
import TheRevealLoader from '@/components/ui/TheRevealLoader';

export default async function Home() {
  const products = await getProductsDB();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <main className="min-h-screen transition-colors duration-500" style={{ background: 'var(--navy)' }}>
      <TheRevealLoader />
      <Hero />
      <BrandMarquee />
      <BrandShowcase />
      <FeaturedFrames initialProducts={displayProducts} />
      <Magazine />
      <BookingSection />
      <AboutStrip />
      <Footer />
    </main>
  );
}
