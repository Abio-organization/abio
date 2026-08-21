import type { IconType } from 'react-icons'
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaMedium,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

const PLATFORM_ICONS: Record<string, IconType> = {
  twitter: FaXTwitter,
  x: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub,
  facebook: FaFacebook,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  discord: FaDiscord,
  twitch: FaTwitch,
  spotify: FaSpotify,
  reddit: FaReddit,
  pinterest: FaPinterest,
  medium: FaMedium,
  whatsapp: FaWhatsapp,
  snapchat: FaSnapchat,
  telegram: FaTelegram,
  website: FaGlobe,
  custom: FaLink,
}

export function getPlatformIcon(platform: string, className?: string) {
  const key = platform.toLowerCase().trim()
  const Icon = PLATFORM_ICONS[key] ?? FaLink
  return <Icon className={className} aria-hidden />
}
