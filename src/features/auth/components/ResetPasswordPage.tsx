import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useResetPassword } from '@/features/auth/hooks/use-auth'
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/lib/validation'

import { AuthLayout } from './AuthLayout'
import { AuthSubmitButton } from './AuthSubmitButton'
import { PasswordField } from './PasswordField'

interface ResetPasswordPageProps {
  token: string
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      { token, password: data.password, passwordConfirm: data.passwordConfirm },
      {
        onSuccess: () => {
          toast.success('Password updated', { description: 'Please log in with your new password.' })
          navigate({ to: '/auth/sign-in' })
        },
        onError: (error) => toast.error('Could not reset password', { description: getApiErrorMessage(error) }),
      },
    )
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold text-[#331400] dark:text-[#F5EEE4]">Invalid Reset Link</h1>
          <p className="mb-6 text-sm text-[#666464] dark:text-[#F5EEE4]/60">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center md:text-left">
        <h1 className="mb-4 text-2xl font-extrabold text-[#331400] lg:text-3xl dark:text-[#F5EEE4]">Reset Password</h1>
        <p className="text-sm font-medium text-[#666464] md:w-3/4 dark:text-[#F5EEE4]/60">
          Enter a new password to complete the reset process and secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">
            New Password
          </label>
          <PasswordField
            id="password"
            placeholder="Enter new password"
            className="border-[#331400] dark:border-[#3A2C20]"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="passwordConfirm" className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">
            Confirm New Password
          </label>
          <PasswordField
            id="passwordConfirm"
            placeholder="Re-enter your password"
            className="border-[#331400] dark:border-[#3A2C20]"
            aria-invalid={!!errors.passwordConfirm}
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm && (
            <p className="text-xs text-red-500" role="alert">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <AuthSubmitButton pending={resetPasswordMutation.isPending} pendingLabel="Resetting…">
          Reset Password
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  )
}
