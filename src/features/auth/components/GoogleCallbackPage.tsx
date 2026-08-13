import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { setAccessTokenOnly } from '@/shared/lib/auth-tokens'

import { getCurrentUser } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth-store'

import { AuthLayout } from './AuthLayout'

interface GoogleCallbackPageProps {
  accessToken: string | undefined
}

export function GoogleCallbackPage({ accessToken }: GoogleCallbackPageProps) {
  const navigate = useNavigate()
  const setAccessTokenSession = useAuthStore((s) => s.setAccessTokenSession)
  const hasStarted = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    if (!accessToken) {
      navigate({ to: '/auth/sign-in' })
      return
    }

    ;(async () => {
      try {
        // Store the raw token first so the request interceptor attaches it
        // to the getCurrentUser() call below — no user object exists yet,
        // so this can't go through the store (which expects one).
        setAccessTokenOnly(accessToken)
        const res = await getCurrentUser()
        setAccessTokenSession(accessToken, res.data)
        navigate({ to: '/onboarding' })
      } catch (err) {
        setError(getApiErrorMessage(err, 'Google sign-in failed. Please try again.'))
      }
    })()
  }, [accessToken, navigate, setAccessTokenSession])

  if (error) {
    return (
      <AuthLayout>
        <div className="text-center">
          <p className="mb-4 font-semibold text-[#331400] dark:text-[#F5EEE4]">{error}</p>
          <button
            onClick={() => navigate({ to: '/auth/sign-in' })}
            className="bg-[#FED45C] px-6 py-2 font-semibold text-[#331400]"
          >
            Back to Sign In
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
        <p className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Signing you in…</p>
      </div>
    </AuthLayout>
  )
}
