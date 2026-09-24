import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'

/** "Grow with Abio" lead capture — src/modules/business/business.schemas.ts */
export interface CreateBusinessInquiryPayload {
  companyName: string
  fullName: string
  email: string
  /** International format, e.g. +14155552671 — validated server-side. */
  phone: string
  companySize: string
  industry: string
  features: string[]
}

export interface BusinessInquiry extends CreateBusinessInquiryPayload {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

/** No account field actually flips to "business" — a submitted row is just a sales lead. */
export async function createBusinessInquiry(payload: CreateBusinessInquiryPayload) {
  const { data } = await apiClient.post<ApiResponse<BusinessInquiry>>('/user/business-inquiries', payload)
  return data.data
}

/** The caller's own latest inquiry, or `null` if they've never submitted one. */
export async function getMyBusinessInquiry() {
  const { data } = await apiClient.get<ApiResponse<BusinessInquiry | null>>('/user/business-inquiries/me')
  return data.data
}
