import { useCallback, useState, useContext } from 'react';
import { Fetch, fetchData } from '../util/fetchData';
import { Context } from '@/store/Context';
import { useNavigate } from 'react-router-dom';

type Error = {
  status: number;
}

export function useHTTP<T = null>(initialData = null) {
  const [     data,      setData] = useState<T      | null>(initialData);
  const [    error,     setError] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {               setToken} = useContext(Context);
  const navigate = useNavigate();

  const sendRequest = useCallback(async ({ url, method, data }: Fetch) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchData({ url, method, data, token });
      if (response?.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
      }
      setData(response);
      setIsLoading(false);
      return response;
    } catch (err) {
      if ((err as Error).status === 403) {
        localStorage.removeItem('token');
        setToken(null);
        url !== 'user-listings' && navigate('/account')
      }
      setIsLoading(false);
      setError(err as object);
    }
  }, [setToken, navigate]);

  return { data, setData, setToken, isLoading, error, setError, sendRequest };
}
