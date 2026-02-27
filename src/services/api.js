const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_PUBLISHABLE_KEY = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim()

const SUPABASE_PROPERTIES_TABLE = (import.meta.env.VITE_SUPABASE_PROPERTIES_TABLE || 'properties').trim()
const SUPABASE_AUTH_LOGS_TABLE = (import.meta.env.VITE_SUPABASE_AUTH_LOGS_TABLE || 'auth_logs').trim()
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
const SUPABASE_BASE = SUPABASE_URL.replace(/\/$/, '')
const SUPABASE_FALLBACK_TO_BACKEND = String(import.meta.env.VITE_SUPABASE_FALLBACK_TO_BACKEND || 'false').toLowerCase() === 'true'

function toImageUrls(raw) {
  const fromRaw = raw.imageUrls ?? raw.image_urls ?? raw.images
  if (Array.isArray(fromRaw)) return fromRaw.filter(Boolean).slice(0, 10)
  if (typeof fromRaw === 'string') {
    try {
      const parsed = JSON.parse(fromRaw)
      if (Array.isArray(parsed)) return parsed.filter(Boolean).slice(0, 10)
    } catch {
      // ignore
    }
  }
  const single = raw.imageUrl ?? raw.image_url ?? ''
  return single ? [single] : []
}

function normalizeProperty(raw = {}) {
  const imageUrls = toImageUrls(raw)
  return {
    id: raw.id,
    name: raw.name || '',
    type: raw.type || '',
    location: raw.location || '',
    price: Number(raw.price || 0),
    size: raw.size || '',
    bedrooms: Number(raw.bedrooms || 0),
    bathrooms: Number(raw.bathrooms || 0),
    features: raw.features || '',
    status: raw.status || 'Available',
    imageUrls,
    imageUrl: imageUrls[0] || '',
  }
}

function sanitizePropertyPayload(payload = {}) {
  const imageUrls = Array.isArray(payload.imageUrls) ? payload.imageUrls.filter(Boolean).slice(0, 10) : []
  return {
    name: String(payload.name || '').trim(),
    type: String(payload.type || '').trim(),
    location: String(payload.location || '').trim(),
    price: Number(payload.price || 0),
    size: String(payload.size || '').trim(),
    bedrooms: Number(payload.bedrooms || 0),
    bathrooms: Number(payload.bathrooms || 0),
    features: String(payload.features || '').trim(),
    status: String(payload.status || 'Available').trim(),
    imageUrls,
    imageUrl: imageUrls[0] || '',
  }
}

async function requestBackend(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (error) {
    throw new Error(`Cannot connect to backend (${API_BASE_URL}). Start it with: npm run api`)
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

async function requestSupabase(path, options = {}) {
  const token = options.token || ''
  const response = await fetch(`${SUPABASE_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token || SUPABASE_PUBLISHABLE_KEY}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || data.error_description || data.error || 'Supabase request failed')
  }
  return data
}

async function resolveData({ supabase, backend }) {
  if (!USE_SUPABASE) return backend()
  try {
    return await supabase()
  } catch (error) {
    if (SUPABASE_FALLBACK_TO_BACKEND) return backend()
    throw error
  }
}

async function getSupabaseProperties(token = '') {
  const data = await requestSupabase(
    `/rest/v1/${encodeURIComponent(SUPABASE_PROPERTIES_TABLE)}?select=*&order=id.asc`,
    { token },
  )
  return { items: Array.isArray(data) ? data.map(normalizeProperty) : [] }
}

async function createSupabaseProperty(token, payload) {
  const data = await requestSupabase(`/rest/v1/${encodeURIComponent(SUPABASE_PROPERTIES_TABLE)}`, {
    method: 'POST',
    token,
    headers: { Prefer: 'return=representation' },
    body: sanitizePropertyPayload(payload),
  })
  const item = Array.isArray(data) ? data[0] : null
  return { item: item ? normalizeProperty(item) : null }
}

async function updateSupabaseProperty(token, id, payload) {
  const data = await requestSupabase(
    `/rest/v1/${encodeURIComponent(SUPABASE_PROPERTIES_TABLE)}?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      token,
      headers: { Prefer: 'return=representation' },
      body: sanitizePropertyPayload(payload),
    },
  )
  const item = Array.isArray(data) ? data[0] : null
  return { item: item ? normalizeProperty(item) : null }
}

async function deleteSupabaseProperty(token, id) {
  const data = await requestSupabase(
    `/rest/v1/${encodeURIComponent(SUPABASE_PROPERTIES_TABLE)}?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      token,
      headers: { Prefer: 'return=representation' },
    },
  )
  const item = Array.isArray(data) ? data[0] : null
  return { item: item ? normalizeProperty(item) : null }
}

async function loginSupabase({ username, password }) {
  const data = await requestSupabase('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: {
      email: String(username || '').trim(),
      password: String(password || ''),
    },
  })

  if (!data.access_token) {
    throw new Error('Supabase login failed. Use a valid Supabase Auth email/password.')
  }

  return {
    token: data.access_token,
    username: data.user?.email || username,
    expiresInMs: Number(data.expires_in || 0) * 1000,
  }
}

export const api = {
  baseUrl: USE_SUPABASE ? SUPABASE_BASE : API_BASE_URL,
  getProperties: async () =>
    resolveData({
      supabase: () => getSupabaseProperties(),
      backend: () => requestBackend('/api/properties'),
    }),
  adminLogin: async (payload) =>
    resolveData({
      supabase: () => loginSupabase(payload),
      backend: () => requestBackend('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
    }),
  getAdminProperties: async (token) =>
    resolveData({
      supabase: () => getSupabaseProperties(token),
      backend: () => requestBackend('/api/admin/properties', { headers: { Authorization: `Bearer ${token}` } }),
    }),
  createProperty: async (token, payload) => {
    return resolveData({
      supabase: () => createSupabaseProperty(token, payload),
      backend: () =>
        requestBackend('/api/admin/properties', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }),
    })
  },
  updateProperty: async (token, id, payload) => {
    return resolveData({
      supabase: () => updateSupabaseProperty(token, id, payload),
      backend: () =>
        requestBackend(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }),
    })
  },
  deleteProperty: async (token, id) => {
    return resolveData({
      supabase: () => deleteSupabaseProperty(token, id),
      backend: () =>
        requestBackend(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
    })
  },
  getAuthLogs: async (token) =>
    resolveData({
      supabase: async () => {
        const data = await requestSupabase(
          `/rest/v1/${encodeURIComponent(SUPABASE_AUTH_LOGS_TABLE)}?select=*&order=timestamp.desc`,
          { token },
        )
        return { items: Array.isArray(data) ? data : [] }
      },
      backend: () =>
        requestBackend('/api/admin/auth-logs', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
}
