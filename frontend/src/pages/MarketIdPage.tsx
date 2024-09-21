import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '@/store/Context';
import { useFetch } from '@/hooks/useFetch';
import { useHTTP } from '@/hooks/useHTTP';
import ListingIdPage from '@/components/details/ListingIdPage';
import ErrorPage from '@/components/error/Error';
import LoadingIndicator from '@/components/loading/LoadingIndicator';

export default function MarketIdPage() {
  const { listingId } = useParams();
  const { data: listing, setData, sendRequest, isLoading, error, setError } = useHTTP();
  const { isLoading: isFetching } = useFetch('listing/' + listingId, setData);
  const { data: user } = useFetch('login');
  const { setExpanded } = useContext(Context);
  const { navTo, isAnimating, setIsAnimating } = useContext(Context);

  const updateItem = async (data: object) => {
    setIsAnimating(true)
    const didUpdate = await sendRequest({ url: 'edit-listing/' + listingId, method: 'PUT', data });
    didUpdate && setExpanded(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const deleteItem = async () => {
    const hasError = await sendRequest({ url: 'delete-listing/' + listingId, method: 'DELETE' });
    if (!hasError) {
      navTo('/account');
    }
  };

  const toggleForm = (ref: React.RefObject<HTMLElement>) => {
    if (!isAnimating) {
      setIsAnimating(true)
      setExpanded((toggle) => !toggle)
      setError(null);
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }

  return isFetching ? (
    <LoadingIndicator />
  ) : listing ? (
    <ListingIdPage
            user={user}
         listing={listing}
          onEdit={updateItem}
        onDelete={deleteItem}
       isLoading={isLoading}
           error={error}
      toggleForm={toggleForm}
    />
  ) : (
    <ErrorPage type='listing' />
  );
}
