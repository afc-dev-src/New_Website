import { useState } from 'react'

// Placeholder email function
function sendEmailNotification(formData) {
  console.log('Application submitted:', formData)
  return { success: true, message: 'Your application has been received.' }
}

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    mobile: '',
    idType: 'passport',
    idNumber: '',
    // Property Info
    propertyType: 'residential',
    propertyLocation: '',
    propertyPrice: '',
    // Loan Info
    loanAmount: '',
    loanPurpose: 'purchase',
    loanTerm: '10',
    productInterested: 'Real Estate Mortgage',
    // Employment
    employmentStatus: 'employed',
    employer: '',
    position: '',
    monthlyIncome: '',
    // Documents
    agreedToTerms: false,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required'
    }
    if (step === 2) {
      if (!formData.propertyLocation.trim()) newErrors.propertyLocation = 'Property location is required'
      if (!formData.propertyPrice) newErrors.propertyPrice = 'Property price is required'
    }
    if (step === 3) {
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required'
      if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required'
    }
    if (step === 4) {
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to terms'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateStep(4)) return
    const result = sendEmailNotification(formData)
    if (result.success) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-lg text-center max-w-md">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-navy mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. Our loan officers will review your application and contact you within 24 hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <a href="/" className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-12 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Loan Application</h1>
          <p className="text-xl text-gray-300">Quick and easy application process</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded shadow-lg">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded ${
                      step <= currentStep ? 'bg-red-500' : 'bg-gray-300'
                    } mr-4 last:mr-0`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Step {currentStep} of 4
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      />
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      >
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="drivers_license">Driver's License</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      />
                      {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Info */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Property Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Location</label>
                      <input
                        type="text"
                        name="propertyLocation"
                        value={formData.propertyLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        placeholder="City or Address"
                      />
                      {errors.propertyLocation && <p className="text-red-500 text-sm mt-1">{errors.propertyLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Price (₱)</label>
                      <input
                        type="number"
                        name="propertyPrice"
                        value={formData.propertyPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        min="100000"
                      />
                      {errors.propertyPrice && <p className="text-red-500 text-sm mt-1">{errors.propertyPrice}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Loan Info */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Loan Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₱)</label>
                      <input
                        type="number"
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        min="100000"
                      />
                      {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
                      <select
                        name="loanPurpose"
                        value={formData.loanPurpose}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      >
                        <option value="purchase">Purchase Property</option>
                        <option value="refinance">Refinance</option>
                        <option value="business_expansion">Business Expansion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Desired Loan Term (years)</label>
                      <input
                        type="number"
                        name="loanTerm"
                        value={formData.loanTerm}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        min="1"
                        max="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₱)</label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        min="0"
                      />
                      {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Agree */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Review & Submit</h2>
                  <div className="bg-gray-50 p-6 rounded mb-6 max-h-64 overflow-y-auto">
                    <h3 className="font-bold text-navy mb-4">Your Application Summary</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Name:</strong> {formData.fullName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Property Location:</strong> {formData.propertyLocation}</p>
                      <p><strong>Loan Amount:</strong> ₱ {formData.loanAmount}</p>
                      <p><strong>Monthly Income:</strong> ₱ {formData.monthlyIncome}</p>
                      <p><strong>Loan Term:</strong> {formData.loanTerm} years</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                        I agree to the Terms and Conditions and understand that my information will be processed according to our Privacy Policy.
                      </label>
                    </div>
                    {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`px-6 py-2 border border-navy text-navy rounded hover:bg-navy hover:text-white transition ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-bold"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
