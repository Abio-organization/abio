import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/lib/query-keys'

import {
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  resendVerificationEmail,
  resetPassword,
  setup2Fa,
  signUp,
  updatePassword,
  verify2Fa,
  verifyEmail,
} from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  SignUpPayload,
  UpdatePasswordPayload,
  Verify2FaPayload,
  VerifyEmailPayload,
} from '@/features/auth/types'


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


export function useSignUp() {
  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
  })
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (res) => {
      setSession(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
      queryClient.setQueryData(queryKeys.user, res.data.user)
    },
  })
}

export function useLogout() {
  const signOut = useAuthStore((s) => s.signOut)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      // Sign out locally even if the network call fails — the user asked to leave.
      signOut()
      queryClient.clear()
    },
  })
}

/** Verifying the emailed token also logs the user in. */
export function useVerifyEmail() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => verifyEmail(payload),
    onSuccess: (res) => {
      setSession(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
      queryClient.setQueryData(queryKeys.user, res.data.user)
    },
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (payload: ResendVerificationEmailPayload) => resendVerificationEmail(payload),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => updatePassword(payload),
  })
}

export function useSetup2Fa() {
  return useMutation({
    mutationFn: () => setup2Fa(),
  })
}

export function useVerify2Fa() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Verify2FaPayload) => verify2Fa(payload),
    onSuccess: (res) => {
      setSession(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
      queryClient.setQueryData(queryKeys.user, res.data.user)
    },
  })
}
