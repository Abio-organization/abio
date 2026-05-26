import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api.types'
import type { AppearancePayload, UserProfile } from '@/types'

export async function updateProfile(payload: Partial<UserProfile>) {
  const { data } = await apiClient.patch<ApiResponse<UserProfile>>('/user/profile', payload)
  return data
}

export async function updateProfileAvatar(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await apiClient.patch<ApiResponse<UserProfile>>(
    '/user/profile/avatar',
    formData,
    { signal },
  )
  return data
}

export async function getPublicProfile(username: string) {
  const { data } = await apiClient.get<
    ApiResponse<{
      profile: UserProfile
      links: import('@/types/links.types').Link[]
      display: AppearancePayload
    }>
  >(`/user/${username}`)
  return data
}
