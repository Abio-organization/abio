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

export async function getPublicProfile(username: string) {
  const { data } = await apiClient.get<
    ApiResponse<{
      profile: Profile
      links: import('@/features/links/types').Link[]
      display: AppearancePayload
    }>
  >(`/user/${username}`)
  return data
}
