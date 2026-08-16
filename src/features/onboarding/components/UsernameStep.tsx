import { useNavigate } from '@tanstack/react-router'
import { Check, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { AuthSubmitButton } from '@/features/auth/components/AuthSubmitButton'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useUpdateProfile, useUsernameAvailability } from '@/features/profile'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

export function UsernameStep() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (user?.profile?.username) setUsername(user.profile.username)
  }, [user])

  const trimmed = username.trim()
  const isOwnUsername = trimmed.length > 0 && trimmed === user?.profile?.username
  const { isChecking, isAvailable } = useUsernameAvailability(trimmed, user?.profile?.username)

  const shapeError =
    trimmed.length > 0 && trimmed.length < 3
      ? 'Username must be at least 3 characters'
      : trimmed.length > 30
        ? 'Username must be 30 characters or less'
        : trimmed.length > 0 && !USERNAME_REGEX.test(trimmed)
          ? 'Only letters, numbers, hyphens and underscores'
          : null

  const canSubmit = trimmed.length >= 3 && !shapeError && (isOwnUsername || isAvailable === true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trimmed) {
      toast.warning('Please enter a username')
      return
    }
    if (shapeError) {
      toast.warning(shapeError)
      return
    }

    if (isOwnUsername) {
      navigate({ to: '/onboarding/category' })
      return
    }

    if (isAvailable !== true) {
      toast.warning('That username is taken', { description: 'Please choose a different one.' })
      return
    }

    updateProfileMutation.mutate(
      { username: trimmed },
      {
        onSuccess: () => navigate({ to: '/onboarding/category' }),
        onError: (error) => toast.error('Could not save username', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <OnboardingLayout step={1}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">Claim your free username</h1>
            <p className="mt-2 text-sm text-[#666464] dark:text-[#F5EEE4]/60">Choose a unique username that represents you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div
              className="relative flex h-12 items-center border border-[#331400]/20 bg-transparent focus-within:border-[#331400] dark:border-[#F5EEE4]/20 dark:focus-within:border-[#F5EEE4]"
            >
              <span className="pl-3 text-sm font-semibold text-[#331400]/60 select-none dark:text-[#F5EEE4]/60">abio.site/</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="yourname"
                autoComplete="off"
                aria-label="Username"
                className="h-full min-w-0 flex-1 bg-transparent pr-10 text-base font-medium text-[#331400] outline-none dark:text-[#F5EEE4]"
              />
              {trimmed.length >= 3 && !shapeError && (
                <span className="absolute top-1/2 right-3 -translate-y-1/2">
                  {isOwnUsername ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#666464]" />
                  ) : isAvailable === true ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : isAvailable === false ? (
                    <X className="h-4 w-4 text-red-500" />
                  ) : null}
                </span>
              )}
            </div>

            {shapeError ? (
              <p className="text-xs font-medium text-red-500">{shapeError}</p>
            ) : isOwnUsername ? (
              <p className="text-xs font-semibold text-green-600">This is your current username</p>
            ) : trimmed.length >= 3 && !isChecking && isAvailable === true ? (
              <p className="text-xs font-semibold text-green-600">Username is available</p>
            ) : trimmed.length >= 3 && !isChecking && isAvailable === false ? (
              <p className="text-xs font-semibold text-red-600">Username is not available</p>
            ) : null}

            <AuthSubmitButton pending={updateProfileMutation.isPending} pendingLabel="Saving…" disabled={!canSubmit} className="mt-2">
              Continue
            </AuthSubmitButton>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  )
}
