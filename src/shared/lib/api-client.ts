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

/** Single-flight refresh — concurrent 401s share one /auth/refresh call instead of racing. */
function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      // No early bail-out on a missing local refreshToken: the Google OAuth
      // flow only ever hands the client an accessToken — its refresh token
      // lives solely in the httpOnly cookie, which `withCredentials` sends
      // automatically. The backend reads body.refreshToken OR the cookie.
      const refreshToken = getRefreshToken()

      try {
        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string }
        }>(`${API_BASE_URL}/auth/refresh`, refreshToken ? { refreshToken } : {}, { withCredentials: true })

        setAuthTokens(data.data.accessToken, data.data.refreshToken)
        return data.data.accessToken
      } catch {
        clearAuthTokens()
        return null
      } finally {
        refreshPromise = null
      }
    })()
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
      const newToken = await refreshAccessToken()
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
        return apiClient(config)
      }
    }

    return Promise.reject(error)
  },
)
