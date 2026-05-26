import { Navigate, Outlet } from '@tanstack/react-router'

import { useIsAuthenticated } from '@/store/auth-store'

export function AuthGuard() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }

  return <Outlet />
}
