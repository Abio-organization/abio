import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api.types'
import type { Link } from '@/types/links.types'

export async function getAllLinks() {
  const { data } = await apiClient.get<ApiResponse<Link[]>>('/links')
  return data
}

export async function createLink(payload: Pick<Link, 'title' | 'url' | 'platform'>) {
  const { data } = await apiClient.post<ApiResponse<Link>>('/links', payload)
  return data
}

export async function updateLink(id: string, payload: Partial<Link>) {
  const { data } = await apiClient.patch<ApiResponse<Link>>(`/links/${id}`, payload)
  return data
}

export async function deleteLink(id: string) {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/links/${id}`)
  return data
}
