/**
 * Token & Session Storage Management
 * Handles type-safe access to access tokens, refresh tokens, and persisted user info.
 */

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user_data';

export const storage = {
  // Access Token
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // User object caching
  getUser<T = unknown>(): T | null {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },
  setUser<T = unknown>(user: T): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth items
  clearAll(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
