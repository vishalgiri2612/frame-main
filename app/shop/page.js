import { getProductsDB, getBrands, getCategories } from '@/lib/feed';
import ShopMain from '@/components/shop/ShopMain';

export const revalidate = 3600; // revalidate every hour

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Name A → Z', value: 'name_asc' },
];

export default async function ShopPage() {
  const products = await getProductsDB();
  const brands = getBrands(products);
  const categories = getCategories(products);

  // Ensure 'ALL' is present in brands and categories for the UI
  const uiBrands = [{ name: 'ALL', slug: 'all' }, ...brands];
  const uiCategories = [{ name: 'ALL', slug: 'all' }, ...categories];

  return (
    <ShopMain 
      initialProducts={products} 
      brands={uiBrands} 
      categories={uiCategories}
      sortOptions={SORT_OPTIONS}
    />
  );
}