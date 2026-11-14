const ACCESS_TOKEN_KEY = 'tool_monitor_access_token';

export function saveAccessToken(token: string) {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
