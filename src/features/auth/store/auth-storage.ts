import { clearAuthTokens, setAccessTokenOnly, setAuthTokens } from '@/shared/lib/auth-tokens'

import type { User } from '@/features/auth/types'

const USER_DATA_KEY = 'auth_user'

export function setAuthSession(tokens: { accessToken: string; refreshToken: string }, user: User): void {
  setAuthTokens(tokens.accessToken, tokens.refreshToken)
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

/** Google OAuth callback path — see setAccessTokenOnly for why there's no refreshToken here. */
export function setAccessTokenSession(accessToken: string, user: User): void {
  setAccessTokenOnly(accessToken)
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_DATA_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function clearAuthSession(): void {
  clearAuthTokens()
  localStorage.removeItem(USER_DATA_KEY)
}
