import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/store/auth-store'

function AuthHydration() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage)

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

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
