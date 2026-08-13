/** Mirrors the Prisma `Profile` model — note there's no `displayName` field on the backend. */
export interface Profile {
  id: string
  userId: string
  username: string | null
  avatarUrl: string | null
  bio: string | null
  location: string | null
  goals: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

/** Mirrors the Prisma `User` model, minus password/reset-token/2FA-secret fields the API never returns. */
export interface User {
  id: string
  email: string
  name: string
  active: boolean
  isEmailVerified: boolean
  isOnboardingCompleted: boolean
  googleId: string | null
  createdAt: string
  updatedAt: string
  profile: Profile | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// ─── Request payloads (mirror src/modules/auth/auth.schemas.ts on the backend) ───

export interface SignUpPayload {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  passwordConfirm: string
}

export interface UpdatePasswordPayload {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}

export interface VerifyEmailPayload {
  token: string
}

export interface ResendVerificationEmailPayload {
  email: string
}

export interface RefreshTokenPayload {
  refreshToken: string
}

export interface Verify2FaPayload {
  email: string
  token: string
}

// ─── Response `data` payloads ───

export interface LoginResponseData extends AuthTokens {
  user: User
}

export interface VerifyEmailResponseData extends AuthTokens {
  user: User
  token: string
}

export type RefreshResponseData = AuthTokens

export interface Setup2FaResponseData {
  secret: string
  url: string
  qrcode: string
}

export interface Verify2FaResponseData extends AuthTokens {
  user: User
}
