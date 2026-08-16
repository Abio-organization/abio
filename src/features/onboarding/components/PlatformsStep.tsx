import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { toast } from '@/shared/lib/toast'

import { MAX_PLATFORMS, PLATFORMS } from '@/features/onboarding/data'
import { useOnboardingStore } from '@/features/onboarding/store/onboarding-store'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

export function PlatformsStep() {
  const navigate = useNavigate()
  const selectedPlatformIds = useOnboardingStore((s) => s.selectedPlatformIds)
  const togglePlatform = useOnboardingStore((s) => s.togglePlatform)

  const handlePlatformClick = (id: string) => {
    const alreadySelected = selectedPlatformIds.includes(id)
    if (!alreadySelected && selectedPlatformIds.length >= MAX_PLATFORMS) {
      toast.warning(`You can only select up to ${MAX_PLATFORMS} platforms.`)
      return
    }
    togglePlatform(id)
  }

  return (
    <OnboardingLayout step={4}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="mb-2 text-xl font-semibold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">Select platforms you are on!</h1>
            <p className="text-sm font-medium text-[#666464] dark:text-[#F5EEE4]/60">
              Pick a maximum of {MAX_PLATFORMS} platforms to get started. You can update later.
            </p>
          </div>

          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 gap-x-1 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
            {PLATFORMS.map((platform) => {
              const isSelected = selectedPlatformIds.includes(platform.id)
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => handlePlatformClick(platform.id)}
                  className="flex items-center justify-center"
                >
                  <div
                    className={cn(
                      'flex h-[70px] w-[70px] items-center justify-center border-2 p-3 transition-colors',
                      isSelected ? 'border-[#331400] dark:border-[#F5EEE4]' : 'border-transparent',
                    )}
                  >
                    <img src={platform.icon} alt={platform.name} className="h-full w-full object-contain" />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mx-auto w-full max-w-xs space-y-3">
            <Button
              onClick={() => navigate({ to: '/onboarding/links' })}
              className="h-12 w-full bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
            >
              Continue
            </Button>
            <button
              type="button"
              onClick={() => navigate({ to: '/onboarding/links' })}
              className="w-full text-sm font-semibold text-[#666464] hover:underline dark:text-[#F5EEE4]/60"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
