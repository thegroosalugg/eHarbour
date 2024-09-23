import { useCallback, useState, useContext, useRef } from 'react';
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
  const {    token,     setToken} = useContext(Context);
  const navigate    = useNavigate();
  const navigateRef = useRef(navigate); // used to remove unstable navigate as useCallBack dependency

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
        method !== 'GET' && navigateRef.current('/account');
      }
      setIsLoading(false);
      setError(err as object);
    }
  }, [setToken]);

  return { data, setData, token, setToken, isLoading, error, setError, sendRequest };
}
