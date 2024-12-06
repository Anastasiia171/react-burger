import Cookies from 'js-cookie';

export function setAccessToken(token: string) {
  const cleanedToken = token.replace(/^Bearer\s/, '');
  Cookies.set('accessToken', cleanedToken, { expires: 1 });
}

export function getAccessToken() {
  return Cookies.get('accessToken');
}

export function removeAccessToken() {
  Cookies.remove('accessToken');
}

export function setRefreshToken(token: string) {
  localStorage.setItem('refreshToken', token);
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function removeRefreshToken() {
  localStorage.removeItem('refreshToken');
}
