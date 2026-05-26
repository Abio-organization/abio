import { create } from 'zustand'

import type { AuthUser } from '@/types/auth.types'

import { clearAuthSession, getStoredUser, setAuthSession } from './auth-storage'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser, token: string) => void
  signOut: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: Boolean(getStoredUser()),

  setUser: (user, token) => {
    setAuthSession(token, user)
    set({ user, isAuthenticated: true })
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
    setUser: s.setUser,
    signOut: s.signOut,
    hydrateFromStorage: s.hydrateFromStorage,
  }))
