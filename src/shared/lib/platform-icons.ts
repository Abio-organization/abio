/**
 * Platform icon lookup — carried over from the legacy app's asset set.
 * Only the ~48 platforms actually referenced here were copied into
 * public/assets/platform-icons/{black,colored}/ (the old app's export had
 * ~140 unused platforms per variant that weren't worth carrying over).
 *
 * Two pre-existing gaps in the source assets, left as-is rather than guessed at:
 *  - linkedin has no colored variant file at all (source export never had one).
 *  - slack: the old lookup table used "Social=Slack, Style=Original.svg" (with a
 *    space) but the actual file on disk has no space. Fixed here to match the
 *    real filename.
 */
export const PLATFORM_ICON_FILES: Record<string, { black: string; colored: string | null }> = {
  instagram: { black: 'Social=Instagram,Style=Black.svg', colored: 'Social=Instagram,Style=Original.svg' },
  tiktok: { black: 'Social=TikTok,Style=Black.svg', colored: 'Social=TikTok,Style=Original.svg' },
  youtube: { black: 'Social=YouTube,Style=Black.svg', colored: 'Social=YouTube,Style=Original.svg' },
  facebook: { black: 'Social=Facebook,Style=Black.svg', colored: 'Social=Facebook,Style=Original.svg' },
  snapchat: { black: 'Social=Snapchat,Style=Black.svg', colored: 'Social=Snapchat,Style=Original.svg' },
  pinterest: { black: 'Social=Pinterest,Style=Black.svg', colored: 'Social=Pinterest,Style=Original.svg' },
  whatsapp: { black: 'Social=WhatsApp,Style=Black.svg', colored: 'Social=WhatsApp,Style=Original.svg' },
  telegram: { black: 'Social=Telegram,Style=Black.svg', colored: 'Social=Telegram,Style=Original.svg' },
  github: { black: 'Social=Github,Style=Black.svg', colored: 'Social=Github,Style=Original.svg' },
  behance: { black: 'Social=Behance,Style=Black.svg', colored: 'Social=Behance,Style=Original.svg' },
  dribbble: { black: 'Social=Dribbble,Style=Black.svg', colored: 'Social=Dribbble,Style=Original.svg' },
  figma: { black: 'Social=Figma,Style=Black.svg', colored: 'Social=Figma,Style=Original.svg' },
  google: { black: 'Social=Google,Style=Black.svg', colored: 'Social=Google,Style=Original.svg' },
  x: { black: 'Social=X ex Twitter,Style=Black.svg', colored: 'Social=X ex Twitter,Style=Original.svg' },
  twitter: { black: 'Social=X ex Twitter,Style=Black.svg', colored: 'Social=X ex Twitter,Style=Original.svg' },
  spotify: { black: 'Social=Spotify,Style=Black.svg', colored: 'Social=Spotify,Style=Original.svg' },
  'apple-music': { black: 'Social=Apple Music,Style=Black.svg', colored: 'Social=Apple Music,Style=Original.svg' },
  'apple-podcasts': { black: 'Social=Apple Podcasts,Style=Black.svg', colored: 'Social=Apple Podcasts,Style=Original.svg' },
  soundcloud: { black: 'Social=SoundCloud,Style=Black.svg', colored: 'Social=SoundCloud,Style=Original.svg' },
  reddit: { black: 'Social=Reddit,Style=Black.svg', colored: 'Social=Reddit,Style=Original.svg' },
  discord: { black: 'Social=Discord,Style=Black.svg', colored: 'Social=Discord,Style=Original.svg' },
  linkedin: { black: 'Social=Linkedin,Style=Black.svg', colored: null },
  threads: { black: 'Social=Threads,Style=Black.svg', colored: 'Social=Threads,Style=Original.svg' },
  twitch: { black: 'Social=Twitch,Style=Black.svg', colored: 'Social=Twitch,Style=Original.svg' },
  medium: { black: 'Social=Medium,Style=Black.svg', colored: 'Social=Medium,Style=Original.svg' },
  notion: { black: 'Social=Notion,Style=Black.svg', colored: 'Social=Notion,Style=Original.svg' },
  signal: { black: 'Social=Signal,Style=Black.svg', colored: 'Social=Signal,Style=Original.svg' },
  skype: { black: 'Social=Skype,Style=Black.svg', colored: 'Social=Skype,Style=Original.svg' },
  slack: { black: 'Social=Slack, Style=Black.svg', colored: 'Social=Slack,Style=Original.svg' },
  vimeo: { black: 'Social=Vimeo,Style=Black.svg', colored: 'Social=Vimeo,Style=Original.svg' },
  wechat: { black: 'Social=WeChat,Style=Black.svg', colored: 'Social=WeChat,Style=Original.svg' },
  zoom: { black: 'Social=Zoom,Style=Black.svg', colored: 'Social=Zoom,Style=Original.svg' },
  gmail: { black: 'Social=Gmail,Style=Black.svg', colored: 'Social=Gmail,Style=Original.svg' },
  kickstarter: { black: 'Social=Kickstarter,Style=Black.svg', colored: 'Social=Kickstarter,Style=Original.svg' },
  patreon: { black: 'Social=Patreon,Style=Black.svg', colored: 'Social=Patreon,Style=Original.svg' },
  tinder: { black: 'Social=Tinder,Style=Black.svg', colored: 'Social=Tinder,Style=Original.svg' },
  tumblr: { black: 'Social=Tumblr,Style=Black.svg', colored: 'Social=Tumblr,Style=Original.svg' },
  messenger: { black: 'Social=Messenger,Style=Black.svg', colored: 'Social=Messenger,Style=Original.svg' },
  quora: { black: 'Social=Quora,Style=Black.svg', colored: 'Social=Quora,Style=Original.svg' },
  onlyfans: { black: 'Social=OnlyFans,Style=Black.svg', colored: 'Social=OnlyFans,Style=Original.svg' },
  apple: { black: 'Social=Apple,Style=Black.svg', colored: 'Social=Apple,Style=Original.svg' },
  viber: { black: 'Social=Viber,Style=Black.svg', colored: 'Social=Viber,Style=Original.svg' },
  vk: { black: 'Social=VK,Style=Black.svg', colored: 'Social=VK,Style=Original.svg' },
  xing: { black: 'Social=Xing,Style=Black.svg', colored: 'Social=Xing,Style=Original.svg' },
  yelp: { black: 'Social=Yelp,Style=Black.svg', colored: 'Social=Yelp,Style=Original.svg' },
  'youtube-music': { black: 'Social=Youtube Music,Style=Black.svg', colored: 'Social=Youtube Music,Style=Original.svg' },
  'vk-music': { black: 'Social=VK Music,Style=Black.svg', colored: 'Social=VK Music,Style=Original.svg' },
  'google-play': { black: 'Social=Google Play,Style=Black.svg', colored: 'Social=Google Play,Style=Original.svg' },
  'stack-overflow': { black: 'Social=Stack Overflow,Style=Black.svg', colored: 'Social=Stack Overflow,Style=Original.svg' },
}

/** Display name for a platform (used in the icon picker) */
export const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  snapchat: 'Snapchat',
  pinterest: 'Pinterest',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  github: 'GitHub',
  behance: 'Behance',
  dribbble: 'Dribbble',
  figma: 'Figma',
  google: 'Google',
  x: 'X (Twitter)',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  spotify: 'Spotify',
  'apple-music': 'Apple Music',
  'apple-podcasts': 'Apple Podcasts',
  soundcloud: 'SoundCloud',
  discord: 'Discord',
  reddit: 'Reddit',
  threads: 'Threads',
  twitch: 'Twitch',
  medium: 'Medium',
  notion: 'Notion',
  signal: 'Signal',
  skype: 'Skype',
  slack: 'Slack',
  vimeo: 'Vimeo',
  wechat: 'WeChat',
  zoom: 'Zoom',
  gmail: 'Gmail',
  kickstarter: 'Kickstarter',
  patreon: 'Patreon',
  tinder: 'Tinder',
  tumblr: 'Tumblr',
  messenger: 'Messenger',
  quora: 'Quora',
  onlyfans: 'OnlyFans',
  apple: 'Apple',
  viber: 'Viber',
  vk: 'VK',
  xing: 'Xing',
  yelp: 'Yelp',
  'youtube-music': 'YouTube Music',
  'vk-music': 'VK Music',
  'google-play': 'Google Play',
  'stack-overflow': 'Stack Overflow',
}

/** Normalize a raw platform string to the lookup key used in PLATFORM_ICON_FILES */
export function normalizePlatformId(platform: string): string {
  return platform.toLowerCase().replace(/\s+/g, '-')
}

/** Get the public URL for a platform icon. Returns null if no icon exists for that variant. */
export function getPlatformIconUrl(platform: string, variant: 'black' | 'colored'): string | null {
  const entry = PLATFORM_ICON_FILES[normalizePlatformId(platform)]
  if (!entry) return null
  const filename = variant === 'black' ? entry.black : entry.colored
  if (!filename) return null
  return `/assets/platform-icons/${variant}/${encodeURIComponent(filename)}`
}
