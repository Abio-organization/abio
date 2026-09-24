import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/lib/query-keys'

import { createBadgeRequest, getBadgeStatus, type CreateBadgeRequestPayload } from '../api/badges.api'

export function useBadgeStatus() {
  return useQuery({
    queryKey: queryKeys.badgeStatus,
    queryFn: getBadgeStatus,
  })
}

export function useCreateBadgeRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBadgeRequestPayload) => createBadgeRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.badgeStatus })
    },
  })
}
