import { ShoppingCart, Users, Zap } from 'lucide-react'
import type { ComponentType } from 'react'

export interface OnboardingCategory {
  id: string
  name: string
}

export const CATEGORIES: OnboardingCategory[] = [
  { id: 'musician', name: 'Musician / Artist' },
  { id: 'influencer', name: 'Influencer / Creator' },
  { id: 'entrepreneur', name: 'Entrepreneur / Coach' },
  { id: 'freelancer', name: 'Freelancer / Agency' },
  { id: 'local', name: 'Local Business' },
  { id: 'blogger', name: 'Blogger / Writer' },
  { id: 'designer', name: 'Designer' },
  { id: 'nonprofit', name: 'Non-Profit / Activist' },
  { id: 'photographer', name: 'Photographer / Videographer' },
]

export interface OnboardingGoal {
  id: string
  title: string
  description: string
  icon: ComponentType<{ size?: number; className?: string }>
}

export const GOALS: OnboardingGoal[] = [
  {
    id: 'grow-brand',
    title: 'Creator',
    description: 'Grow my following and social media presence.',
    icon: Zap,
  },
  {
    id: 'share-links',
    title: 'Personal',
    description: 'Share links with friends and acquaintances.',
    icon: Users,
  },
  {
    id: 'sell-products',
    title: 'Business',
    description: 'Grow my business and build customer retention.',
    icon: ShoppingCart,
  },
]

export interface OnboardingPlatform {
  id: string
  name: string
  icon: string
}

export const PLATFORMS: OnboardingPlatform[] = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '/assets/Whatsapp.svg' },
  { id: 'youtube', name: 'YouTube', icon: '/assets/Youtube.svg' },
  { id: 'X', name: 'X', icon: '/assets/X.svg' },
  { id: 'tiktok', name: 'TikTok', icon: '/assets/tiktok.svg' },
  { id: 'snapchat', name: 'Snapchat', icon: '/assets/snapchat.svg' },
  { id: 'telegram', name: 'Telegram', icon: '/assets/telegram.svg' },
  { id: 'linkedin', name: 'LinkedIn', icon: '/assets/Linkedln.svg' },
  { id: 'instagram', name: 'Instagram', icon: '/assets/Instagram.svg' },
  { id: 'Website', name: 'Website', icon: '/assets/website.svg' },
]

export const MAX_PLATFORMS = 5

/** Base URL fragments used to build a full link URL from a bare username/handle. */
export const PLATFORM_BASE_URLS: Record<string, string> = {
  instagram: 'instagram.com/',
  X: 'x.com/',
  snapchat: 'snapchat.com/add/',
  tiktok: 'tiktok.com/@',
  youtube: 'youtube.com/@',
  linkedin: 'linkedin.com/in/',
  telegram: 't.me/',
  whatsapp: 'wa.me/',
  Website: 'https://',
}

/** Platforms whose handle is conventionally shown with an @ prefix. */
export const AT_PLATFORMS = new Set(['X', 'snapchat', 'tiktok', 'instagram'])

export function buildPlatformUrl(platformId: string, value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (platformId === 'whatsapp') {
    return `https://wa.me/${trimmed.replace(/\D/g, '')}`
  }

  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const base = PLATFORM_BASE_URLS[platformId]
  return base ? `https://${base}${trimmed}` : `https://${trimmed}`
}

export function getPlatformPlaceholder(platformId: string, platformName: string): string {
  if (platformId === 'whatsapp') return 'WhatsApp phone number'

  const base = PLATFORM_BASE_URLS[platformId]
  if (!base) return `Your ${platformName} link`
  if (AT_PLATFORMS.has(platformId)) return '@username'

  return `${base}username`
}

export const isCategoryGoalEntry = (name: string) => CATEGORIES.some((c) => c.name === name)
export const isGoalTitleEntry = (name: string) => GOALS.some((g) => g.title === name)

export const ONBOARDING_STEPS = [
  { path: '/onboarding/username', label: 'Username' },
  { path: '/onboarding/category', label: 'Category' },
  { path: '/onboarding/goal', label: 'Goal' },
  { path: '/onboarding/platforms', label: 'Platforms' },
  { path: '/onboarding/links', label: 'Links' },
  { path: '/onboarding/profile', label: 'Profile' },
] as const
