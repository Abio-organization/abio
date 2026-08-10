import { useQuery } from '@tanstack/react-query'

import { PhoneDisplay } from '@/shared/components/PhoneDisplay'
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  wallpaperToSelectedTheme,
} from '@/features/appearance/lib'
import { queryKeys } from '@/shared/lib/query-keys'
import { getPublicProfile } from '@/features/profile/api/profile.api'
import type { PhoneDisplayProfile } from '@/shared/hooks/usePhoneDisplayProps'

interface PublicProfilePageProps {
  username: string
}

function displayNameForUsername(username: string, fallback: string) {
  if (username === 'ootn') return 'one of those nights'
  return fallback
}

function themeForUsername(username: string, displayTheme: string) {
  if (username === 'ootn') return '/themes/ootn.jpeg'
  return displayTheme
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.userProfile(username),
    queryFn: async () => {
      const res = await getPublicProfile(username)
      return res.data
    },
  })

  if (isLoading) {
    return <p className="p-6 text-sm text-neutral-500">Loading profile…</p>
  }

  if (isError || !data) {
    return <p className="p-6 text-sm text-red-600">Profile not found.</p>
  }

  const { profile, links, display } = data
  const displayTheme =
    wallpaperToSelectedTheme(display.wallpaper_config) ||
    display.selected_theme ||
    '/themes/theme1.png'

  const phoneProfile: PhoneDisplayProfile = {
    displayName: displayNameForUsername(username, profile.displayName ?? username),
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    avatarUrl: profile.avatarUrl,
    username: profile.username,
  }

  if (username === 'dnabygaza') {
    return (
      <div className="p-6">
        <p className="mb-4 text-sm text-neutral-600">
          Special case: Menu tab + DnaFormV1 — implement when porting legacy behavior.
        </p>
        <PhoneDisplay
          buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
          fontStyle={fontConfigToFontStyle(display.font_config)}
          selectedTheme={themeForUsername(username, displayTheme)}
          profile={phoneProfile}
          links={links}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-neutral-100 p-6">
      <PhoneDisplay
        buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
        fontStyle={fontConfigToFontStyle(display.font_config)}
        selectedTheme={themeForUsername(username, displayTheme)}
        profile={phoneProfile}
        links={links}
      />
    </div>
  )
}
