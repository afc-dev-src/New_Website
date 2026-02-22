import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div>
      <section className="py-16 md:py-24 bg-[#1a1f4e]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-red-400 text-sm font-semibold tracking-wider uppercase mb-3">Company</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">About AFC SME Finance</h1>
          <p className="text-white/70 mt-5 max-w-3xl leading-relaxed">
            AFC SME Finance provides practical financing solutions for property buyers and growing businesses.
            We focus on transparent terms, responsive service, and responsible lending.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1a1f4e] mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Help SMEs and property buyers access financing that supports long-term growth and stability.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1a1f4e] mb-3">Our Approach</h2>
            <p className="text-gray-600 leading-relaxed">
              We combine clear underwriting, realistic repayment structures, and strong client support.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#1a1f4e] mb-3">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              Operate with accountability, compliance, and transparency at every stage of the financing process.
            </p>
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
