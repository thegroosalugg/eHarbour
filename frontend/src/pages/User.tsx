import { Dispatch, SetStateAction } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useHTTP } from '@/hooks/useHTTP';
import Portal from '@/components/user/Portal';
import SignInForm from '../components/form/SignInForm';
import LoadingIndicator from '@/components/loading/LoadingIndicator';
import PageWrapper from '@/components/pages/PageWrapper';
import User from '@/models/User';

export default function UserPage() {
  const { data: user, setData, token, setToken, isLoading, error, setError, sendRequest } = useHTTP<User>();
  const { isLoading: isFetching } = useFetch('user-listings', setData);

  const handleLogin = async (url: string, data: object) => {
    await sendRequest({ url, method: 'POST', data });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setData(null);
    setToken(null);
  };

  return (
    <PageWrapper recreate={token}>
      {isFetching ? (
        <LoadingIndicator key='lds' />
      ) : token && user ? (
        <Portal key='portal' user={user} isLoading={isLoading} setData={setData as Dispatch<SetStateAction<User>>} onLogout={handleLogout} />
      ) : (
        <SignInForm key='form' isLoading={isLoading} error={error} setError={setError} onLogin={handleLogin} />
      )}
    </PageWrapper>
  );
}
