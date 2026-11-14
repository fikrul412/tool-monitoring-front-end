import { describe, expect, it, beforeEach } from 'vitest';
import { api } from '@/lib/axios';
import { getAccessToken, saveAccessToken, clearAccessToken } from './access-token';

describe('browser auth token fallback', () => {
  beforeEach(() => sessionStorage.clear());

  it('adds a bearer token without changing the existing API endpoint path', async () => {
    saveAccessToken('incognito-session-token');
    let requestPath = '';
    let authorization = '';
    await api.get('/identity/me', {
      adapter: async (config) => {
        requestPath = config.url ?? '';
        authorization = String(config.headers.get('Authorization') ?? '');
        return { data: { id: 'user-1' }, status: 200, statusText: 'OK', headers: {}, config };
      },
    });
    expect(requestPath).toBe('/identity/me');
    expect(authorization).toBe('Bearer incognito-session-token');
  });

  it('clears the session token on logout', () => {
    saveAccessToken('session-token');
    expect(getAccessToken()).toBe('session-token');
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});
