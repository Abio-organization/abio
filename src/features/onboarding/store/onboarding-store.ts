import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { MAX_PLATFORMS } from '@/features/onboarding/data'

interface OnboardingState {
  selectedPlatformIds: string[]
  togglePlatform: (id: string) => void
  reset: () => void
}

/** Bridges the Platforms step's selection to the Links step. Session-scoped — cleared on tab close or completion. */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedPlatformIds: [],

      togglePlatform: (id) =>
        set((state) => {
          const isSelected = state.selectedPlatformIds.includes(id)
          if (isSelected) {
            return { selectedPlatformIds: state.selectedPlatformIds.filter((p) => p !== id) }
          }
          if (state.selectedPlatformIds.length >= MAX_PLATFORMS) {
            return state
          }
          return { selectedPlatformIds: [...state.selectedPlatformIds, id] }
        }),

      reset: () => set({ selectedPlatformIds: [] }),
    }),
    {
      name: 'abio-onboarding-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
