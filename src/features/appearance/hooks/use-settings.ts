import { useQuery } from '@tanstack/react-query'

import { getAppearancePreferences } from '@/features/appearance/api/appearance.api'
import { queryKeys } from '@/shared/lib/query-keys'

export function useGetSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      const res = await getAppearancePreferences()
      return res.data
    },
  })
}
