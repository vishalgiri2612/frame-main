import { getProductsDB, getCategories } from '@/lib/feed';
import Link from 'next/link';
import CategoriesClient from '@/components/shop/CategoriesClient';

export const revalidate = 3600;

export default async function CategoriesPage() {
  const products = await getProductsDB();
  const categories = getCategories(products);

  return (
    <CategoriesClient 
      categories={categories} 
      productCount={products.length} 
    />
  );
}
