import { getProductByIdDB, getProductsDB } from '@/lib/feed';
import ProductDetailClient from '@/components/shop/ProductDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function ProductPage({ params }) {
  // Catch-all route returns an array for the id param
  const idArray = params.id || [];
  const id = Array.isArray(idArray) ? idArray.join('/') : idArray;
  const decodedId = decodeURIComponent(id);
  
  // Fetch from DB
  const product = await getProductByIdDB(decodedId);
  
  if (!product) {
    notFound();
  }

  // Fetch similar products (maybe just first 4 for now)
  const allProducts = await getProductsDB();
  const similarProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  return <ProductDetailClient product={product} similarProducts={similarProducts} />;
}
