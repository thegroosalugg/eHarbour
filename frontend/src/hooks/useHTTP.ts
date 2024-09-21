import { useCallback, useState, useContext } from 'react';
import { Fetch, fetchData } from '../util/fetchData';
import { Context } from '@/store/Context';

export function useHTTP<T = null>(initialData = null) {
  const [     data,      setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [    error,     setError] = useState<object | null>(null);
  const {               setToken} = useContext(Context);

  const sendRequest = useCallback(async ({ url, method, data, token }: Fetch) => {
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
      setIsLoading(false);
      setError(err as object);
    }
  }, [setToken]);

  return { data, setData, setToken, isLoading, error, setError, sendRequest };
}
