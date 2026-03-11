import { useEffect, useRef, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function sendForeclosedPropertyEmail(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-foreclosed-property-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send foreclosed property inquiry')
    }

    return { success: true, message: 'Foreclosed property inquiry sent successfully!' }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, message: error.message }
  }
}

export default function ForeclosedPropertyForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    propertyInterested: '',
    message: '',
    consent: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.propertyInterested.trim()) newErrors.propertyInterested = 'Property reference is required'
    if (!formData.consent) newErrors.consent = 'Consent is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isLoading) return

    setIsLoading(true)
    sendForeclosedPropertyEmail(formData).then((result) => {
      if (result.success) {
        setSubmitted(true)
        setFormData({
          fullName: '',
          mobile: '',
          email: '',
          propertyInterested: '',
          message: '',
          consent: false,
        })
        timeoutRef.current = setTimeout(() => {
          setSubmitted(false)
          setIsLoading(false)
        }, 5000)
      } else {
        alert(`Error: ${result.message}`)
        setIsLoading(false)
      }
    })
  }

  return (
    <section id="foreclosed-property-form" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e]">Foreclosed Property Inquiry</h2>
            <p className="text-gray-600 leading-relaxed">
              This is a dedicated form for foreclosed properties, handled by the property team.
            </p>
            <p className="text-sm text-gray-500">
              Include the exact property name or listing reference for faster processing.
            </p>
          </div>

          <div className="lg:col-span-2">
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">Thank you!</p>
                <p>Your foreclosed property inquiry has been submitted.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#dbe3ff] bg-white p-6 shadow-[0_20px_45px_rgba(26,31,78,0.12)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 focus:outline-none focus:border-red-500"
                    placeholder="Your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 focus:outline-none focus:border-red-500"
                    placeholder="09XXXXXXXXX"
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 focus:outline-none focus:border-red-500"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Name / Reference *</label>
                <input
                  type="text"
                  name="propertyInterested"
                  value={formData.propertyInterested}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 focus:outline-none focus:border-red-500"
                  placeholder="Example: Lot 8 Block 3, QC"
                />
                {errors.propertyInterested && <p className="text-red-500 text-xs mt-1">{errors.propertyInterested}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 focus:outline-none focus:border-red-500"
                  placeholder="Additional details..."
                />
              </div>

              <div>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>I consent to the use of my information for property inquiry processing.</span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isLoading ? 'Sending...' : 'Submit Property Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
