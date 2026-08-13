import { create } from 'zustand'

import type { AuthTokens, User } from '@/features/auth/types'

import { clearAuthSession, getStoredUser, setAccessTokenSession, setAuthSession, setStoredUser } from './auth-storage'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setSession: (user: User, tokens: AuthTokens) => void
  setAccessTokenSession: (accessToken: string, user: User) => void
  setUser: (user: User) => void
  signOut: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),

  setSession: (user, tokens) => {
    setAuthSession(tokens, user)
    set({ user, isAuthenticated: true })
  },

  /** Google OAuth callback — only an access token is available client-side. */
  setAccessTokenSession: (accessToken, user) => {
    setAccessTokenSession(accessToken, user)
    set({ user, isAuthenticated: true })
  },

  /** Update the cached user without touching tokens — e.g. after a profile edit. */
  setUser: (user) => {
    set((state) => {
      if (state.isAuthenticated) {
        setStoredUser(user)
      }
      return { user }
    })
  },

  signOut: () => {
    clearAuthSession()
    set({ user: null, isAuthenticated: false })
  },

  hydrateFromStorage: () => {
    const user = getStoredUser()
    set({ user, isAuthenticated: Boolean(user) })
  },
}))

/** Prefer selectors so components only re-render when that slice changes. */
export const useAuthUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useAuthActions = () =>
  useAuthStore((s) => ({
    setSession: s.setSession,
    setAccessTokenSession: s.setAccessTokenSession,
    setUser: s.setUser,
    signOut: s.signOut,
    hydrateFromStorage: s.hydrateFromStorage,
  }))
