/**
 * Raw access/refresh token storage. Lives in shared/ (not features/auth)
 * because the API client needs it and shared/ can't depend on a feature.
 * The auth feature owns *what a session means* (user, store, hooks) and
 * calls through these primitives; it doesn't duplicate the storage logic.
 */
const ACCESS_TOKEN_KEY = 'auth_access_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * Google OAuth only ever hands the client an accessToken (in the callback
 * redirect's query string) — its refresh token is set as an httpOnly
 * cookie directly by the server, never exposed to JS. No local
 * refreshToken is stored; the refresh interceptor falls back to the
 * cookie automatically via `withCredentials`.
 */
export function setAccessTokenOnly(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
