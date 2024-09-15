import Listings from '@/components/products/Products';
import { useFetch } from '@/hooks/useFetch';

export default function MarketPage() {
  const { data: user } = useFetch('login');
  const { data: listings, isLoading } = useFetch('listings' + (user ? '/populated' : ''));

  return  <Listings isLoggedIn={user} listings={(listings || [])} isLoading={isLoading} />

}
