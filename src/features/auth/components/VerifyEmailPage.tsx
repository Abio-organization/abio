import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { queryKeys } from '@/shared/lib/query-keys'

import { verifyEmail } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/store/auth-store'

import { AuthLayout } from './AuthLayout'

interface VerifyEmailPageProps {
  token: string
}

export function VerifyEmailPage({ token }: VerifyEmailPageProps) {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()
  const hasStarted = useRef(false)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (hasStarted.current || !token) return
    hasStarted.current = true

    verifyEmail({ token })
      .then((res) => {
        setSession(res.data.user, { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
        queryClient.setQueryData(queryKeys.user, res.data.user)
        navigate({ to: '/onboarding' })
      })
      .catch(setError)
  }, [token, navigate, setSession, queryClient])

  if (error) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold text-[#331400] dark:text-[#F5EEE4]">Verification Failed</h1>
          <p className="mb-6 text-sm text-[#666464] dark:text-[#F5EEE4]/60">
            {getApiErrorMessage(error, 'This verification link is invalid or has expired.')}
          </p>
          <Link to="/auth/sign-in" className="text-sm font-semibold text-[#EA2228] hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
        <p className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Verifying your email…</p>
      </div>
    </AuthLayout>
  )
}
