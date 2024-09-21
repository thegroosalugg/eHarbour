import { Context } from '@/store/Context';
import { useContext } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useHTTP } from '@/hooks/useHTTP';
import Portal from '@/components/user/Portal';
import SignInForm from '../components/form/SignInForm';
import LoadingIndicator from '@/components/loading/LoadingIndicator';
import PageWrapper from '@/components/pages/PageWrapper';
import User from '@/models/User';
import Listing from '@/models/Listing';

export default function UserPage() {
  const { data, setData, isLoading, error, setError, sendRequest } = useHTTP();
  const { isLoading: isFetching } = useFetch('user-listings', setData);
  const { setUser } = useContext(Context);

  const handleLogin = async (url: string, data: object) => {
    const response = await sendRequest({ url, method: 'POST', data });
    if (response) {
      setUser(response);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setData(null);
  };

  return (
    <PageWrapper recreate={data}>
      {isFetching ? (
        <LoadingIndicator key='lds' />
      ) : data ? (
        // <Portal key='portal' user={user} isLoading={isLoading} onLogout={handleLogout} />
        <div>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {data._id}
          </p>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {data.email}
          </p>
          <p style={{ width: 300, height: 50, border: '1px solid #000' }}>
            {data.username}
          </p>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      ) : (
        <SignInForm key='form' isLoading={isLoading} error={error} setError={setError} onLogin={handleLogin} />
      )}
    </PageWrapper>
  );
}
