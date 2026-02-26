const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function request(path, options = {}) {
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

export const api = {
  baseUrl: API_BASE_URL,
  getProperties: () => request('/api/properties'),
  adminLogin: (payload) =>
    request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAdminProperties: (token) =>
    request('/api/admin/properties', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createProperty: (token, payload) =>
    request('/api/admin/properties', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateProperty: (token, id, payload) =>
    request(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteProperty: (token, id) =>
    request(`/api/admin/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAuthLogs: (token) =>
    request('/api/admin/auth-logs', {
      headers: { Authorization: `Bearer ${token}` },
    }),
}
