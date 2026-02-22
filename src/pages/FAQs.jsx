import { useState } from 'react'

const faqs = [
  {
    id: 1,
    question: 'What documents do I need to apply for a Real Estate Mortgage?',
    answer:
      'You typically need a valid ID, proof of income (payslips or BIR Form 1701), property documents, bank statements, and in some cases, a credit report. Our loan officers can provide a complete checklist during consultation.',
  },
  {
    id: 2,
    question: 'How long does the approval process take?',
    answer:
      'Most applications receive an initial approval decision within 2-3 business days. Full documentation review and final approval may take 5-7 business days, depending on document completeness.',
  },
  {
    id: 3,
    question: 'What is your current interest rate?',
    answer:
      'Interest rates vary based on loan type, term, and borrower profile. We offer competitive rates starting from 5.5% per annum. Contact us for a personalized quote.',
  },
  {
    id: 4,
    question: 'Can I prepay my loan without penalty?',
    answer:
      'Yes! We allow full or partial prepayment without penalty. This helps you save on interest and build equity faster.',
  },
  {
    id: 5,
    question: 'What is the maximum loan amount I can apply for?',
    answer:
      'Maximum loan amount depends on your income, credit score, and property value. We typically lend up to 80% of property value. Discuss your specific situation with our loan officers.',
  },
  {
    id: 6,
    question: 'Do you offer variable or fixed interest rates?',
    answer:
      'We offer both fixed and variable rate options. Fixed rates provide payment stability, while variable rates may start lower. We can help you choose the best option for your situation.',
  },
  {
    id: 7,
    question: 'What happens if I miss a payment?',
    answer:
      'We encourage timely payments to avoid penalties. A single missed payment may incur a late fee. Repeated defaults may affect your credit. Contact us immediately if you anticipate payment difficulties.',
  },
  {
    id: 8,
    question: 'Can I get a real estate takeout for my existing loan?',
    answer:
      'Yes! Takeout loans are designed to refinance existing mortgages at better rates or terms. Bring your current loan statement and we can provide a quote.',
  },
]

function FAQItem({ item }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-left hover:text-red-500 transition"
      >
        <h3 className="font-bold text-gray-800">{item.question}</h3>
        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQs() {
  return (
    <div>
      {/* Hero */}
      <section className="py-12 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">Find answers to common questions about our loans and services</p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-1">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} item={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Contact our support team anytime. We're here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
