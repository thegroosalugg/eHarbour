import Listings from '@/components/listings/Listings';
import { useFetch } from '@/hooks/useFetch';

export default function MarketPage() {
  const { data: listings, isLoading } = useFetch('listings');

  return  <Listings listings={(listings || [])} isLoading={isLoading} />
}
