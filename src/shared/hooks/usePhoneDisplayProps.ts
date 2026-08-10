import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  wallpaperToSelectedTheme,
} from '@/features/appearance/lib'
import { useGetAllLinks } from '@/features/links/hooks/use-links'
import { useGetSettings } from '@/features/appearance/hooks/use-settings'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import type { ButtonStyle, FontStyle } from '@/features/appearance/types'
import type { Link } from '@/features/links/types'
import type { UserProfile } from '@/features/auth/types'

export interface PhoneDisplayProfile {
  displayName: string
  bio: string
  location: string
  avatarUrl: string | null
  username: string
}

export interface UsePhoneDisplayPropsResult {
  buttonStyle: ButtonStyle
  fontStyle: FontStyle
  selectedTheme: string
  profile: PhoneDisplayProfile
  links: Link[]
  isLoading: boolean
  refetch: () => void
}

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  borderColor: 'transparent',
  opacity: 1,
  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
}

const DEFAULT_FONT_STYLE: FontStyle = {
  fontFamily: 'Inter, sans-serif',
  fillColor: '#ffffff',
  strokeColor: '#000000',
  opacity: 1,
}

function profileFromUser(userProfile: UserProfile | undefined): PhoneDisplayProfile {
  return {
    displayName: userProfile?.displayName ?? '',
    bio: userProfile?.bio ?? '',
    location: userProfile?.location ?? '',
    avatarUrl: userProfile?.avatarUrl ?? null,
    username: userProfile?.username ?? '',
  }
}

/** Single source of truth for dashboard + appearance phone preview. */
export function usePhoneDisplayProps(): UsePhoneDisplayPropsResult {
  const settingsQuery = useGetSettings()
  const linksQuery = useGetAllLinks()
  const userQuery = useCurrentUser()

  const settings = settingsQuery.data
  const userProfile = userQuery.data?.profile

  const refetch = () => {
    void settingsQuery.refetch()
    void linksQuery.refetch()
    void userQuery.refetch()
  }

  return {
    buttonStyle: settings
      ? cornerConfigToButtonStyle(settings.corner_config)
      : DEFAULT_BUTTON_STYLE,
    fontStyle: settings ? fontConfigToFontStyle(settings.font_config) : DEFAULT_FONT_STYLE,
    selectedTheme: settings
      ? wallpaperToSelectedTheme(settings.wallpaper_config) ||
        (settings.selected_theme ?? '/themes/theme1.png')
      : '/themes/theme1.png',
    profile: profileFromUser(userProfile),
    links: linksQuery.data ?? [],
    isLoading:
      settingsQuery.isLoading || linksQuery.isLoading || userQuery.isLoading,
    refetch,
  }
}
