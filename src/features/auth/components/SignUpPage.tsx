import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { getGoogleAuthUrl } from '@/features/auth/api/auth.api'
import { useSignUp } from '@/features/auth/hooks/use-auth'
import { signUpSchema, type SignUpFormValues } from '@/features/auth/lib/validation'

import { AuthLayout } from './AuthLayout'
import { AuthSubmitButton } from './AuthSubmitButton'
import { PasswordField } from './PasswordField'

export function SignUpPage() {
  const signUpMutation = useSignUp()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = (data: SignUpFormValues) => {
    signUpMutation.mutate(data, {
      onSuccess: () => setSubmittedEmail(data.email),
      onError: (error) => toast.error('Sign up failed', { description: getApiErrorMessage(error) }),
    })
  }

  if (submittedEmail) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#FED45C]/20">
            <MailCheck className="h-7 w-7 text-[#331400] dark:text-[#FED45C]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#331400] dark:text-[#F5EEE4]">Check your email</h1>
          <p className="mx-auto max-w-sm text-sm text-[#666464] dark:text-[#F5EEE4]/60">
            We sent a verification link to <span className="font-semibold text-[#331400] dark:text-[#F5EEE4]">{submittedEmail}</span>. Click it
            to activate your account.
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
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-linear-to-r from-[#331400] to-[#662800] bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-[#F5EEE4] dark:to-[#FED45C]">
          Create your account
        </h1>
        <p className="text-sm font-medium text-[#666464] dark:text-[#F5EEE4]/60">Start building your Abio profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="space-y-1.5">
          <Input
            placeholder="Full name"
            autoComplete="name"
            className="h-12 border-[#E0D5C8] text-base focus-visible:border-[#FED45C] focus-visible:ring-[#FED45C]/40 dark:border-[#3A2C20]"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="Create a password"
            autoComplete="new-password"
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

        <div className="space-y-1.5">
          <PasswordField
            placeholder="Confirm your password"
            autoComplete="new-password"
            className="border-[#E0D5C8] focus-visible:border-[#FED45C] focus-visible:ring-[#FED45C]/40 dark:border-[#3A2C20]"
            aria-invalid={!!errors.passwordConfirm}
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <AuthSubmitButton pending={signUpMutation.isPending} pendingLabel="Creating account…">
            Create account
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
            Already have an account?{' '}
            <Link to="/auth/sign-in" className="font-semibold text-[#EA2228] transition-colors hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
