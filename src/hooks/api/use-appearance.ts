import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/constants/query-keys'

/** Combined appearance save (parallel PUTs + abort on failure) — implement per CURSOR.md. */
export function useUpdateAppearanceAll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      throw new Error('useUpdateAppearanceAll not implemented')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings })
    },
  })
}
