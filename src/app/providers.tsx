import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'

import { AUTH_LOGOUT_EVENT } from '@/shared/lib/api-client'
import { queryClient } from '@/shared/lib/query-client'
import { useAuthStore } from '@/features/auth/store/auth-store'

function AuthHydration() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage)
  const signOut = useAuthStore((s) => s.signOut)

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  // A dead session (refresh failed — no valid access/refresh token) should
  // sign the user out immediately instead of leaving isAuthenticated stuck
  // true while every protected query 401s and retries forever.
  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, signOut)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, signOut)
  }, [signOut])

  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydration />
      {children}
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  )
}
