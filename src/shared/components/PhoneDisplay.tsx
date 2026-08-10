import type { CSSProperties } from 'react'

import { getPlatformIcon } from '@/shared/components/PlatformIcon'
import type { ButtonStyle, FontStyle } from '@/features/appearance/types'
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

export function PhoneDisplay({
  buttonStyle,
  fontStyle,
  selectedTheme,
  profile,
  links,
}: PhoneDisplayProps) {
  const visibleLinks = links.filter((link) => link.isVisible)

  return (
    <div className="mx-auto w-[280px] overflow-hidden rounded-[2rem] border border-neutral-200 shadow-lg">
      <div className="aspect-[9/19] p-4" style={backgroundStyle(selectedTheme)}>
        <div className="flex h-full flex-col items-center gap-3">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-white/30" />
          )}
          <p className="text-center text-sm font-semibold" style={{ color: fontStyle.fillColor }}>
            {profile.displayName || profile.username || 'Your name'}
          </p>
          {profile.bio ? (
            <p className="text-center text-xs" style={{ color: fontStyle.fillColor }}>
              {profile.bio}
            </p>
          ) : null}
          <div className="mt-auto flex w-full flex-col gap-2">
            {visibleLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium"
                style={{
                  borderRadius: buttonStyle.borderRadius,
                  backgroundColor: buttonStyle.backgroundColor,
                  borderColor: buttonStyle.borderColor,
                  opacity: buttonStyle.opacity,
                  boxShadow: buttonStyle.boxShadow,
                  color: fontStyle.fillColor,
                  fontFamily: fontStyle.fontFamily,
                }}
              >
                {getPlatformIcon(link.platform, 'h-4 w-4')}
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
