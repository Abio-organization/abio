import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile, updateProfileAvatar } from '@/features/profile/api/profile.api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { Profile, User } from '@/features/auth/types'
import { queryKeys } from '@/shared/lib/query-keys'

function mergeProfileIntoUser(user: User | null, profile: Profile): User | null {
  if (!user) return user
  return { ...user, profile }
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (payload: Partial<Profile>) => updateProfile(payload),
    onSuccess: (res) => {
      const nextUser = mergeProfileIntoUser(user, res.data)
      if (nextUser) {
        setUser(nextUser)
        queryClient.setQueryData(queryKeys.user, nextUser)
      }
    },
  })
}

export function useUpdateProfileAvatar() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (file: File) => updateProfileAvatar(file),
    onSuccess: (res) => {
      const nextUser = mergeProfileIntoUser(user, res.data)
      if (nextUser) {
        setUser(nextUser)
        queryClient.setQueryData(queryKeys.user, nextUser)
      }
    },
  })
}
