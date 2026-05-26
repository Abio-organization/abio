export const queryKeys = {
  settings: ['settings'] as const,
  links: ['links'] as const,
  user: ['user'] as const,
  userProfile: (username: string) => ['user-profile', username] as const,
}
