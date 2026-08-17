import { BadgeCheck, Link as LinkIcon, MapPin, MoreVertical, User as UserIcon } from 'lucide-react'
import type { CSSProperties } from 'react'

import { getPlatformIcon } from '@/shared/components/PlatformIcon'
import { FONT_WEIGHT_CSS } from '@/features/appearance/lib'
import type { ButtonStyle, FontStyle } from '@/features/appearance/types'
import { trackLinkClick } from '@/features/links/api/links.api'
import type { Link } from '@/features/links/types'
import type { PhoneDisplayProfile } from '@/shared/hooks/usePhoneDisplayProps'

export interface PhoneDisplayProps {
  buttonStyle: ButtonStyle
  fontStyle: FontStyle
  selectedTheme: string
  profile: PhoneDisplayProfile
  links: Link[]
}

function backgroundStyle(selectedTheme: string): CSSProperties {
  if (selectedTheme.startsWith('fill:')) {
    return { backgroundColor: selectedTheme.replace('fill:', '') }
  }
  if (selectedTheme.startsWith('gradient:')) {
    const [, a, b] = selectedTheme.split(':')
    return { background: `linear-gradient(180deg, ${a}, ${b})` }
  }
  return {
    backgroundImage: `url(${selectedTheme})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

export function PhoneDisplay({ buttonStyle, fontStyle, selectedTheme, profile, links }: PhoneDisplayProps) {
  const visibleLinks = links.filter((link) => link.isVisible)
  const name = profile.displayName || profile.username || 'Your name'

  return (
    <div className="relative mx-auto h-130 w-70 overflow-hidden border-2 border-black bg-white md:h-150 md:w-75">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-col items-start gap-2 bg-white/90 p-4 backdrop-blur-xl">
          <div className="flex w-full items-center gap-3">
            <div className="h-12.5 w-12.5 shrink-0 overflow-hidden rounded-full border border-neutral-300 shadow-md">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                  <UserIcon className="h-5 w-5 text-neutral-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h1 className="truncate text-sm font-bold text-neutral-900" title={name}>
                  {name}
                </h1>
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 fill-[#EA2228] text-white" />
              </div>
              {profile.username && <p className="truncate text-[10px] font-medium text-neutral-500">/{profile.username}</p>}
            </div>
          </div>

          {profile.bio ? (
            <p className="line-clamp-2 text-left text-[10px] font-semibold text-neutral-800" title={profile.bio}>
              {profile.bio}
            </p>
          ) : null}

          {profile.location ? (
            <div className="flex items-center gap-1 border border-neutral-300 bg-white/70 px-1.5 py-0.5">
              <MapPin className="h-2.5 w-2.5 shrink-0 text-neutral-500" />
              <span className="max-w-45 truncate text-[9px] font-medium text-neutral-500">{profile.location}</span>
            </div>
          ) : null}
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-3 [&::-webkit-scrollbar]:hidden"
          style={{ ...backgroundStyle(selectedTheme), scrollbarWidth: 'none' }}
        >
          {visibleLinks.length > 0 ? (
            <div className="space-y-2">
              {visibleLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    void trackLinkClick(link.id).catch(() => {})
                  }}
                  className="flex items-center justify-between px-3 py-2.5 text-sm"
                  style={{
                    borderRadius: buttonStyle.borderRadius,
                    backgroundColor: buttonStyle.backgroundColor,
                    borderColor: buttonStyle.borderColor,
                    opacity: buttonStyle.opacity,
                    boxShadow: buttonStyle.boxShadow,
                    color: fontStyle.fillColor,
                    fontFamily: fontStyle.fontFamily,
                    fontStyle: fontStyle.italic ? 'italic' : 'normal',
                    textDecoration: fontStyle.underline ? 'underline' : 'none',
                    fontWeight: FONT_WEIGHT_CSS[fontStyle.weight ?? 'regular'],
                  }}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full">
                      {link.icon_link ? (
                        <img src={link.icon_link} alt="" className="h-full w-full object-cover" />
                      ) : (
                        getPlatformIcon(link.platform, 'h-4 w-4')
                      )}
                    </span>
                    <span className="truncate">{link.title}</span>
                  </span>
                  <MoreVertical className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <LinkIcon className="mb-2 h-8 w-8 text-neutral-400" />
              <p className="text-xs font-medium text-neutral-500">No links added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
