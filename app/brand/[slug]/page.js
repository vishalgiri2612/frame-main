import { getProductsDB, processProduct } from '@/lib/feed';
import BrandDetailClient from '@/components/shop/BrandDetailClient';

function slugify(str) {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const revalidate = 3600;

export default async function BrandPage({ params }) {
  const { slug } = params;
  const allProducts = await getProductsDB();
  
  // Find products that match this brand slug or category slug
  const products = allProducts.filter(p => 
    slugify(p.brand) === slug || 
    slugify(p.category) === slug
  );

  // Derive collection info
  const firstProduct = products[0];
  const isBrand = firstProduct && slugify(firstProduct.brand) === slug;
  
  const collection = {
    name: isBrand ? firstProduct.brand : (firstProduct ? firstProduct.category : slug.replace(/-/g, ' ').toUpperCase()),
    type: isBrand ? 'brand' : 'category',
    count: products.length,
    bio: isBrand ? `${firstProduct.brand} curated selection.` : `${firstProduct?.category || 'Collection'} category selection.`
  };

  return <BrandDetailClient collection={collection} products={products} />;
}
