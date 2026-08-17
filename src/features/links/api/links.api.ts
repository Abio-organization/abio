import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'
import type { Link } from '@/features/links/types'

export async function getAllLinks() {
  const { data } = await apiClient.get<ApiResponse<Link[]>>('/links')
  return data
}

export async function createLink(payload: Pick<Link, 'title' | 'url' | 'platform'>) {
  const { data } = await apiClient.post<ApiResponse<Link>>('/links', payload)
  return data
}

export async function updateLink(id: string, payload: Partial<Pick<Link, 'title' | 'url' | 'platform' | 'isVisible'>>) {
  const { data } = await apiClient.patch<ApiResponse<Link>>(`/links/${id}`, payload)
  return data
}

export async function deleteLink(id: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/links/${id}`)
  return data
}

export async function reorderLinks(links: Array<{ id: string; displayOrder: number }>) {
  const { data } = await apiClient.patch<ApiResponse<null>>('/links/reorder/all', { links })
  return data
}

/** Fire-and-forget analytics ping — public, unauthenticated, must never block or surface errors to the viewer. */
export async function trackLinkClick(id: string) {
  await apiClient.post(`/public/links/${id}/click`)
}

export async function updateLinkIcon(id: string, file: File) {
  const formData = new FormData()
  formData.append('icon', file)

  const { data } = await apiClient.patch<ApiResponse<Link>>(`/links/${id}/icon`, formData)
  return data
}
