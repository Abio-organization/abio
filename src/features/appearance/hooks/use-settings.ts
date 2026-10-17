import { useQuery } from '@tanstack/react-query'

import { getAppearancePreferences } from '@/features/appearance/api/appearance.api'
import { useIsAuthenticated } from '@/features/auth/store/auth-store'
import { queryKeys } from '@/shared/lib/query-keys'

export function useGetSettings() {
  const isAuthenticated = useIsAuthenticated()

  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => {
      const res = await getAppearancePreferences()
      return res.data
    },
    enabled: isAuthenticated,
  })
}
