import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'

/** Mirrors src/modules/badges/badges.service.ts `requestSelect` / `badgeSelect`. */
export type BadgeRequestStatus = 'pending' | 'approved' | 'rejected'

export interface BadgeRequest {
  id: string
  userId: string
  badgeType: string
  status: BadgeRequestStatus
  reason: string
  idDocumentUrl: string
  reviewedAt: string | null
  reviewedById: string | null
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}

export interface VerificationBadge {
  id: string
  badgeType: string
  assignedAt: string
  assignedById: string | null
  revokedAt: string | null
  revokedById: string | null
  revokeReason: string | null
}

export interface BadgeStatus {
  latestRequest: BadgeRequest | null
  activeBadge: VerificationBadge | null
  hasActiveBadge: boolean
}

export async function getBadgeStatus() {
  const { data } = await apiClient.get<ApiResponse<BadgeStatus>>('/user/badges/requests/me')
  return data.data
}

export interface CreateBadgeRequestPayload {
  /** 10–1000 chars — enforced server-side too. */
  reason: string
  /** Image or PDF, max 5MB — enforced server-side too. */
  idDocument: File
}

export async function createBadgeRequest({ reason, idDocument }: CreateBadgeRequestPayload) {
  const formData = new FormData()
  formData.append('reason', reason)
  formData.append('idDocument', idDocument)

  const { data } = await apiClient.post<ApiResponse<BadgeRequest>>('/user/badges/requests', formData)
  return data.data
}
