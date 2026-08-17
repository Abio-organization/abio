/**
 * Backend API prefix.
 *
 * - Dev: usually `/api/v1` (Vite proxies to localhost:9800).
 *
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
