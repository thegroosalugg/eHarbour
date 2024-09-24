export interface Fetch {
     url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
   data?: object;
  token?: string | null;
}

export const fetchData = async ({ url, method, data, token }: Fetch) => {
  const isFormData = data instanceof FormData;
  const body = data ? (isFormData ? data : JSON.stringify(data)) : null;
  const headers: HeadersInit = {};
  if (!isFormData) headers['Content-Type']  = 'application/json';
  if (token)       headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(import.meta.env.VITE_SERVER_URL + url, {
    method,
    headers,
    credentials: 'include', // send cookies to backend
    body,
  });

  const resData = await response.json();

  if (!response.ok) {
    throw { ...resData, status: response.status };
  }

  return resData;
};
