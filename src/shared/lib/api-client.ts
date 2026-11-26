import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_BASE_URL } from '@/shared/lib/env'
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from '@/shared/lib/auth-tokens'

/**
 * The backend accepts either an httpOnly cookie (set automatically on
 * login/refresh) or a Bearer header — it checks the header first, then
 * falls back to the cookie. We send both: `withCredentials` lets the
 * cookie flow (works even if a client ever drops the stored token), and
 * the interceptor below attaches the header explicitly since the cookie
 * itself isn't readable from JS to check "am I logged in".
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fired when a token refresh fails, meaning the session is dead (no valid
 * access or refresh token). shared/ can't import features/auth (see
 * auth-tokens.ts), so this event is the handoff — the app listens for it
 * and calls the auth store's signOut(), which flips `isAuthenticated` and
 * lets the route guards redirect to sign-in instead of looping forever.
 */
export const AUTH_LOGOUT_EVENT = 'auth:logout'

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

let refreshPromise: Promise<string | null> | null = null

/** The Bearer token a failed request was sent with, so we can tell if it's already been replaced. */
function tokenFromConfig(config: InternalAxiosRequestConfig): string | null {
  const header = config.headers?.Authorization
  return typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : null
}

/**
 * Runs `fn` while holding a lock shared by every open tab of the app, so two
 * tabs can never send the same refresh token at once. (The backend rotates
 * refresh tokens: the first use deletes it, so a second tab sending the same
 * one gets a 401 and used to log the user out everywhere.) Falls back to
 * running directly on old browsers without the Web Locks API.
 */
function withCrossTabLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks?.request) {
    return navigator.locks.request('abio-auth-refresh', fn)
  }
  return fn()
}

/**
 * Single-flight refresh — concurrent 401s in this tab share one call, and the
 * cross-tab lock stops other tabs racing it. `failedToken` is the access token
 * that just got a 401: if storage already holds a different one, another tab
 * (or an earlier refresh) has renewed the session and we just reuse it.
 */
function refreshAccessToken(failedToken: string | null): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = withCrossTabLock(async () => {
      const current = getAccessToken()
      if (current && current !== failedToken) return current

      // No early bail-out on a missing local refreshToken: older Google
      // sign-ins only stored an accessToken, and their refresh token lives in
      // the httpOnly cookie, which `withCredentials` sends automatically.
      // The backend reads body.refreshToken OR the cookie.
      const refreshToken = getRefreshToken()

      try {
        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string }
        }>(`${API_BASE_URL}/auth/refresh`, refreshToken ? { refreshToken } : {}, { withCredentials: true })

        setAuthTokens(data.data.accessToken, data.data.refreshToken)
        return data.data.accessToken
      } catch (err) {
        const status = (err as AxiosError).response?.status
        // Only a definite "no" from the server ends the session. A network
        // blip, timeout or 5xx (e.g. the API restarting during a deploy) just
        // fails this one request; the user stays signed in and the next call
        // tries again.
        if (status === 401 || status === 400 || status === 403) {
          clearAuthTokens()
          window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
        }
        return null
      }
    }).finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true
      const newToken = await refreshAccessToken(tokenFromConfig(config))
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
        return apiClient(config)
      }
    }

    return Promise.reject(error)
  },
)
