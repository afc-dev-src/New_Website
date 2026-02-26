import { Link } from 'react-router-dom'
import { REGULATORY_INFO } from '../constants'

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(130deg,#0d143d_0%,#1a1f4e_40%,#2e448f_100%)]" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-red-300 text-sm font-semibold tracking-wider uppercase mb-3">Company</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">About AFC SME Finance Inc.</h1>
          <p className="text-white/80 mt-5 max-w-4xl leading-relaxed text-lg">
            AFC SME Finance, Inc. is a Filipino-owned financing company focused on fast and secured real estate loans.
            We continue to serve more clients and communities nationwide through practical, accessible, and reliable financing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[linear-gradient(180deg,#ffffff_0%,#f5f7ff_100%)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-[#dbe3ff] bg-white p-8 shadow-[0_14px_32px_rgba(26,31,78,0.08)]">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-red-600">About AFC SME</p>
              <h2 className="mt-3 text-2xl font-bold text-[#1a1f4e]">Who We Are</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                AFC SME Finance, Inc. provides practical real estate financing designed for Filipino families and business owners.
              </p>
            </div>
            <div className="rounded-2xl border border-[#dbe3ff] bg-white p-8 shadow-[0_14px_32px_rgba(26,31,78,0.08)]">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-red-600">Vision</p>
              <h2 className="mt-3 text-2xl font-bold text-[#1a1f4e]">Confidence Through Access</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                We envision more Filipinos moving forward with confidence through financing that is accessible and dependable.
              </p>
            </div>
            <div className="rounded-2xl border border-[#dbe3ff] bg-white p-8 shadow-[0_14px_32px_rgba(26,31,78,0.08)]">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-red-600">Mission</p>
              <h2 className="mt-3 text-2xl font-bold text-[#1a1f4e]">Practical Financial Support</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                We deliver clear terms, responsive service, and structured loan solutions aligned with real-life business and family goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f5f7ff]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-2xl border border-[#dbe3ff] bg-white p-8 md:p-10 shadow-[0_16px_34px_rgba(26,31,78,0.08)]">
            <p className="text-red-600 text-sm font-semibold tracking-wider uppercase mb-4">Message from the President</p>
            <blockquote className="text-[#1a1f4e] leading-relaxed space-y-4">
              <p>
                At AFC SME, we believe that life is made meaningful when financial solutions are practical, accessible,
                and convenient.
              </p>
              <p>
                Being part of your journey, whether in securing your future, growing your business, or unlocking
                opportunities through our Real Estate Loan, is something we truly value.
              </p>
              <p>
                As we move into 2026, we remain committed to helping more Filipinos move forward with confidence by
                providing reliable financing services and solutions.
              </p>
            </blockquote>
            <p className="mt-6 font-bold text-[#1a1f4e]">Bernadette Recto</p>
            <p className="text-[#1a1f4e]/80">President &amp; CEO, AFC SME Finance, Inc.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1f4e]">Regulatory Information</h2>
            <div className="mt-5 space-y-2 text-gray-700">
              <p>SEC Registration No. {REGULATORY_INFO.SEC_REGISTRATION_NO}</p>
              <p>Certificate of Authority to Operate: No. {REGULATORY_INFO.CERTIFICATE_OF_AUTHORITY_NO}</p>
              <p>
                Important: Kindly study the Terms and Conditions in the disclosure statement before proceeding with your
                loan transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1a1f4e]">Need Financing Guidance?</h2>
          <p className="text-gray-600 mt-4">
            Reach out to our team to discuss product fit, requirements, and timelines.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-xl"
            >
              Contact Us
            </Link>
            <Link
              to="/application-form"
              className="border border-[#1a1f4e]/20 text-[#1a1f4e] hover:bg-[#1a1f4e] hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors"
            >
              Open Forms
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
