export interface UserProfile {
  id: string
  username: string
  displayName: string | null
  bio: string | null
  location: string | null
  avatarUrl: string | null
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile
}

export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  email: string
  password: string
}
