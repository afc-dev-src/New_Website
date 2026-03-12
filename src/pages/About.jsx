import { Link } from 'react-router-dom'
import aboutUsImage from '../Images/about/About us.jpg'
import companyProfileImage from '../Images/about/company-profile.jpg'

function VisionIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M2.5 12s3.75-6 9.5-6 9.5 6 9.5 6-3.75 6-9.5 6-9.5-6-9.5-6Z"
      />
      <circle cx="12" cy="12" r="3.2" strokeWidth={1.8} />
    </svg>
  )
}

function MissionIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 3.5 18.5 6l-2.5 6.5L9.5 15 7 8.5 12 3.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m14.25 9.75 6.25-6.25" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m9.5 15-2.75 5.5" />
    </svg>
  )
}

function QuoteIcon({ className = '' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.2 6.4c-2.95 1.3-4.83 3.74-5.63 7.32 0 0 1.44-.92 3.27-.92 1.94 0 3.46 1.38 3.46 3.52 0 2.06-1.66 3.63-3.88 3.63-2.78 0-4.68-2.07-4.68-5.18 0-5.27 2.5-8.93 7.46-10.96v2.59Zm10.6 0c-2.95 1.3-4.83 3.74-5.62 7.32 0 0 1.43-.92 3.26-.92 1.95 0 3.47 1.38 3.47 3.52 0 2.06-1.67 3.63-3.89 3.63-2.78 0-4.67-2.07-4.67-5.18 0-5.27 2.49-8.93 7.45-10.96v2.59Z" />
    </svg>
  )
}

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden py-20 text-white md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <img src={aboutUsImage} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(13,20,61,0.72)_0%,rgba(26,31,78,0.62)_48%,rgba(220,38,38,0.38)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 backdrop-blur-sm">
            About AFC SME Finance Inc.
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-[-0.03em] md:text-6xl">
            Financing Built for Filipino Families and Entrepreneurs
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
            We provide practical real estate financing with clear process, reliable service, and genuine care for
            the people and communities we serve across the Philippines.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-[5vh] bg-transparent pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#dbe3ff] bg-white shadow-[0_16px_34px_rgba(26,31,78,0.14)] lg:grid-cols-2">
            <article className="bg-[#1a1f4e] p-6 text-white md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <VisionIcon className="h-7 w-7 text-red-200" />
                </div>
                <div>
                  
                  <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Vision</h3>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/92 md:text-xl">
                By 2030, we envision being the preferred real estate loan provider in the Philippines, offering
                competitive financial products and personalized services.
              </p>
            </article>

            <article className="bg-[#f8faff] p-6 text-[#1a1f4e] md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#dbe3ff] bg-white shadow-[0_10px_22px_rgba(26,31,78,0.08)]">
                  <MissionIcon className="h-7 w-7 text-red-600" />
                </div>
                <div>
                  
                  <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Mission</h3>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#1a1f4e]/88 md:text-xl">
                To open doors for Filipinos toward a meaningful life filled with hope, business success, and the dream of owning a home.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[28px] border border-[#dbe3ff] bg-[#f8faff] p-6 shadow-[0_16px_34px_rgba(26,31,78,0.08)] md:p-8">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-[#f1d5d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600">
                Meet Our Team
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#1a1f4e] md:text-3xl">AFC SME Leadership Team</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#1a1f4e]/70 md:text-base">
                The people behind AFC SME combine experience, relationship-driven service, and practical financing
                guidance to support every client journey.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.14fr_0.86fr] lg:items-stretch lg:gap-8">
              <article className="overflow-hidden rounded-[24px] border border-[#dbe3ff] bg-white p-3 shadow-[0_14px_30px_rgba(26,31,78,0.08)] lg:h-full">
                <div className="h-[320px] overflow-hidden rounded-[18px] md:h-[380px] lg:h-full lg:min-h-[420px]">
                  <img
                    src={companyProfileImage}
                    alt="AFC SME company profile"
                    className="h-full w-full object-cover object-[center_35%]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>

              <article className="rounded-[24px] border border-[#dbe3ff] bg-white p-6 shadow-[0_14px_30px_rgba(26,31,78,0.08)] md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <QuoteIcon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
                    Message from the President
                  </p>
                </div>
                <blockquote className="mt-5 space-y-3.5 text-[15px] leading-relaxed text-[#1a1f4e] md:text-base">
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
                <div className="mt-5 border-t border-[#dbe3ff] pt-4">
                  <p className="font-bold text-[#1a1f4e]">Bernadette Recto</p>
                  <p className="text-[#1a1f4e]/80">President &amp; CEO, AFC SME Finance, Inc.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[28px] border border-[#dbe3ff] bg-white px-6 py-10 text-center shadow-[0_16px_34px_rgba(26,31,78,0.08)] md:px-10 md:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Ready to Talk</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1a1f4e]">Let Us Help You Move Forward</h2>
            <p className="mt-4 text-gray-600">
              Tell us your financing goal and our team will guide you on the best next step.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-red-700"
              >
                Talk to Our Team
              </Link>
              <Link
                to="/#inquiry-form"
                className="inline-flex items-center justify-center rounded-xl border border-[#1a1f4e]/20 px-7 py-3 font-semibold text-[#1a1f4e] transition-colors hover:bg-[#1a1f4e] hover:text-white"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
