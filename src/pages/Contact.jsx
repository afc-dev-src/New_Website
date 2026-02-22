import { useState, useRef, useEffect } from 'react'

function sendEmailNotification(formData) {
  return { success: true, message: 'Your message has been received.' }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isLoading) return

    setIsLoading(true)
    const result = sendEmailNotification(formData)
    if (result.success) {
      setSubmitted(true)
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      })
      timeoutRef.current = setTimeout(() => {
        setSubmitted(false)
        setIsLoading(false)
      }, 5000)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <section className="section-fade-in py-12 bg-[#1a1f4e]" data-reveal>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contact Us</h1>
          <p className="text-xl text-white/80">Reach out for loan guidance, requirements, or branch coordination.</p>
        </div>
      </section>

      <section className="section-fade-in relative overflow-hidden py-12 bg-[linear-gradient(180deg,#eef2ff_0%,#f8faff_100%)]" data-reveal>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-red-400/15 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-[#1a1f4e]/12 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1a1f4e] mb-8 text-center">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">Thank you!</p>
                <p>We received your message and will respond within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[#dbe3ff] bg-white p-6 shadow-[0_20px_45px_rgba(26,31,78,0.14)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 shadow-sm focus:outline-none focus:border-red-500"
                  placeholder="Your name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 shadow-sm focus:outline-none focus:border-red-500"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 shadow-sm focus:outline-none focus:border-red-500"
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full rounded-xl border border-gray-300 bg-[#fcfdff] px-4 py-2.5 shadow-sm focus:outline-none focus:border-red-500"
                  placeholder="Your message..."
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold rounded hover:bg-red-600 transition"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
