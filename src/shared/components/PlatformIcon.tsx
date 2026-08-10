import type { ReactNode } from 'react'
import { FaLink } from 'react-icons/fa6'

type PlatformMatcher = { test: (platform: string) => boolean; icon: ReactNode }

const matchers: PlatformMatcher[] = [
  {
    test: (p) => p.includes('tiktok'),
    icon: <span aria-hidden>TikTok</span>,
  },
  {
    test: (p) => p.includes('instagram'),
    icon: <span aria-hidden>IG</span>,
  },
  {
    test: (p) => p.includes('youtube'),
    icon: <span aria-hidden>YT</span>,
  },
  {
    test: (p) => p.includes('twitter') || p.includes('x.com'),
    icon: <span aria-hidden>X</span>,
  },
]

export function getPlatformIcon(platform: string, className?: string) {
  const key = platform.toLowerCase()
  const match = matchers.find((m) => m.test(key))
  if (match) {
    return <span className={className}>{match.icon}</span>
  }
  return <FaLink className={className} aria-hidden />
}
