const PLATFORM_ICONS: Record<string, string> = {
  twitter: 'Social=X ex Twitter,Style=Black.svg',
  x: 'Social=X ex Twitter,Style=Black.svg',
  instagram: 'Social=Instagram,Style=Black.svg',
  linkedin: 'Social=Linkedin,Style=Black.svg',
  github: 'Social=Github,Style=Black.svg',
  facebook: 'Social=Facebook,Style=Black.svg',
  youtube: 'Social=YouTube,Style=Black.svg',
  tiktok: 'Social=TikTok,Style=Black.svg',
  discord: 'Social=Discord,Style=Black.svg',
  twitch: 'Social=Twitch,Style=Black.svg',
  spotify: 'Social=Spotify,Style=Black.svg',
  reddit: 'Social=Reddit,Style=Black.svg',
  pinterest: 'Social=Pinterest,Style=Black.svg',
  medium: 'Social=Medium,Style=Black.svg',
  whatsapp: 'Social=WhatsApp,Style=Black.svg',
  snapchat: 'Social=Snapchat,Style=Black.svg',
  telegram: 'Social=Telegram,Style=Black.svg',
  website: 'Social=Link,Style=Black.svg',
  custom: 'Social=Link,Style=Black.svg',
}

const PLATFORM_ICONS_PATH = '/assets/platform-icons/black'

export function getPlatformIcon(
  platform: string,
  className?: string,
) {
  const key = platform.toLowerCase().trim()
  const filename = PLATFORM_ICONS[key] ?? PLATFORM_ICONS.custom
  const iconUrl = `${PLATFORM_ICONS_PATH}/${filename}`

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: '1em',
        height: '1em',
        backgroundColor: 'currentColor',
        mask: `url("${iconUrl}") center / contain no-repeat`,
        WebkitMask: `url("${iconUrl}") center / contain no-repeat`,
      }}
    />
  )
}