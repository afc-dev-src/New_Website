import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import HeroSlider from '../components/HeroSlider'
import InquiryForm from '../components/InquiryForm'
import ProductExplorer from '../components/ProductExplorer'
import BranchesSection from '../components/BranchesSection'
import { properties as allProperties } from '../data/properties'
import { homeProductExplorer } from '../data/products'

const differentiators = [
  {
    title: 'Transparent Terms',
    description: 'No hidden fees. Key terms are shared early so you can compare options with confidence.',
  },
  {
    title: 'Fast Processing',
    description: 'We prioritize speed without skipping due diligence, so application timelines stay realistic.',
  },
  {
    title: 'SME-Focused',
    description: 'Loan structures are designed around the real cash-flow patterns of small and growing businesses.',
  },
  {
    title: 'Simple Requirements',
    description: 'Document requests stay practical and focused to avoid unnecessary processing delays.',
  },
]

export default function Home() {
  const previewLoanAmount = 1000000
  const previewMonthlyRate = 0.5
  const previewTermMonths = 60

  const calculatorResult = useMemo(() => {
    if (previewLoanAmount <= 0 || previewTermMonths <= 0 || previewMonthlyRate < 0) return null

    const monthlyRate = previewMonthlyRate / 100
    const monthlyPayment = previewLoanAmount / previewTermMonths + previewLoanAmount * monthlyRate
    const totalRepayment = monthlyPayment * previewTermMonths

    return { monthlyPayment, totalRepayment }
  }, [previewLoanAmount, previewMonthlyRate, previewTermMonths])

  const featuredProperties = allProperties
    .filter((property) => property.status === 'Available')
    .slice(0, 3)

  const propertyImages = homeProductExplorer.map((product) => product.sectionBgImage)

  const getPropertyCategory = (type) => {
    if (type.toLowerCase().includes('commercial') || type.toLowerCase().includes('office')) return 'Commercial'
    if (type.toLowerCase().includes('lot')) return 'Lot'
    return 'Residential'
  }

  return (
    <div>
      <HeroSlider />
      <ProductExplorer />

      <section className="section-fade-in section-surface section-bg-rem py-10 md:py-12" data-reveal>
        <div className="w-full max-w-[1279px] mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-semibold tracking-wider uppercase">Why AFC SME</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e] mt-4">Built for Clear Decisions</h2>
            <p className="text-[#1a1f4e]/75 text-base md:text-lg mt-4 leading-relaxed">
              Explore financing options with guidance focused on terms, timelines, and practical fit.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/50 bg-white/80 p-6 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1f4e] mb-2">{item.title}</h3>
                <p className="text-[#1a1f4e]/75 text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-fade-in section-surface section-bg-takeout py-14 md:py-16" data-reveal>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-red-600 text-sm font-semibold tracking-wider uppercase">Loan Calculator</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e] mt-3">Estimate Your Monthly Payments</h2>
              <p className="text-[#1a1f4e]/75 mt-4 max-w-lg leading-relaxed">
                Run a quick preview to estimate monthly obligations before submitting your inquiry.
              </p>
              <Link
                to="/calculator"
                className="mt-7 inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-7 py-3 rounded-xl shadow-lg shadow-red-600/20"
              >
                Try the Calculator
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {calculatorResult && (
              <div className="flex-1 max-w-md w-full">
                <div className="bg-[#1a1f4e]/90 rounded-2xl p-7 border border-[#1a1f4e]/80 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-5">Quick Preview</h3>
                  <div className="space-y-3 text-sm md:text-base">
                    <div className="flex justify-between gap-4">
                      <span className="text-white/75">Loan Amount</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(previewLoanAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/75">Interest Rate</span>
                      <span className="font-semibold">{previewMonthlyRate}% per month</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/75">Term</span>
                      <span className="font-semibold">{previewTermMonths} months</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-white/95">Est. Monthly Payment</span>
                    <span className="text-2xl font-bold text-red-300">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(calculatorResult.monthlyPayment)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-white/60">*Estimate only. Final terms are subject to approval.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-fade-in section-surface section-bg-acquisition py-16 md:py-20" data-reveal>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-semibold tracking-wider uppercase">Foreclosed Properties</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e] mt-3">Browse Available Properties</h2>
            <p className="text-[#1a1f4e]/75 text-base md:text-lg mt-4 leading-relaxed">
              Review selected listings and explore potential opportunities directly from the website.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="bg-white/90 rounded-2xl overflow-hidden border border-white/70 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="h-72 bg-cover bg-center relative transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${propertyImages[index % propertyImages.length]})` }}
                >
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                      {property.status}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-[#1a1f4e] text-white text-sm font-semibold">
                      {getPropertyCategory(property.type)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a1f4e] leading-tight">{property.name}</h3>
                  <p className="text-gray-600 text-lg mt-2">{property.location}</p>
                  <p className="text-4xl font-bold text-red-600 mt-4">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(property.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-3 border-2 border-[#1a1f4e] bg-white text-[#1a1f4e] font-semibold px-8 py-3 rounded-2xl transition-all duration-200 hover:bg-[#1a1f4e] hover:text-white"
            >
              Browse All Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <BranchesSection compact />
      <InquiryForm />
    </div>
  )
}
