import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getCurrentUser, signIn, signUp } from '@/features/auth/api/auth.api'
import { queryKeys } from '@/shared/lib/query-keys'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { SignInPayload, SignUpPayload } from '@/features/auth/types'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const res = await getCurrentUser()
      return res.data
    },
    enabled: isAuthenticated,
  })
}

export function useSignIn() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (res) => {
      setUser(res.data.user, res.data.token)
      queryClient.setQueryData(queryKeys.user, res.data.user)
    },
  })
}

export function useSignUp() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (res) => {
      setUser(res.data.user, res.data.token)
      queryClient.setQueryData(queryKeys.user, res.data.user)
    },
  })
}
