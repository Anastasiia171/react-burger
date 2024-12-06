import { getAccessToken } from './auth-tokens';

export function checkResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    return response.json().then((error) => {
      throw new Error(error.message || 'Ошибка при выполнении запроса');
    });
  }
  return response.json() as Promise<T>;
}

export function request<T>(url: string, options: RequestInit): Promise<T> {
  return fetch(url, options).then(checkResponse<T>);
}
export function authRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  return request<T>(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}
