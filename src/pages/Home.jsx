import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import HeroSlider from '../components/HeroSlider'
import InquiryForm from '../components/InquiryForm'
import ProductExplorer from '../components/ProductExplorer'
import { properties as allProperties } from '../data/properties'
import { homeProductExplorer } from '../data/products'
import { api } from '../services/api'
import whyFastProcessingImage from '../Images/WHY-Fast Processing.jpg'
import whySecureReliableImage from '../Images/WHY- Secure and Reliable.jpg'
import whyGuidingImage from '../Images/WHY-Guiding.jpg'
import whyTermsImage from '../Images/WHY-Terms.jpg'

const differentiators = [
  {
    title: 'Fast Processing',
    description: 'Once complete requirements are in, we move quickly and keep you updated.',
    image: whyFastProcessingImage,
    imagePosition: 'object-left md:object-center',
  },
  {
    title: 'Secure & Reliable',
    description: 'Your plans deserve a partner you can trust. We keep things clear, secure, and consistent from start to finish.',
    image: whySecureReliableImage,
    imagePosition: 'object-right',
  },
  {
    title: 'Step-by-step Guide',
    description: 'May kausap ka. We walk with you through every step—requirements, processing, and release—so you always know what’s next.',
    image: whyGuidingImage,
    imagePosition: 'object-center',
  },
  {
    title: 'Flexible Terms',
    description: 'Payment options that work with your cash flow, so you can move forward with confidence.',
    image: whyTermsImage,
    imagePosition: 'object-center md:object-right',
  },
]

const partnerPlaceholders = [
  { id: 'p1', name: 'Partner 01' },
  { id: 'p2', name: 'Partner 02' },
  { id: 'p3', name: 'Partner 03' },
  { id: 'p4', name: 'Partner 04' },
  { id: 'p5', name: 'Partner 05' },
  { id: 'p6', name: 'Partner 06' },
]

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
  const [properties, setProperties] = useState(allProperties)
  const [activePartner, setActivePartner] = useState(0)
  const [showHeroStrip, setShowHeroStrip] = useState(true)

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePartner((prev) => (prev + 1) % partnerPlaceholders.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setShowHeroStrip(window.scrollY < 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const previewLoanAmount = 1000000
  const previewMonthlyRate = 0.9
  const previewTermMonths = 120

  const calculatorResult = useMemo(() => {
    if (previewLoanAmount <= 0 || previewTermMonths <= 0 || previewMonthlyRate < 0) return null

    const monthlyRate = previewMonthlyRate / 100
    const monthlyPayment = ((previewLoanAmount * monthlyRate * previewTermMonths) + previewLoanAmount) / previewTermMonths
    const totalRepayment = monthlyPayment * previewTermMonths

    return { monthlyPayment, totalRepayment }
  }, [previewLoanAmount, previewMonthlyRate, previewTermMonths])

  const featuredProperties = properties
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
    return ((amount * monthlyRate * previewTermMonths) + amount) / previewTermMonths
  }

  return (
    <div>
      <HeroSlider />

      <section
        className={`bg-white overflow-hidden transition-all duration-300 ${
          showHeroStrip
            ? 'border-b border-[#e5e7eb] max-h-24 opacity-100 py-5 md:py-12'
            : 'border-b border-transparent max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm md:text-base text-[#1a1f4e]/75">
           
          </p>
        </div>
      </section>

      <ProductExplorer
        middleContent={(
          <section className="py-6 md:py-8 bg-[#f3f5f9]">
            <div className="w-full max-w-[1279px] mx-auto px-6">
              <div className="max-w-3xl">
                <h2 className="text-xl md:text-2xl font-bold text-[#1a1f4e]">WHY CHOOSE AFC SME</h2>
                <p className="text-[#374151] text-sm mt-2 leading-relaxed">
                  We&apos;re here to help you move forward-para sa negosyo, para sa pamilya.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {differentiators.map((item) => (
                  <div
                    key={item.title}
                    className="overflow-hidden rounded-2xl border border-[#e5e7eb]/80 bg-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="border border-black/5">
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`h-[100px] md:h-[125px] w-full object-cover ${item.imagePosition} filter contrast-[1.1] saturate-[1.08] brightness-[0.96]`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="h-px w-full bg-black/5" />
                    <div className="px-4 py-3">
                      <h3 className="text-sm md:text-base font-bold uppercase tracking-wide text-[#1a1f4e] mb-1.5">{item.title}</h3>
                      <p className="text-[#4b5563] text-sm md:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      />

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
                  <div className="pointer-events-none absolute -top-6 -right-5 h-20 w-20 rounded-full border border-cyan-200/40 bg-cyan-300/15" />
                  <div className="pointer-events-none absolute top-8 left-5 h-7 w-7 rotate-45 rounded-sm border border-white/35 bg-white/10" />
                  <div className="pointer-events-none absolute bottom-10 left-8 h-0 w-0 border-l-[14px] border-r-[14px] border-b-[22px] border-l-transparent border-r-transparent border-b-red-300/35" />
                  <div className="pointer-events-none absolute bottom-8 right-10 h-8 w-8 rounded-md border border-red-200/35 bg-red-300/10" />
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
                    <p className="mt-2 text-xs text-white/70">
                      Formula: ((Loan x Monthly Rate x Term) + Loan) / Term
                    </p>
                    <p className="mt-3 text-xs text-white/60">*Estimate only. Final terms are subject to approval.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-[linear-gradient(180deg,#f3f6ff_0%,#ffffff_100%)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-red-600 text-xs md:text-sm font-semibold tracking-wider uppercase">Our Network</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#1a1f4e]">Trusted Partners</h2>
            <p className="mt-3 text-[#1a1f4e]/70 text-sm md:text-base">
              Placeholder logos below. Replace these with actual partner brands anytime.
            </p>
          </div>

          <div className="relative mt-10 h-[220px] md:h-[260px]">
            {partnerPlaceholders.map((partner, index) => {
              const count = partnerPlaceholders.length
              let offset = (index - activePartner + count) % count
              if (offset > count / 2) offset -= count
              const absOffset = Math.abs(offset)
              const isVisible = absOffset <= 2
              const translateX = offset * 210
              const scale = Math.max(0.8, 1.08 - absOffset * 0.14)
              const opacity = isVisible ? Math.max(0.25, 1 - absOffset * 0.22) : 0
              const zIndex = isVisible ? 20 - absOffset : 0

              return (
                <div
                  key={partner.id}
                  className={`absolute left-1/2 top-1/2 w-[210px] md:w-[260px] -translate-y-1/2 transition-all duration-700 ${
                    isVisible ? '' : 'pointer-events-none'
                  }`}
                  style={{
                    transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) scale(${scale})`,
                    opacity,
                    zIndex,
                  }}
                >
                  <div className="h-[130px] md:h-[165px] w-full rounded-2xl border border-[#dbe3ff] bg-white shadow-[0_16px_30px_rgba(26,31,78,0.10)] flex items-center justify-center">
                    <span className="text-[#1a1f4e]/50 font-semibold text-xs md:text-sm tracking-wide uppercase">
                      Logo Placeholder
                    </span>
                  </div>
                  <p className="mt-2 text-center text-[#1a1f4e]/70 font-semibold text-xs md:text-sm tracking-wide">
                    {partner.name}
                  </p>
                </div>
              )
            })}
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
            {featuredProperties.map((property, index) => {
              const propertyImage =
                (Array.isArray(property.imageUrls) && property.imageUrls[0]) ||
                property.imageUrl ||
                propertyImages[index % propertyImages.length]

              return (
                <div
                  key={property.id}
                  className="overflow-hidden rounded-2xl border border-[#dbe3ff] bg-white/95 shadow-[0_16px_34px_rgba(26,31,78,0.08)] group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(26,31,78,0.16)]"
                >
                  <div
                    className="relative h-72 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${propertyImage})` }}
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
              )
            })}
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
