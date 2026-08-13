// Relative by default so dev requests go through Vite's proxy (same-origin,
// no CORS preflight) — see vite.config.ts `server.proxy`.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
