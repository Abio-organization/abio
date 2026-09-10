export const queryKeys = {
  settings: ['settings'] as const,
  links: ['links'] as const,
  user: ['user'] as const,
  userProfile: (username: string) => ['user-profile', username] as const,
  themes: ['themes'] as const,
  analytics: {
    summary: (range: string) => ['analytics', 'summary', range] as const,
    daily: (range: string) => ['analytics', 'daily', range] as const,
    links: (range: string) => ['analytics', 'links', range] as const,
  },
}
