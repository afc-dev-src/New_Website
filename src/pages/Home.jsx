import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import HeroSlider from '../components/HeroSlider'
import InquiryForm from '../components/InquiryForm'
import ProductExplorer from '../components/ProductExplorer'
import { properties as allProperties } from '../data/properties'
import { homeProductExplorer } from '../data/products'

const differentiators = [
  {
    icon: 'lightning',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Fast Processing',
    description: 'We keep requirements and assessment efficient so qualified applications move forward sooner.',
  },
  {
    icon: 'shield',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Secure & Reliable',
    description: 'Operate with confidence through a compliant, transparent financing process from start to release.',
  },
  {
    icon: 'handshake',
    iconBg: 'bg-[#e8edff]',
    iconColor: 'text-[#1a1f4e]',
    title: 'Personalized Service',
    description: 'Our loan team provides practical guidance tailored to your goals at every stage of the application.',
  },
  {
    icon: 'trending-up',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'Competitive Rates',
    description: 'Choose from financing options with sensible pricing and flexible terms that fit your budget plan.',
  },
]

function DifferentiatorIcon({ type, className = '' }) {
  if (type === 'lightning') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    )
  }

  if (type === 'shield') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      </svg>
    )
  }

  if (type === 'handshake') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2a2 2 0 002.8 0l1.7-1.7a2 2 0 012.8 0L20 15M4 9l4-3 4 3M2 10l4 4m16-4l-4 4" />
      </svg>
    )
  }

  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l5-5 4 4 7-7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 8h6v6" />
    </svg>
  )
}

function HouseIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11l9-7 9 7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10v10h14V10" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20v-6h4v6" />
    </svg>
  )
}

export default function Home() {
  const previewLoanAmount = 1000000
  const previewMonthlyRate = 0.9
  const previewTermMonths = 120

  const calculatorResult = useMemo(() => {
    if (previewLoanAmount <= 0 || previewTermMonths <= 0 || previewMonthlyRate < 0) return null

    const monthlyRate = previewMonthlyRate / 100
    let monthlyPayment
    if (monthlyRate === 0) {
      monthlyPayment = previewLoanAmount / previewTermMonths
    } else {
      const numerator = monthlyRate * Math.pow(1 + monthlyRate, previewTermMonths)
      const denominator = Math.pow(1 + monthlyRate, previewTermMonths) - 1
      monthlyPayment = previewLoanAmount * (numerator / denominator)
    }
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

  const getMonthlyAmortization = (amount) => {
    if (amount <= 0 || previewTermMonths <= 0 || previewMonthlyRate < 0) return 0
    const monthlyRate = previewMonthlyRate / 100
    if (monthlyRate === 0) return amount / previewTermMonths
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, previewTermMonths)
    const denominator = Math.pow(1 + monthlyRate, previewTermMonths) - 1
    return amount * (numerator / denominator)
  }

  return (
    <div>
      <HeroSlider />
      <ProductExplorer />

      <section className="py-10 md:py-12 bg-[#f5f7ff]">
        <div className="w-full max-w-[1279px] mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-semibold tracking-wider uppercase">Why AFC SME</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e] mt-4">Built for Filipino People</h2>
            <p className="text-[#1a1f4e]/75 text-base md:text-lg mt-4 leading-relaxed">
              Explore financing options with guidance focused on terms, timelines, and practical fit.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-[#dbe3ff] bg-white p-6 shadow-[0_12px_30px_rgba(26,31,78,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(26,31,78,0.14)]"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                  <DifferentiatorIcon type={item.icon} className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1f4e] mb-2">{item.title}</h3>
                <p className="text-[#1a1f4e]/75 text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-14 md:py-16 bg-[#1a1f4e]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-red-300 text-sm font-semibold tracking-wider uppercase">Loan Calculator</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Estimate Your Monthly Payments</h2>
              <p className="text-white/75 mt-4 max-w-lg leading-relaxed">
                Run a quick preview to estimate monthly obligations before submitting your inquiry.
              </p>
              <Link
                to="/calculator"
                className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-7 py-3 text-base font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.35)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(220,38,38,0.45)]"
              >
                Try the Calculator
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {calculatorResult && (
              <div className="flex-1 max-w-md w-full">
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#0f1a49] via-[#1a1f4e] to-[#162a6a] p-7 text-white shadow-2xl">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.2),transparent_44%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
                  <div className="relative">
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
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
                      <span className="text-lg font-semibold text-white/95">Est. Monthly Payment</span>
                      <span className="text-2xl font-bold text-red-300">
                        {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(calculatorResult.monthlyPayment)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-white/60">*Estimate only. Final terms are subject to approval.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#ffffff_0%,#f5f7ff_100%)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-semibold tracking-wider uppercase">Foreclosed Properties</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1f4e]">
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <HouseIcon className="h-6 w-6" />
                </span>
                Browse Available Properties
              </span>
            </h2>
            <p className="text-[#1a1f4e]/75 text-base md:text-lg mt-4 leading-relaxed">
              Review selected listings and explore potential opportunities directly from the website.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-[#dbe3ff] bg-white/95 shadow-[0_16px_34px_rgba(26,31,78,0.08)] group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(26,31,78,0.16)]"
              >
                <div
                  className="relative h-72 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${propertyImages[index % propertyImages.length]})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f4e]/45 via-[#1a1f4e]/10 to-transparent" />
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
                  <p className="inline-flex items-center gap-2 rounded-full bg-[#f5f7ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1a1f4e]/80">
                    <HouseIcon className="h-4 w-4 text-red-600" />
                    Property Listing
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a1f4e] leading-tight">{property.name}</h3>
                  <p className="text-gray-600 text-lg mt-2">{property.location}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#1a1f4e]/60">As low as</p>
                  <p className="text-3xl md:text-4xl font-bold text-red-600 mt-1">
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(getMonthlyAmortization(property.price))}
                    <span className="ml-1 text-base font-semibold text-red-500/90">/month</span>
                  </p>
                  <p className="text-sm text-[#1a1f4e]/60 mt-2">
                    Total Price:{' '}
                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(property.price)}
                  </p>
                  <p className="text-[11px] text-[#1a1f4e]/50 mt-2">Estimated amortization based on standard sample terms.</p>
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

      <InquiryForm />
    </div>
  )
}
