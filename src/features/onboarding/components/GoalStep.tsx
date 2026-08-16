import { useNavigate } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { useUpdateProfile } from '@/features/profile'
import { GOALS, isCategoryGoalEntry } from '@/features/onboarding/data'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

export function GoalStep() {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

  useEffect(() => {
    const goals = user?.profile?.goals ?? []
    const storedGoal = GOALS.find((g) => goals.includes(g.title))
    if (storedGoal) setSelectedGoalId(storedGoal.id)
  }, [user])

  const handleSubmit = () => {
    const goal = GOALS.find((g) => g.id === selectedGoalId)
    if (!goal) {
      toast.warning('Select a goal to continue')
      return
    }

    const existingCategoryName = (user?.profile?.goals ?? []).find(isCategoryGoalEntry)
    const goals = existingCategoryName ? [existingCategoryName, goal.title] : [goal.title]

    updateProfileMutation.mutate(
      { goals },
      {
        onSuccess: () => navigate({ to: '/onboarding/platforms' }),
        onError: (error) => toast.error('Could not save goal', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <OnboardingLayout step={3}>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 space-y-3 text-center">
            <h1 className="text-xl leading-tight font-extrabold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">
              What best describes your goal for using Abio?
            </h1>
            <p className="text-sm text-[#666464] dark:text-[#F5EEE4]/60">Helps us personalize your experience.</p>
          </div>

          <div className="mb-8 space-y-3">
            {GOALS.map((goal) => {
              const isSelected = selectedGoalId === goal.id
              const Icon = goal.icon
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={cn(
                    'flex w-full items-center gap-4 border-2 bg-white p-4 text-left transition-all dark:bg-white/5',
                    isSelected
                      ? 'border-[#331400] shadow-lg dark:border-[#F5EEE4]'
                      : 'border-transparent hover:shadow-md',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                      isSelected ? 'bg-[#FED45C]' : 'bg-[#331400]/5 dark:bg-white/10',
                    )}
                  >
                    <Icon size={20} className="text-[#331400] dark:text-[#F5EEE4]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#331400] dark:text-[#F5EEE4]">{goal.title}</h3>
                    <p className="mt-1 text-xs text-[#666464] md:text-sm dark:text-[#F5EEE4]/60">{goal.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#331400] dark:bg-[#F5EEE4]">
                      <Check className="h-4 w-4 text-white dark:text-[#331400]" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedGoalId || updateProfileMutation.isPending}
            className="h-12 w-full bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
          >
            {updateProfileMutation.isPending ? 'Saving…' : 'Next'}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
