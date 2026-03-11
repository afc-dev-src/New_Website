import { Link } from 'react-router-dom'
import aboutUsImage from '../Images/About us.jpg'
import companyProfileImage from '../Images/company-profile.jpg'

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden py-20 md:py-28 text-white">
        <div className="pointer-events-none absolute inset-0">
          <img src={aboutUsImage} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(13,20,61,0.72)_0%,rgba(26,31,78,0.62)_48%,rgba(220,38,38,0.38)_100%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-red-200 text-sm font-semibold tracking-[0.16em] uppercase mb-3">About AFC SME Finance Inc.</p>
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            Financing Built for Filipino Families and Entrepreneurs
          </h1>
          <p className="text-white/85 mt-6 max-w-3xl leading-relaxed text-lg">
            We provide practical real estate financing with clear process, reliable service, and genuine care for
            the people and communities we serve across the Philippines.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-[5vh] pb-16 md:pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-[#dbe3ff] shadow-[0_14px_32px_rgba(26,31,78,0.18)]">
            <article className="bg-[#1a1f4e] p-6 md:p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-semibold">Vision</h3>
              <p className="mt-4 text-lg md:text-xl leading-relaxed font-medium text-white/95">
                By 2030, we envision being the preferred real estate loan provider in the Philippines, offering
                competitive financial products and personalized services.
              </p>
            </article>

            <article className="bg-[#f8faff] p-6 md:p-8 text-[#1a1f4e]">
              <h3 className="text-2xl md:text-3xl font-semibold">Mission</h3>
              <p className="mt-4 text-lg md:text-xl leading-relaxed font-medium text-[#1a1f4e]/90">
                To open doors for Filipinos toward a meaningful life through success in business and home ownership.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl border border-[#dbe3ff] bg-[#f8faff] p-6 md:p-8 shadow-[0_16px_34px_rgba(26,31,78,0.08)]">
            <p className="text-red-600 text-xs font-semibold tracking-[0.16em] uppercase">Meet Our Team</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#1a1f4e]">AFC SME Leadership Team</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-[#dbe3ff] bg-white shadow-[0_12px_28px_rgba(26,31,78,0.10)]">
              <img
                src={companyProfileImage}
                alt="AFC SME company profile"
                className="aspect-[16/7] w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
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

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1a1f4e]">Let Us Help You Move Forward</h2>
          <p className="text-gray-600 mt-4">
            Tell us your financing goal and our team will guide you on the best next step.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-xl"
            >
              Talk to Our Team
            </Link>
            <Link
              to="/#inquiry-form"
              className="border border-[#1a1f4e]/20 text-[#1a1f4e] hover:bg-[#1a1f4e] hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
