import { useFetch } from '@/hooks/useFetch';
import { useHTTP } from '@/hooks/useHTTP';
import SignInForm from '../components/form/SignInForm';
import LoadingIndicator from '@/components/loading/LoadingIndicator';
import PageWrapper from '@/components/pages/PageWrapper';
import User from '@/models/User';

export default function UserPage() {
  const { data: user, setData, setToken, isLoading, error, setError, sendRequest } = useHTTP<User>();
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
    <PageWrapper recreate={user + ''}>
      {isFetching ? (
        <LoadingIndicator key='lds' />
      ) : user ? (
        // <Portal key='portal' user={user} isLoading={isLoading} onLogout={handleLogout} />
        <div>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {user._id}
          </p>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {user.email}
          </p>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {user.username}
          </p>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      ) : (
        <SignInForm key='form' isLoading={isLoading} error={error} setError={setError} onLogin={handleLogin} />
      )}
    </PageWrapper>
  );
}
