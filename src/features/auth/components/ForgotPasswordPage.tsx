import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Input } from '@/shared/components/ui/input'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useForgotPassword } from '@/features/auth/hooks/use-auth'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/lib/validation'

import { AuthLayout } from './AuthLayout'
import { AuthSubmitButton } from './AuthSubmitButton'

export function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => setSubmitted(true),
      onError: (error) => toast.error('Could not send reset email', { description: getApiErrorMessage(error) }),
    })
  }

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#FED45C]/20">
            <MailCheck className="h-7 w-7 text-[#331400] dark:text-[#FED45C]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#331400] dark:text-[#F5EEE4]">Check your email</h1>
          <p className="mx-auto max-w-sm text-sm text-[#666464] dark:text-[#F5EEE4]/60">
            If that email exists, we've sent a link to reset your password.
          </p>
          <Link to="/auth/sign-in" className="mt-6 inline-block text-sm font-semibold text-[#EA2228] hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <h1 className="mb-2 text-2xl font-extrabold text-[#331400] md:text-3xl dark:text-[#F5EEE4]">Forgot Password?</h1>
        <p className="text-xs font-medium text-[#666464] md:text-sm dark:text-[#F5EEE4]/60">
          Enter your registered email to receive password reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="h-12 w-full border-[#331400] text-base dark:border-[#3A2C20]"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <AuthSubmitButton pending={forgotPasswordMutation.isPending} pendingLabel="Sending…">
          Confirm email
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  )
}
