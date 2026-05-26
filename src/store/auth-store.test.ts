import { beforeEach, describe, expect, it } from 'vitest'

import type { AuthUser } from '@/types/auth.types'

import { useAuthStore } from './auth-store'

const mockUser: AuthUser = {
  id: 'user-1',
  email: 'dev@abio.test',
  profile: {
    id: 'profile-1',
    username: 'devuser',
    displayName: 'Dev User',
    bio: null,
    location: null,
    avatarUrl: null,
  },
}

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

  it('setUser persists token and marks authenticated', () => {
    useAuthStore.getState().setUser(mockUser, 'test-token')

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().user?.email).toBe('dev@abio.test')
    expect(localStorage.getItem('auth_token')).toBe('test-token')
  })

  it('signOut clears session', () => {
    useAuthStore.getState().setUser(mockUser, 'test-token')
    useAuthStore.getState().signOut()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_token')).toBeNull()
  })
})
