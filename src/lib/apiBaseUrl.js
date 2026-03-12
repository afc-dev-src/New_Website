const explicitApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '')
  .trim()
  .replace(/\/$/, '')

export const API_BASE_URL = explicitApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:4000' : '')

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
