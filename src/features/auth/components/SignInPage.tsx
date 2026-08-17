import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'
import { getApiErrorMessage, getApiErrorStatus } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { getGoogleAuthUrl, resendVerificationEmail } from '@/features/auth/api/auth.api'
import { useLogin } from '@/features/auth/hooks/use-auth'
import { loginSchema, type LoginFormValues } from '@/features/auth/lib/validation'

import { AuthLayout } from './AuthLayout'
import { AuthSubmitButton } from './AuthSubmitButton'
import { PasswordField } from './PasswordField'

export function SignInPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormValues) => {
    setUnverifiedEmail(null)
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        navigate({ to: res.data.user.isOnboardingCompleted ? '/dashboard' : '/onboarding' })
      },
      onError: (error) => {
        if (getApiErrorStatus(error) === 403) {
          setUnverifiedEmail(data.email)
          toast.warning('Verify your email to continue', {
            description: "We sent a link when you signed up — check your inbox, or resend it below.",
          })
          return
        }
        toast.error('Sign in failed', { description: getApiErrorMessage(error) })
      },
    })
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return
    setIsResending(true)
    try {
      await resendVerificationEmail({ email: unverifiedEmail })
      toast.success('Verification email sent', { description: 'Check your inbox for the new link.' })
    } catch (error) {
      toast.error('Could not resend email', { description: getApiErrorMessage(error) })
    } finally {
      setIsResending(false)
    }
  }

  const hasShownAuthError = useRef(false)

  useEffect(() => {
    if (hasShownAuthError.current) return
    const error = new URLSearchParams(window.location.search).get('error')
    if (!error) return

    hasShownAuthError.current = true
    toast.error('Email already exists', { description: 'Please log in with your credentials.' })
    window.history.replaceState({}, '', '/auth/sign-in')
  }, [])

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-linear-to-r from-[#331400] to-[#662800] bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-[#F5EEE4] dark:to-[#FED45C]">
          Welcome Back!
        </h1>
        <p className="text-sm font-medium text-[#666464] dark:text-[#F5EEE4]/60">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="space-y-1.5">
          <Input
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            className="h-12 border-[#E0D5C8] text-base focus-visible:border-[#FED45C] focus-visible:ring-[#FED45C]/40 dark:border-[#3A2C20]"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <PasswordField
            placeholder="Enter your password"
            autoComplete="current-password"
            className="border-[#E0D5C8] focus-visible:border-[#FED45C] focus-visible:ring-[#FED45C]/40 dark:border-[#3A2C20]"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {unverifiedEmail && (
          <div className="border border-[#FED45C] bg-[#FED45C]/10 p-3 text-sm text-[#331400] dark:text-[#F5EEE4]">
            <p>Your email isn't verified yet.</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-1 font-semibold text-[#EA2228] hover:underline disabled:opacity-50"
            >
              {isResending ? 'Resending…' : 'Resend verification email'}
            </button>
          </div>
        )}

        <div className="text-right">
          <Link to="/auth/forgot-password" className="text-sm font-semibold text-[#EA2228] transition-colors hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="pt-2">
          <AuthSubmitButton pending={loginMutation.isPending} pendingLabel="Signing in…">
            Sign In
          </AuthSubmitButton>
        </div>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1 bg-[#E0D5C8] dark:bg-[#3A2C20]" />
          <span className="text-xs font-medium text-gray-400">OR</span>
          <Separator className="flex-1 bg-[#E0D5C8] dark:bg-[#3A2C20]" />
        </div>

        <a href={getGoogleAuthUrl()} className="block">
          <Button
            type="button"
            variant="outline"
            className="flex h-11 w-full items-center justify-center gap-3 border-[#E0D5C8] text-sm font-medium hover:border-[#FED45C] hover:bg-[#FED45C]/5 dark:border-[#3A2C20]"
          >
            <img src="/assets/icons/auth/google.svg" alt="" width={18} height={18} />
            Continue with Google
          </Button>
        </a>

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-[#F5EEE4]/60">
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className="font-semibold text-[#EA2228] transition-colors hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
