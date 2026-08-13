import { apiClient } from '@/shared/lib/api-client'
import { API_BASE_URL } from '@/shared/lib/env'
import type { ApiResponse } from '@/shared/types'

import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponseData,
  RefreshResponseData,
  RefreshTokenPayload,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  Setup2FaResponseData,
  SignUpPayload,
  UpdatePasswordPayload,
  User,
  Verify2FaPayload,
  Verify2FaResponseData,
  VerifyEmailPayload,
  VerifyEmailResponseData,
} from '@/features/auth/types'

export async function signUp(payload: SignUpPayload) {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/signup', payload)
  return data
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', payload)
  return data
}

export async function refreshSession(payload: RefreshTokenPayload) {
  const { data } = await apiClient.post<ApiResponse<RefreshResponseData>>('/auth/refresh', payload)
  return data
}

export async function logout() {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout')
  return data
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const { data } = await apiClient.post<ApiResponse<VerifyEmailResponseData>>('/auth/verify-email', payload)
  return data
}

export async function resendVerificationEmail(payload: ResendVerificationEmailPayload) {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/resend-verification-email', payload)
  return data
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/forgot-password', payload)
  return data
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/reset-password', payload)
  return data
}

/** Authenticated — requires a signed-in user. */
export async function updatePassword(payload: UpdatePasswordPayload) {
  const { data } = await apiClient.patch<ApiResponse<null>>('/auth/update-password', payload)
  return data
}

/** Authenticated — starts TOTP 2FA setup, returns a QR code to scan. */
export async function setup2Fa() {
  const { data } = await apiClient.get<ApiResponse<Setup2FaResponseData>>('/auth/2fa/totp/activate')
  return data
}

export async function verify2Fa(payload: Verify2FaPayload) {
  const { data } = await apiClient.post<ApiResponse<Verify2FaResponseData>>('/auth/2fa/totp/verify', payload)
  return data
}

/** Authenticated — the currently signed-in user (GET /user). */
export async function getCurrentUser() {
  const { data } = await apiClient.get<ApiResponse<User>>('/user')
  return data
}

/**
 * Full-page redirect, not a fetch — the backend's Google OAuth flow is
 * redirect-based (passport → Google → /auth/google/callback → back to
 * CLIENT_URL/auth/google/callback?accessToken=...).
 */
export function getGoogleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`
}
