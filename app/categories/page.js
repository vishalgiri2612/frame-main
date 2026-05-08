import { getProductsDB, getCategoriesDB } from '@/lib/feed';
import Link from 'next/link';
import CategoriesClient from '@/components/shop/CategoriesClient';

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await getCategoriesDB();
  const productCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <CategoriesClient 
      categories={categories} 
      productCount={productCount} 
    />
  );
}
