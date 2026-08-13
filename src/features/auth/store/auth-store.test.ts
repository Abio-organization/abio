import { beforeEach, describe, expect, it } from 'vitest'

import type { User } from '@/features/auth/types'

import { useAuthStore } from './auth-store'

const mockUser: User = {
  id: 'user-1',
  email: 'dev@abio.test',
  name: 'Dev User',
  active: true,
  isEmailVerified: true,
  isOnboardingCompleted: false,
  googleId: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  profile: {
    id: 'profile-1',
    userId: 'user-1',
    username: 'devuser',
    bio: null,
    location: null,
    avatarUrl: null,
    goals: [],
    isPublic: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
}

const mockTokens = { accessToken: 'test-access-token', refreshToken: 'test-refresh-token' }

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    })
  })

  it('starts unauthenticated when storage is empty', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('setSession persists tokens and marks authenticated', () => {
    useAuthStore.getState().setSession(mockUser, mockTokens)

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.email).toBe('dev@abio.test')
    expect(localStorage.getItem('auth_access_token')).toBe('test-access-token')
    expect(localStorage.getItem('auth_refresh_token')).toBe('test-refresh-token')
  })

  it('signOut clears session', () => {
    useAuthStore.getState().setSession(mockUser, mockTokens)
    useAuthStore.getState().signOut()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_access_token')).toBeNull()
    expect(localStorage.getItem('auth_refresh_token')).toBeNull()
  })
})
