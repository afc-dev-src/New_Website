import { useState } from 'react'
import { disclosures as allDisclosures } from '../data/disclosures'

// Placeholder email function
function sendEmailNotification(formData) {
  console.log('Document request email sent:', formData)
  return { success: true, message: 'Your request has been submitted.' }
}

export default function Disclosures() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    documentRequested: '',
  })

  const years = [...new Set(allDisclosures.map((d) => d.year))].sort((a, b) => b - a)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = sendEmailNotification(formData)
    if (result.success) {
      setSubmitted(true)
      setFormData({ fullName: '', email: '', documentRequested: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-12 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Financial Statements & Disclosures</h1>
          <p className="text-xl text-gray-300">Transparency and compliance in all our operations</p>
        </div>
      </section>

      {/* Disclosures by Year */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {years.map((year) => {
            const yearDocs = allDisclosures.filter((d) => d.year === year)
            return (
              <div key={year} className="mb-12">
                <h2 className="text-3xl font-bold text-navy mb-6">{year} Documents</h2>
                <div className="grid gap-4">
                  {yearDocs.map((disclosure) => (
                    <div key={disclosure.id} className="bg-gray-50 p-6 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-navy">{disclosure.title}</h3>
                          <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                            {disclosure.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(disclosure.publishDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-3 mb-4">{disclosure.coverage}</p>
                      <a
                        href={disclosure.downloadUrl}
                        className="inline-block px-6 py-2 bg-navy text-white rounded hover:bg-blue-900 transition text-sm font-medium"
                      >
                        📥 Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Request Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-3xl font-bold text-navy mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-gray-600 mb-6">
              Submit a request for additional documents or information.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">Thank you!</p>
                <p>Your document request has been submitted. We'll respond within 2 business days.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document or Information Needed</label>
                <textarea
                  name="documentRequested"
                  value={formData.documentRequested}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  placeholder="Describe the document or information you need..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
