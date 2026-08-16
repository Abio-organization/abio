import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { FaFacebook, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'

import { Button } from '@/shared/components/ui/button'
import { PhoneDisplay } from '@/shared/components/PhoneDisplay'
import { usePhoneDisplayProps } from '@/shared/hooks/usePhoneDisplayProps'
import { toast } from '@/shared/lib/toast'

import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

const SHARE_TARGETS = [
  { platform: 'whatsapp', icon: FaWhatsapp },
  { platform: 'twitter', icon: FaXTwitter },
  { platform: 'facebook', icon: FaFacebook },
] as const

export function CompleteStep() {
  const navigate = useNavigate()
  const { buttonStyle, fontStyle, selectedTheme, profile, links, isLoading } = usePhoneDisplayProps()

  const profileLink = profile.username ? `${window.location.origin}/${profile.username}` : null

  const handleShare = async (platform: string) => {
    if (!profileLink) return
    const shareUrl = encodeURIComponent(profileLink)
    const shareText = encodeURIComponent('Check out my Abio profile!')

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank', 'noopener,noreferrer')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank', 'noopener,noreferrer')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = async () => {
    if (!profileLink) return
    try {
      await navigator.clipboard.writeText(profileLink)
      toast.success('Profile link copied to clipboard!')
    } catch {
      toast.error('Failed to copy profile link')
    }
  }

  if (isLoading) {
    return (
      <OnboardingLayout>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
          <p className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Loading your profile…</p>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <PhoneDisplay buttonStyle={buttonStyle} fontStyle={fontStyle} selectedTheme={selectedTheme} profile={profile} links={links} />

        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[#331400] md:text-3xl dark:text-[#F5EEE4]">Your profile is ready!</h1>
            <p className="mt-2 text-sm text-[#666464] dark:text-[#F5EEE4]/60">Share your page and start growing your audience.</p>
          </div>

          {profileLink && (
            <div className="flex items-center gap-2 border border-[#331400]/15 bg-white px-4 py-3 dark:border-[#F5EEE4]/15 dark:bg-white/5">
              <span className="min-w-0 flex-1 truncate text-sm text-[#666464] dark:text-[#F5EEE4]/60">{profileLink}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 bg-[#331400] px-3 py-1.5 text-xs font-semibold text-[#FED45C] hover:bg-[#4a2c1a]"
              >
                Copy
              </button>
            </div>
          )}

          <div className="border border-[#331400]/15 bg-white p-6 dark:border-[#F5EEE4]/15 dark:bg-white/5">
            <h2 className="text-base font-semibold text-[#331400] dark:text-[#F5EEE4]">Share your profile</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {SHARE_TARGETS.map(({ platform, icon: Icon }) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleShare(platform)}
                  disabled={!profileLink}
                  className="flex h-14 items-center justify-center border border-[#331400]/15 text-[#331400] transition-colors hover:bg-[#331400]/5 disabled:opacity-40 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4] dark:hover:bg-white/10"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {profile.username ? (
              <Link to="/$username" params={{ username: profile.username }} target="_blank" className="flex-1">
                <Button variant="outline" className="h-12 w-full border-[#331400] text-sm font-semibold text-[#331400] dark:border-[#F5EEE4] dark:text-[#F5EEE4]">
                  Visit Profile
                </Button>
              </Link>
            ) : null}
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="h-12 flex-1 bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
