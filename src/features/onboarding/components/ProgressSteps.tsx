import { Check } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { ONBOARDING_STEPS } from '@/features/onboarding/data'

interface ProgressStepsProps {
  currentStep: number
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const totalSteps = ONBOARDING_STEPS.length
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="w-full min-w-0">
      <div className="relative mb-2 h-1 w-full bg-[#331400]/10 dark:bg-white/10">
        <div
          className="h-full bg-[#FED45C] transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex justify-between gap-1 sm:gap-2">
        {steps.map((step) => (
          <div key={step} className="flex min-w-0 flex-1 flex-col items-center">
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center text-xs font-semibold',
                step < currentStep
                  ? 'bg-[#FED45C] text-[#331400]'
                  : step === currentStep
                    ? 'bg-[#FED45C] text-[#331400] ring-2 ring-[#FED45C] ring-offset-2 ring-offset-[#FEF4EA] dark:ring-offset-[#1C1611]'
                    : 'bg-[#331400]/10 text-[#331400]/50 dark:bg-white/10 dark:text-white/40',
              )}
            >
              {step < currentStep ? <Check className="h-3 w-3" /> : step}
            </div>
            <span className="mt-1 hidden text-center text-xs text-[#666464] dark:text-white/50 sm:block">
              {ONBOARDING_STEPS[step - 1].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
