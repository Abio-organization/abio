import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api.types'
import type { AuthUser, SignInPayload, SignUpPayload } from '@/types/auth.types'

export async function signIn(payload: SignInPayload) {
  const { data } = await apiClient.post<ApiResponse<{ token: string; user: AuthUser }>>(
    '/auth/sign-in',
    payload,
  )
  return data
}

export async function signUp(payload: SignUpPayload) {
  const { data } = await apiClient.post<ApiResponse<{ token: string; user: AuthUser }>>(
    '/auth/sign-up',
    payload,
  )
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<ApiResponse<AuthUser>>('/user/me')
  return data
}
