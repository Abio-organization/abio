import { useQuery } from '@tanstack/react-query'

import { getAllLinks } from '@/api/links.api'
import { queryKeys } from '@/lib/constants/query-keys'

export function useGetAllLinks() {
  return useQuery({
    queryKey: queryKeys.links,
    queryFn: async () => {
      const res = await getAllLinks()
      return res.data
    },
  })
}
