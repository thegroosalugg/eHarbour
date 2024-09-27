import { useFetch } from '@/hooks/useFetch';
import Chats from '@/components/chat/Chats';
import ErrorPage from '@/components/error/Error';
import LoadingIndicator from '@/components/loading/LoadingIndicator';
import Chat from '@/models/Chat';

export default function Inbox() {
  const { data: chats, setData, isLoading, error } = useFetch<Chat[]>('chats');

  return isLoading ? (
    <LoadingIndicator />
  ) : error ? (
    <ErrorPage type='inbox' />
  ) : (
    <Chats chats={chats || []} setChats={setData}  />
  );
}
