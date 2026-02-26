import { useEffect, useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import { properties as allProperties } from '../data/properties'
import { api } from '../services/api'

export default function Properties() {
  const [properties, setProperties] = useState(allProperties)
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: 'all',
    status: 'all',
  })

  useEffect(() => {
    let ignore = false
    api.getProperties()
      .then((result) => {
        if (!ignore && Array.isArray(result.items) && result.items.length > 0) {
          setProperties(result.items)
        }
      })
      .catch(() => {
        // Keep local fallback data for resilience.
      })
    return () => {
      ignore = true
    }
  }, [])

  const locations = [...new Set(properties.map((p) => p.location))]
  const types = [...new Set(properties.map((p) => p.type))]

  const filteredProperties = properties.filter((p) => {
    if (filters.location && p.location !== filters.location) return false
    if (filters.type && p.type !== filters.type) return false
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (p.price < min || (max && p.price > max)) return false
    }
    if (filters.status !== 'all' && p.status !== filters.status) return false
    return true
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-16 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(130deg,#0d143d_0%,#1a1f4e_45%,#304a9b_100%)]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Foreclosed Properties</h1>
          <p className="text-xl text-white/85">Browse our portfolio of available real estate opportunities</p>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 bg-white p-6 rounded shadow">
            <h3 className="font-bold text-navy mb-4">Filter Properties</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="all">All Prices</option>
                  <option value="0-5000000">Below ₱5M</option>
                  <option value="5000000-10000000">₱5M - ₱10M</option>
                  <option value="10000000-20000000">₱10M - ₱20M</option>
                  <option value="20000000-999999999">₱20M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Under OCU">Under OCU</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            Showing <span className="font-bold">{filteredProperties.length}</span> of{' '}
            <span className="font-bold">{properties.length}</span> properties
          </p>

          {/* Property Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No properties match your filters.</p>
              <button
                onClick={() =>
                  setFilters({ location: '', type: '', priceRange: 'all', status: 'all' })
                }
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
