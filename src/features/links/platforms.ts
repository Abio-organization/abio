/** Mirrors the backend's SOCIAL_PLATFORMS keys (src/shared/utils/constants.ts) plus a generic fallback. */
export const LINK_PLATFORM_OPTIONS = [
  { value: 'TWITTER', label: 'Twitter / X', titlePlaceholder: 'My Twitter / X', urlPlaceholder: 'x.com/yourname' },
  { value: 'INSTAGRAM', label: 'Instagram', titlePlaceholder: 'My Instagram', urlPlaceholder: 'instagram.com/yourname' },
  { value: 'LINKEDIN', label: 'LinkedIn', titlePlaceholder: 'My LinkedIn', urlPlaceholder: 'linkedin.com/in/yourname' },
  { value: 'GITHUB', label: 'GitHub', titlePlaceholder: 'My GitHub', urlPlaceholder: 'github.com/yourname' },
  { value: 'FACEBOOK', label: 'Facebook', titlePlaceholder: 'My Facebook', urlPlaceholder: 'facebook.com/yourname' },
  { value: 'YOUTUBE', label: 'YouTube', titlePlaceholder: 'My YouTube', urlPlaceholder: 'youtube.com/@yourname' },
  { value: 'TIKTOK', label: 'TikTok', titlePlaceholder: 'My TikTok', urlPlaceholder: 'tiktok.com/@yourname' },
  { value: 'DISCORD', label: 'Discord', titlePlaceholder: 'My Discord', urlPlaceholder: 'discord.gg/yourinvite' },
  { value: 'TWITCH', label: 'Twitch', titlePlaceholder: 'My Twitch', urlPlaceholder: 'twitch.tv/yourname' },
  { value: 'SPOTIFY', label: 'Spotify', titlePlaceholder: 'My Spotify', urlPlaceholder: 'open.spotify.com/artist/…' },
  { value: 'REDDIT', label: 'Reddit', titlePlaceholder: 'My Reddit', urlPlaceholder: 'reddit.com/u/yourname' },
  { value: 'PINTEREST', label: 'Pinterest', titlePlaceholder: 'My Pinterest', urlPlaceholder: 'pinterest.com/yourname' },
  { value: 'MEDIUM', label: 'Medium', titlePlaceholder: 'My Medium', urlPlaceholder: 'medium.com/@yourname' },
  { value: 'CUSTOM', label: 'Other / Custom link', titlePlaceholder: 'My Website', urlPlaceholder: 'yoursite.com' },
] as const

export function getLinkTitlePlaceholder(platform: string): string {
  return LINK_PLATFORM_OPTIONS.find((opt) => opt.value === platform)?.titlePlaceholder ?? 'Link title'
}

export function getLinkUrlPlaceholder(platform: string): string {
  return LINK_PLATFORM_OPTIONS.find((opt) => opt.value === platform)?.urlPlaceholder ?? 'example.com/yourpage'
}
