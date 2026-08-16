import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/shared/components/ui/button'
import { useLogout } from '@/features/auth/hooks/use-auth'
import { ProgressSteps } from '@/features/onboarding/components/ProgressSteps'

interface OnboardingLayoutProps {
  /** Omit on the final Complete screen — it has no step indicator, matching the source design. */
  step?: number
  children: ReactNode
}

export function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  const logoutMutation = useLogout()

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FEF4EA] dark:bg-[#1C1611]">
      <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-4 pb-2 md:px-8 md:pt-6">
        <Link to="/" className="group flex items-center gap-[1.5px]">
          <img src="/icons/A.bio.svg" alt="A.Bio Logo" width={24} height={24} className="transition-transform group-hover:scale-105" />
          <span className="text-end text-3xl font-medium tracking-wide text-black dark:text-[#F5EEE4]">bio</span>
        </Link>

        <Button
          variant="ghost"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="gap-2 text-[#331400] dark:text-[#F5EEE4]"
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
        </Button>
      </div>

      {step ? (
        <div className="flex w-full justify-center px-4">
          <div className="my-2 w-full max-w-lg md:my-6">
            <ProgressSteps currentStep={step} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
