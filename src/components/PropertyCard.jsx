import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PropertyCard({ property }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const navigate = useNavigate()

  const propertyImages = Array.isArray(property.imageUrls) && property.imageUrls.length > 0
    ? property.imageUrls.filter(Boolean)
    : property.imageUrl
      ? [property.imageUrl]
      : []

  const propertyImage = propertyImages[0] || ''
  const hasMultipleImages = propertyImages.length > 1

  const openGallery = (index = 0) => {
    if (propertyImages.length === 0) return
    setActiveImageIndex(index)
    setIsGalleryOpen(true)
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
  }

  const showPrevious = () => {
    setActiveImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
  }

  const showNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % propertyImages.length)
  }

  useEffect(() => {
    if (!isGalleryOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeGallery()
      if (event.key === 'ArrowLeft' && hasMultipleImages) showPrevious()
      if (event.key === 'ArrowRight' && hasMultipleImages) showNext()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isGalleryOpen, hasMultipleImages, propertyImages.length])

  return (
    <div className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition">
      {propertyImage ? (
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="relative block w-full text-left group"
          aria-label={`Open ${property.name} image gallery`}
        >
          <img
            src={propertyImage}
            alt={property.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          <span className="absolute right-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {propertyImages.length} image{propertyImages.length > 1 ? 's' : ''}
          </span>
        </button>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <span className="text-gray-500">Property Image</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-navy mb-2">{property.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{property.type} - {property.location}</p>

        <div className="mb-4">
          <p className="text-2xl font-bold text-red-500">PHP {property.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{property.status}</p>
        </div>

        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
            <p className="mb-2"><strong>Size:</strong> {property.size}</p>
            <p className="mb-2"><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p className="mb-2"><strong>Bathrooms:</strong> {property.bathrooms}</p>
            <p><strong>Features:</strong> {property.features}</p>
          </div>
        )}

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

      {isGalleryOpen && propertyImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4 md:p-8 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${property.name} image gallery`}
          onClick={closeGallery}
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeGallery}
              className="text-white border border-white/40 px-3 py-1 rounded hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-3 md:gap-6 mt-2" onClick={(e) => e.stopPropagation()}>
            {hasMultipleImages && (
              <button
                type="button"
                onClick={showPrevious}
                className="text-white border border-white/40 w-10 h-10 rounded-full hover:bg-white/10"
                aria-label="Previous image"
              >
                &#8249;
              </button>
            )}

            <img
              src={propertyImages[activeImageIndex]}
              alt={`${property.name} ${activeImageIndex + 1}`}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded"
            />

            {hasMultipleImages && (
              <button
                type="button"
                onClick={showNext}
                className="text-white border border-white/40 w-10 h-10 rounded-full hover:bg-white/10"
                aria-label="Next image"
              >
                &#8250;
              </button>
            )}
          </div>

          {hasMultipleImages && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex justify-center gap-2 min-w-max mx-auto">
                {propertyImages.map((image, index) => (
                  <button
                    key={`${property.id}-${index}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex(index)
                    }}
                    className={`rounded overflow-hidden border-2 ${index === activeImageIndex ? 'border-white' : 'border-transparent opacity-70'}`}
                  >
                    <img src={image} alt={`${property.name} thumbnail ${index + 1}`} className="w-16 h-16 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
