import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const IMAGE_LIMIT = 10

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="w-full border border-gray-300 rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '')
  const [username, setUsername] = useState(() => localStorage.getItem('adminUsername') || '')
  const [properties, setProperties] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(EMPTY_PROPERTY)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedProperty = useMemo(() => properties.find((item) => item.id === selectedId) || null, [properties, selectedId])

  const refresh = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const propertyRes = await api.getAdminProperties(token)
      setProperties(propertyRes.items || [])
    } catch (err) {
      setError(err.message)
      if (err.message.toLowerCase().includes('unauthorized')) handleLogout()
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
        imageUrls: Array.isArray(selectedProperty.imageUrls)
          ? selectedProperty.imageUrls.slice(0, IMAGE_LIMIT)
          : selectedProperty.imageUrl
            ? [selectedProperty.imageUrl]
            : [],
      })
    } else {
      setForm(EMPTY_PROPERTY)
    }
  }, [selectedProperty])

  const handleLogin = (nextToken, nextUsername) => {
    localStorage.setItem('adminToken', nextToken)
    localStorage.setItem('adminUsername', nextUsername)
    setToken(nextToken)
    setUsername(nextUsername)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUsername')
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

  const onImageSelected = async (event) => {
    const fileList = Array.from(event.target.files || [])
    if (fileList.length === 0) return

    const remainingSlots = IMAGE_LIMIT - form.imageUrls.length
    if (remainingSlots <= 0) {
      setError(`Image limit reached. Maximum is ${IMAGE_LIMIT}.`)
      return
    }

    const filesToRead = fileList.slice(0, remainingSlots)
    const readOne = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
        reader.readAsDataURL(file)
      })

    const imageUrls = (await Promise.all(filesToRead.map(readOne))).filter(Boolean)
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...imageUrls].slice(0, IMAGE_LIMIT) }))

    if (fileList.length > remainingSlots) {
      setError(`Only ${IMAGE_LIMIT} images are allowed per property.`)
    } else {
      setError('')
    }

    event.target.value = ''
  }

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== index),
    }))
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      const payload = { ...form, imageUrls: form.imageUrls.slice(0, IMAGE_LIMIT) }
      if (selectedId) {
        await api.updateProperty(token, selectedId, payload)
        setMessage('Property updated successfully.')
      } else {
        await api.createProperty(token, payload)
        setMessage('Property created successfully.')
      }
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this property?')) return
    setMessage('')
    setError('')
    try {
      await api.deleteProperty(token, id)
      if (selectedId === id) setSelectedId(null)
      setMessage('Property deleted successfully.')
      await refresh()
    } catch (err) {
      setError(err.message)
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
            <button onClick={refresh} className="px-4 py-2 border border-gray-300 rounded text-sm">Refresh</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-[#1a1f4e] text-white rounded text-sm">Logout</button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[#1a1f4e]">Foreclosed Properties</h2>
              <button className="text-sm text-red-600 font-semibold" onClick={() => setSelectedId(null)}>+ New</button>
            </div>
            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {properties.map((item) => (
                <div key={item.id} className={`border rounded p-3 cursor-pointer ${selectedId === item.id ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} onClick={() => setSelectedId(item.id)}>
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
                <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => onFieldChange('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Type</label>
                <input className="w-full border rounded px-3 py-2" value={form.type} onChange={(e) => onFieldChange('type', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input className="w-full border rounded px-3 py-2" value={form.location} onChange={(e) => onFieldChange('location', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Price</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.price} onChange={(e) => onFieldChange('price', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Size</label>
                <input className="w-full border rounded px-3 py-2" value={form.size} onChange={(e) => onFieldChange('size', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2" value={form.status} onChange={(e) => onFieldChange('status', e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Under OCU">Under OCU</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Bedrooms</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.bedrooms} onChange={(e) => onFieldChange('bedrooms', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Bathrooms</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.bathrooms} onChange={(e) => onFieldChange('bathrooms', Number(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Features</label>
                <textarea className="w-full border rounded px-3 py-2" rows="3" value={form.features} onChange={(e) => onFieldChange('features', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Property Image Upload (max 10)</label>
                <input type="file" accept="image/*" multiple className="w-full border rounded px-3 py-2" onChange={onImageSelected} />
                <p className="text-xs text-gray-500 mt-1">{form.imageUrls.length} / {IMAGE_LIMIT} images selected.</p>
              </div>

              {form.imageUrls.length > 0 && (
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {form.imageUrls.map((src, index) => (
                    <div key={`${index}-${src.slice(0, 24)}`} className="relative">
                      <img src={src} alt={`Property ${index + 1}`} className="h-24 w-full object-cover rounded border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-6 h-6 text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                  {selectedId ? 'Save Changes' : 'Add Property'}
                </button>
                {selectedId && (
                  <button type="button" onClick={() => remove(selectedId)} className="px-4 py-2 border border-red-300 text-red-700 rounded">
                    Delete
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
