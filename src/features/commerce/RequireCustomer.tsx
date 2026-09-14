import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { SignInPage } from '@/features/auth/components/SignInPage'
export function RequireCustomer({ children }: { children: ReactNode }) {
  const auth = useAuthStore((s) => s.isAuthenticated)
  useEffect(() => {
    if (!auth)
      sessionStorage.setItem(
        'commerce-return',
        window.location.pathname + window.location.search,
      )
  }, [auth])
  return auth ? <>{children}</> : <SignInPage />
}
