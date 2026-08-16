import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'
import type { AppearancePayload } from '@/features/appearance/types'
import type { Profile } from '@/features/auth/types'


export async function updateProfile(payload: Partial<Profile>) {
  const { data } = await apiClient.patch<ApiResponse<Profile>>('/user/profile', payload)
  return data
}

export async function updateProfileAvatar(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await apiClient.patch<ApiResponse<Profile>>(
    '/user/profile/avatar',
    formData,
    { signal },
  )
  return data
}

export interface CheckUsernameResult {
  username: string
  isAvailable: boolean
  isValid: boolean
}

export async function checkUsername(username: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<ApiResponse<CheckUsernameResult>>('/user/check-username', {
    params: { username },
    signal,
  })
  return data
}

/** `GET /user/:username` — flat profile fields at the top level, not nested under `profile`. */
export interface PublicProfileResult {
  id: string
  username: string | null
  bio: string | null
  location: string | null
  avatarUrl: string | null
  isPublic: boolean
  links: import('@/features/links/types').Link[]
  user: { name: string }
  display: AppearancePayload
}

export async function getPublicProfile(username: string) {
  const { data } = await apiClient.get<ApiResponse<PublicProfileResult>>(`/user/${username}`)
  return data
}
