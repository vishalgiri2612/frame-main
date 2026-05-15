import { getProductsDB } from '@/lib/feed';
import ArrivalsClient from './ArrivalsClient';

export const revalidate = 3600;

export default async function ArrivalsPage() {
  const allProducts = await getProductsDB();
  
  // Filter for new arrivals
  const arrivals = allProducts.filter(p => p.isNew).sort((a, b) => {
    // Prioritize manually flagged
    if (a.newArrival && !b.newArrival) return -1;
    if (!a.newArrival && b.newArrival) return 1;
    
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });

  return <ArrivalsClient products={arrivals} />;
}
