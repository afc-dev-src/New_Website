import { Link } from 'react-router-dom'
import remProduct from '../Images/REM-Products.jpg'
import takeoutProduct from '../Images/takeout-products.jpg'
import acquisitionProduct from '../Images/AQ-Products.jpg'

const productSections = [
  {
    id: 'product-mortgage',
    title: 'REAL ESTATE LOAN',
    description:
      'Make the most of your property\'s value. We accept lot, residential, and commercial assets as collateral for loan.',
    image: remProduct,
    ctaLabel: 'Start Application',
    reverse: false,
    processBg: 'bg-gray-50',
    who: [
      'Loan approval in 1 – 2 weeks',
      '0.9% interest rate ',
      'Up to 60 months loan term ',
    ],
    requirements: [
      'Copy of title (TCT / CCT)',
      'Latest copy of Tax Declaration, Real Estate Tax Receipt, and Tax Clearance (Land and Building) ',
      'Vicinity map',
      'Two valid IDs of borrower and co-borrower',
      'Application Form',
      'Source of Income',
    ],
    steps: [
      'Submit application and initial documents',
      'Credit and financial assessment',
      'Property appraisal and verification',
      'Approval and loan agreement signing',
      'Fund disbursement',
    ],
  },
  {
    id: 'product-takeout',
    title: 'REAL ESTATE TAKE-OUT',
    description:
      'Switch your housing loan to us. Allow us to reassess your asset’s current value to get additional funding for your business needs.',
    image: takeoutProduct,
    ctaLabel: 'Get Refinance Quote',
    reverse: true,
    processBg: 'bg-white',
    who: [
      'Loan approval in 1 – 2 weeks',
      'Maximum approval up to 70% of the appraisal value',
      '0.9% interest rate ',
      'Up to 60 months loan term ',
    ],
    requirements: [
     'Copy of title (TCT / CCT)',
      'Latest copy of Tax Declaration, Real Estate Tax Receipt, and Tax Clearance (Land and Building) ',
      'Vicinity map',
      'Latest copy of SOA from bank or financing',
      'Application Form',
      'Source of Income',
    ],
    steps: [
      'Submit application and initial documents',
      'Credit and financial assessment',
      'Property appraisal and verification',
      'Approval and loan agreement signing',
      'Fund disbursement'
    ],
  },
  {
    id: 'product-acquisition',
    title: 'REAL ESTATE ACQUISITION LOAN',
    description:
      'Move in to your dream property. Whether it’s for residential or commercial use, turn that wish into reality as we help you get the keys that will jumpstart your personal or entrepreneurial life.',
    image: acquisitionProduct,
    ctaLabel: 'Explore Acquisition Financing',
    reverse: false,
    processBg: 'bg-gray-50',
    who: [
      'Loan pre-approval in 1 – 2 Days',
      'Maximum approval up to 80% of the appraisal value',
      '0.9% interest rate',
      'Up to 84 months loan term',
    ],
    requirements: [
      'Copy of title (TCT / CCT) ',
      'Latest copy of Tax Declaration, Real Estate Tax Receipt, and Tax Clearance (Land and Building)',
      'Two valid IDs of borrower and co-borrower',
      ' Source of Income',
    ],
    steps: [
      'Submit application and initial documents',
      'Pre-approval given based on preliminary assessment',
      'Credit and financial assessment',
      'Property appraisal and verification',
      'Approval and loan agreement signing',
      'Fund disbursement',
    ],
  },
]

export default function Products() {
  return (
    <div>
      <section className="py-16 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-gray-300">Real estate loans for your business financing needs</p>
        </div>
      </section>

      {productSections.map((product) => (
        <section key={product.id} id={product.id} className="group relative py-16 scroll-mt-24 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-20 transition-transform duration-700 group-hover:scale-[1.14]"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="absolute inset-0 bg-white/85 transition-colors duration-500 group-hover:bg-white/80" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm p-6 md:p-8 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-0.5">
              <div className={`${product.reverse ? 'order-2 md:order-1' : ''}`}>
                <h2 className="text-3xl font-bold text-navy mb-4">{product.title}</h2>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="mb-8">
                  <h3 className="font-bold text-navy mb-4"> </h3>
                  <ul className="space-y-2 text-gray-700">
                    {product.who.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-navy mb-4">Basic Requirements</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {product.requirements.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/#inquiry-form"
                  className="inline-flex items-center justify-center gap-3 bg-red-600 text-white font-semibold px-7 py-3 rounded-2xl transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25"
                >
                  {product.ctaLabel}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>

              <div className={`${product.reverse ? 'order-1 md:order-2' : ''}`}>
                <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-[#1a1f4e]/10 aspect-[4/3] lg:aspect-[16/10]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            <div className={`mt-12 p-8 rounded-2xl border border-[#1a1f4e]/10 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 ${product.processBg}`}>
              <h3 className="font-bold text-navy mb-4">Process Steps</h3>
              <ol className="space-y-3 text-gray-700">
                {product.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
