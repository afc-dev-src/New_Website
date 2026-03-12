import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const IMAGE_LIMIT = 10
const TOKEN_STORAGE_KEY = 'adminToken'
const USERNAME_STORAGE_KEY = 'adminUsername'

const EMPTY_PROPERTY = {
  name: '',
  type: '',
  location: '',
  price: '',
  size: '',
  bedrooms: 0,
  bathrooms: 0,
  features: '',
  status: 'Available',
  imageUrls: [],
}

function getStoredValue(key) {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem(key) || ''
}

function setStoredValue(key, value) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(key, value)
}

function removeStoredValue(key) {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(key)
}

function cleanImageUrls(imageUrls) {
  return Array.from(
    new Set(
      (Array.isArray(imageUrls) ? imageUrls : [])
        .map((url) => String(url || '').trim())
        .filter(Boolean),
    ),
  ).slice(0, IMAGE_LIMIT)
}

function isHostedImageUrl(url) {
  return /^https?:\/\//i.test(url) || url.startsWith('/')
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api.adminLogin({ username, password })
      onLogin(result.token, result.username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1a1f4e] mb-2">Admin Login</h1>
          <p className="text-sm text-gray-600 mb-6">For staff managing foreclosed property listings.</p>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => getStoredValue(TOKEN_STORAGE_KEY))
  const [username, setUsername] = useState(() => getStoredValue(USERNAME_STORAGE_KEY))
  const [properties, setProperties] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(EMPTY_PROPERTY)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedProperty = useMemo(
    () => properties.find((item) => item.id === selectedId) || null,
    [properties, selectedId],
  )

  const previewImageUrls = useMemo(() => cleanImageUrls(form.imageUrls), [form.imageUrls])

  const refresh = async () => {
    if (!token) return

    setLoading(true)
    setError('')

    try {
      const propertyRes = await api.getAdminProperties(token)
      setProperties(propertyRes.items || [])
    } catch (err) {
      setError(err.message)
      if (String(err.message || '').toLowerCase().includes('unauthorized')) handleLogout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [token])

  useEffect(() => {
    if (selectedProperty) {
      setForm({
        name: selectedProperty.name || '',
        type: selectedProperty.type || '',
        location: selectedProperty.location || '',
        price: selectedProperty.price || '',
        size: selectedProperty.size || '',
        bedrooms: selectedProperty.bedrooms || 0,
        bathrooms: selectedProperty.bathrooms || 0,
        features: selectedProperty.features || '',
        status: selectedProperty.status || 'Available',
        imageUrls: cleanImageUrls(
          Array.isArray(selectedProperty.imageUrls)
            ? selectedProperty.imageUrls
            : selectedProperty.imageUrl
              ? [selectedProperty.imageUrl]
              : [],
        ),
      })
    } else {
      setForm(EMPTY_PROPERTY)
    }
  }, [selectedProperty])

  const handleLogin = (nextToken, nextUsername) => {
    setStoredValue(TOKEN_STORAGE_KEY, nextToken)
    setStoredValue(USERNAME_STORAGE_KEY, nextUsername)
    setToken(nextToken)
    setUsername(nextUsername)
  }

  const handleLogout = () => {
    removeStoredValue(TOKEN_STORAGE_KEY)
    removeStoredValue(USERNAME_STORAGE_KEY)
    setToken('')
    setUsername('')
    setProperties([])
    setSelectedId(null)
    setMessage('')
    setError('')
  }

  const onFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const addImageField = () => {
    if (form.imageUrls.length >= IMAGE_LIMIT) {
      setError(`Image limit reached. Maximum is ${IMAGE_LIMIT}.`)
      return
    }

    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }))
    setError('')
  }

  const updateImageUrl = (index, value) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, currentIndex) => (currentIndex === index ? value : url)),
    }))
  }

  const removeImageField = (index) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, currentIndex) => currentIndex !== index),
    }))
  }

  const validateForm = () => {
    if (!form.name.trim()) return 'Property name is required.'
    if (!form.type.trim()) return 'Property type is required.'
    if (!form.location.trim()) return 'Location is required.'
    if (!form.price || form.price <= 0) return 'Valid price is required.'
    if (previewImageUrls.some((url) => !isHostedImageUrl(url))) {
      return 'Property images must use hosted URLs or site-relative paths.'
    }
    return null
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const payload = { ...form, imageUrls: previewImageUrls }
      const isUpdate = Boolean(selectedId)

      if (isUpdate) {
        await api.updateProperty(token, selectedId, payload)
      } else {
        await api.createProperty(token, payload)
      }

      setMessage(
        isUpdate
          ? `Property "${form.name}" updated successfully.`
          : `Property "${form.name}" added successfully.`,
      )

      setForm(EMPTY_PROPERTY)
      setSelectedId(null)
      await refresh()
      window.setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      const errorMessage = err.message || 'Failed to save property. Please try again.'
      setError(`Error: ${errorMessage}`)
      console.error('Save property error:', err)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return

    setMessage('')
    setError('')
    setLoading(true)

    try {
      await api.deleteProperty(token, id)

      if (selectedId === id) {
        setForm(EMPTY_PROPERTY)
        setSelectedId(null)
      }

      setMessage('Property deleted successfully.')
      await refresh()
      window.setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete property. Please try again.'
      setError(`Error: ${errorMessage}`)
      console.error('Delete property error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1f4e]">Property Editing Admin</h1>
            <p className="text-sm text-gray-600">Logged in as {username}. Manage foreclosed properties only.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh} className="px-4 py-2 border border-gray-300 rounded text-sm">
              Refresh
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-[#1a1f4e] text-white rounded text-sm">
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            <p className="font-semibold mb-1">Error</p>
            <p>{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
            <p className="font-semibold mb-1">Success</p>
            <p>{message}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#1a1f4e]">Foreclosed Properties</h2>
              <button
                className="text-sm text-red-600 font-semibold"
                onClick={() => setSelectedId(null)}
              >
                + New
              </button>
            </div>
            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {properties.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded p-3 cursor-pointer ${selectedId === item.id ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <p className="font-semibold text-sm text-[#1a1f4e]">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.location}</p>
                </div>
              ))}
              {!loading && properties.length === 0 && <p className="text-sm text-gray-500">No properties yet.</p>}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-[#1a1f4e] mb-3">{selectedId ? 'Edit Property' : 'Create Property'}</h2>
            <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={(event) => onFieldChange('name', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Type</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.type}
                  onChange={(event) => onFieldChange('type', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.location}
                  onChange={(event) => onFieldChange('location', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={form.price}
                  onChange={(event) => onFieldChange('price', Number(event.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Size</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.size}
                  onChange={(event) => onFieldChange('size', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.status}
                  onChange={(event) => onFieldChange('status', event.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Under OCU">Under OCU</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Bedrooms</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={form.bedrooms}
                  onChange={(event) => onFieldChange('bedrooms', Number(event.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Bathrooms</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={form.bathrooms}
                  onChange={(event) => onFieldChange('bathrooms', Number(event.target.value))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Features</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  value={form.features}
                  onChange={(event) => onFieldChange('features', event.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-sm mb-1">Property Image URLs</label>
                    <p className="text-xs text-gray-500">
                      Use public image URLs or site-relative paths from deployed storage. Direct file uploads are disabled for deployment safety.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="shrink-0 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    + Add Image URL
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {form.imageUrls.length === 0 && (
                    <div className="rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                      No image URLs added yet. Properties can still be saved without images, and the site will show a placeholder.
                    </div>
                  )}

                  {form.imageUrls.map((src, index) => (
                    <div key={`${index}-${src}`} className="flex gap-2">
                      <input
                        type="url"
                        className="w-full border rounded px-3 py-2"
                        placeholder="https://example.com/property-image.jpg or /images/property.jpg"
                        value={src}
                        onChange={(event) => updateImageUrl(index, event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="shrink-0 rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-2">{previewImageUrls.length} / {IMAGE_LIMIT} image URLs ready.</p>
              </div>

              {previewImageUrls.length > 0 && (
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {previewImageUrls.map((src, index) => (
                    <div key={`${index}-${src}`} className="relative">
                      <img
                        src={src}
                        alt={`Property ${index + 1}`}
                        className="h-24 w-full object-cover rounded border border-gray-200"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded font-medium transition"
                >
                  {loading ? 'Saving...' : selectedId ? 'Save Changes' : 'Add Property'}
                </button>
                {selectedId && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => remove(selectedId)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded font-medium hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    Delete
                  </button>
                )}
                {selectedId && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setSelectedId(null)
                      setForm(EMPTY_PROPERTY)
                      setError('')
                      setMessage('')
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
