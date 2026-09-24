import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/lib/query-keys'
import { getCurrentUser } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth-store'

import {
  getNotificationSettings,
  getPrivacySettings,
  updateAccountEmail,
  updateNotificationSettings,
  updatePrivacySettings,
  type ProfileVisibility,
} from '../api/settings.api'

export function usePrivacySettings() {
  return useQuery({
    queryKey: queryKeys.accountSettings.privacy,
    queryFn: getPrivacySettings,
  })
}

export function useUpdatePrivacy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (visibility: ProfileVisibility) => updatePrivacySettings(visibility),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.accountSettings.privacy, data)
    },
  })
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: queryKeys.accountSettings.notifications,
    queryFn: getNotificationSettings,
  })
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (emailOnLinkTap: boolean) => updateNotificationSettings(emailOnLinkTap),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.accountSettings.notifications, data)
    },
  })
}

/** Updates the email, then re-fetches the user so the new (unverified) address is reflected everywhere. */
export function useUpdateAccountEmail() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (email: string) => updateAccountEmail(email),
    onSuccess: async () => {
      const res = await getCurrentUser()
      setUser(res.data)
      queryClient.setQueryData(queryKeys.user, res.data)
    },
  })
}
