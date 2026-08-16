import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'

import { useIsAuthenticated } from '@/features/auth/store/auth-store'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingRouteLayout,
})

function OnboardingRouteLayout() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }

  return <Outlet />
}
