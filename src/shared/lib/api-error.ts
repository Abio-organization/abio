import { isAxiosError } from 'axios'

/**
 * Every backend error response — validation failures, AppErrors, Prisma
 * conflicts, expired JWTs — comes back through the same ServiceResponse
 * envelope: { success: false, message, data: null, statusCode }. This is
 * the one place that shape gets parsed into a plain message.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}
