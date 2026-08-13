import { Navigate, createFileRoute } from '@tanstack/react-router'

import { OnboardingPage } from '@/features/onboarding'
import { useIsAuthenticated } from '@/features/auth/store/auth-store'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingRoute,
})

function OnboardingRoute() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }

  return <OnboardingPage />
}
