import { useQuery } from '@tanstack/react-query'

import { getAppearancePreferences } from '@/api/appearance.api'
import { queryKeys } from '@/lib/constants/query-keys'

export function useGetSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      const res = await getAppearancePreferences()
      return res.data
    },
  })
}
