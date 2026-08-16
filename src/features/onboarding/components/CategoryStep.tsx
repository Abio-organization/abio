import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useUpdateProfile } from '@/features/profile'
import { CATEGORIES, isGoalTitleEntry } from '@/features/onboarding/data'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

export function CategoryStep() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  useEffect(() => {
    const goals = user?.profile?.goals ?? []
    const storedCategory = CATEGORIES.find((c) => goals.includes(c.name))
    if (storedCategory) setSelectedCategoryId(storedCategory.id)
  }, [user])

  const handleSubmit = () => {
    const category = CATEGORIES.find((c) => c.id === selectedCategoryId)
    if (!category) {
      toast.warning('Select a category to continue')
      return
    }

    const existingGoalTitle = (user?.profile?.goals ?? []).find(isGoalTitleEntry)
    const goals = existingGoalTitle ? [category.name, existingGoalTitle] : [category.name]

    updateProfileMutation.mutate(
      { goals },
      {
        onSuccess: () => navigate({ to: '/onboarding/goal' }),
        onError: (error) => toast.error('Could not save category', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <OnboardingLayout step={2}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-2xl">
          <div className="mx-auto mb-8 max-w-md space-y-3 text-center">
            <h1 className="text-xl font-extrabold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">What's your business or niche?</h1>
            <p className="text-sm text-[#666464] dark:text-[#F5EEE4]/60">Pick the category that best fits you.</p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategoryId === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={cn(
                    'h-11 whitespace-nowrap border px-4 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-[#331400] bg-[#331400] text-[#FED45C] dark:border-[#F5EEE4] dark:bg-[#F5EEE4] dark:text-[#331400]'
                      : 'border-[#331400]/20 text-[#331400] hover:border-[#331400] dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:border-[#F5EEE4]',
                  )}
                >
                  {category.name}
                </button>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedCategoryId || updateProfileMutation.isPending}
              className="h-12 w-full max-w-md bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
            >
              {updateProfileMutation.isPending ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
