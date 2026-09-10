import { getApiErrorMessage, getApiErrorStatus } from '@/shared/lib/api-error'

export type LoginForbiddenReason = 'email_unverified' | 'deactivated' | 'unknown'

export function getLoginForbiddenReason(error: unknown): LoginForbiddenReason | null {
  if (getApiErrorStatus(error) !== 403) return null

  const message = getApiErrorMessage(error, '').toLowerCase()

  if (message.includes('deactivated')) return 'deactivated'
  if (message.includes('verify your email')) return 'email_unverified'

  return 'unknown'
}
