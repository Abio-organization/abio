import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'

/** Mirrors `profile.isPublic` (true = public, false = private) — src/modules/settings/settings.schemas.ts */
export type ProfileVisibility = 'public' | 'private'

export interface PrivacySettings {
  visibility: ProfileVisibility
}

export interface NotificationSettings {
  emailOnLinkTap: boolean
}

export async function getPrivacySettings() {
  const { data } = await apiClient.get<ApiResponse<PrivacySettings>>('/user/settings/privacy')
  return data.data
}

export async function updatePrivacySettings(visibility: ProfileVisibility) {
  const { data } = await apiClient.patch<ApiResponse<PrivacySettings>>('/user/settings/privacy', { visibility })
  return data.data
}

export async function getNotificationSettings() {
  const { data } = await apiClient.get<ApiResponse<NotificationSettings>>('/user/settings/notifications')
  return data.data
}

export async function updateNotificationSettings(emailOnLinkTap: boolean) {
  const { data } = await apiClient.patch<ApiResponse<NotificationSettings>>('/user/settings/notifications', {
    emailOnLinkTap,
  })
  return data.data
}

/**
 * Changing email re-sends verification and flips `isEmailVerified` to false
 * server-side — the response data is `null`, so re-fetch the current user
 * afterwards to pick up the new (unverified) address.
 */
export async function updateAccountEmail(email: string) {
  const { data } = await apiClient.patch<ApiResponse<null>>('/user/profile/email', { email })
  return data
}
