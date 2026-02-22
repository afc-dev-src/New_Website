import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PropertyCard({ property, onInquire }) {
  const [showDetails, setShowDetails] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
        <span className="text-gray-500">📍 {property.location}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-navy mb-2">{property.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{property.type} • {property.location}</p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-red-500">₱{property.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{property.status}</p>
        </div>

        {/* Details if expanded */}
        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="mb-2"><strong>Size:</strong> {property.size}</p>
            <p className="mb-2"><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p className="mb-2"><strong>Bathrooms:</strong> {property.bathrooms}</p>
            <p><strong>Features:</strong> {property.features}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 px-3 py-2 text-sm border border-navy text-navy rounded hover:bg-navy hover:text-white transition"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
          <button
            onClick={() => navigate('/#inquiry-form')}
            className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  )
}
