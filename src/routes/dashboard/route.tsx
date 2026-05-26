import { Navigate, createFileRoute } from '@tanstack/react-router'

import { DashboardLayout } from '@/features/dashboard/DashboardLayout'
import { useIsAuthenticated } from '@/store/auth-store'

export const Route = createFileRoute('/dashboard')({
  component: DashboardRouteLayout,
})

function DashboardRouteLayout() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }

  return <DashboardLayout />
}
