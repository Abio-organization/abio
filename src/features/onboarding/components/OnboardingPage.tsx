import { LogOut } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

import { useLogout } from '@/features/auth/hooks/use-auth'
import { useAuthUser } from '@/features/auth/store/auth-store'

/**
 * Placeholder — the real multi-step onboarding (username, profile, links,
 * goals, template, platforms) isn't built yet. This exists so a freshly
 * verified/logged-in user lands somewhere real, with a working way back out.
 */
export function OnboardingPage() {
  const user = useAuthUser()
  const logoutMutation = useLogout()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#FEF4EA] p-6 text-center dark:bg-[#1C1611]">
      <div>
        <h1 className="text-2xl font-bold text-[#331400] dark:text-[#F5EEE4]">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
        <p className="mt-2 text-sm text-[#666464] dark:text-[#F5EEE4]/60">Onboarding isn't built yet — this is a placeholder landing spot.</p>
      </div>

      <Button
        variant="outline"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="gap-2 border-[#331400]/20 text-[#331400] dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4]"
      >
        <LogOut className="h-4 w-4" />
        {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
      </Button>
    </div>
  )
}
