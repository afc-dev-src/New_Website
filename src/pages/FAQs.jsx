import { useState } from 'react'
import { blogEntries } from '../data/blogs'

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
  {
    id: 9,
    question: 'How do I add blog links with images to this page?',
    answer:
      'Update src/data/blogs.js and add the title, link, and image for each item. The homepage and FAQ cards both read from that file, so one update keeps both sections in sync.',
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

function BlogCard({ blog }) {
  const isEmbed = Boolean(blog.embedUrl)
  const previewHeight = isEmbed ? Math.min(blog.embedHeight || 520, 430) : null

  return (
    <article className={`mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-[#dbe3ff] bg-white shadow-[0_18px_40px_rgba(26,31,78,0.10)] ${isEmbed ? 'max-w-[360px]' : ''}`}>
      {blog.embedUrl ? (
        <div className="bg-white p-3">
          <div className="mx-auto overflow-hidden rounded-2xl border border-[#e2e8f0]">
            <iframe
              src={blog.embedUrl}
              width="100%"
              height={previewHeight}
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={blog.title}
            />
          </div>
        </div>
      ) : blog.image ? (
        <img
          src={blog.image}
          alt={blog.imageAlt || `${blog.title} cover`}
          className="h-48 w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-[linear-gradient(135deg,#1a1f4e_0%,#304a9b_100%)] px-6 text-center text-white/80">
          Add an image in src/data/blogs.js to show a blog preview here.
        </div>
      )}

      <div className={`flex flex-1 flex-col gap-4 ${isEmbed ? 'p-5 pt-2' : 'p-5'}`}>
        <h3 className="text-lg font-semibold leading-snug text-[#1a1f4e]">
          {blog.title}
        </h3>
        <a
          href={blog.href}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-2 rounded-xl bg-[#1a1f4e] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#11183d]"
        >
          Open article
          <span aria-hidden="true">+</span>
        </a>
      </div>
    </article>
  )
}

export default function FAQs() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 md:py-16 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(130deg,#0d143d_0%,#1a1f4e_45%,#304a9b_100%)]" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/85">Find answers to common questions about our loans and services</p>
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

      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-600">Blog Updates</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1a1f4e]">Articles, announcements, and Facebook posts</h2>
            <p className="mt-3 text-base leading-relaxed text-[#475569]">
              Add blog links in src/data/blogs.js with a title, destination link, and preview image. The homepage and FAQ blog cards will update together automatically.
            </p>
          </div>

          {blogEntries.length > 0 ? (
            <div className="mt-8 grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogEntries.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1a1f4e]">No blog links added yet</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
                When you are ready, open src/data/blogs.js and add a new item with a title, href, and image. Once you save the file, the blog card will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
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
