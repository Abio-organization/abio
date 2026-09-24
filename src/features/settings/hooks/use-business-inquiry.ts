import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/shared/lib/query-keys'

import { createBusinessInquiry, getMyBusinessInquiry, type CreateBusinessInquiryPayload } from '../api/business.api'

/** The caller's own latest "Grow with Abio" lead — `data` is `null` until they submit one. */
export function useMyBusinessInquiry() {
  return useQuery({
    queryKey: queryKeys.myBusinessInquiry,
    queryFn: getMyBusinessInquiry,
  })
}

export function useCreateBusinessInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBusinessInquiryPayload) => createBusinessInquiry(payload),
    onSuccess: (inquiry) => {
      queryClient.setQueryData(queryKeys.myBusinessInquiry, inquiry)
    },
  })
}
