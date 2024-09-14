import { useFetch } from '@/hooks/useFetch';
import Chats from '@/components/chat/Chats';
import ErrorPage from '@/components/error/Error';
import LoadingIndicator from '@/components/loading/LoadingIndicator';

export default function Inbox() {
  const { data: chats, isLoading, error } = useFetch('chats');

  return isLoading ? (
    <LoadingIndicator />
  ) : error ? (
    <ErrorPage type='inbox' />
  ) : (
    <Chats chats={chats || []} />
  );
}
