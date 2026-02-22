import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1a1f4e] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white font-bold text-lg">AFC SME Finance Inc.</h3>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              SEC-registered financing company focused on practical lending solutions for SMEs and property buyers.
            </p>
            <p className="text-white/40 text-xs mt-4 italic">Certificate of Authority to Operate</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/products#product-mortgage" className="hover:text-red-400 transition-colors">
                  Real Estate Mortgage
                </Link>
              </li>
              <li>
                <Link to="/products#product-takeout" className="hover:text-red-400 transition-colors">
                  Real Estate Takeout
                </Link>
              </li>
              <li>
                <Link to="/products#product-acquisition" className="hover:text-red-400 transition-colors">
                  Acquisition Loan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/calculator" className="hover:text-red-400 transition-colors">
                  Loan Calculator
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-red-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/disclosures" className="hover:text-red-400 transition-colors">
                  Disclosures
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-red-400 transition-colors">
                  Properties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Unit 309 3F AIC Gold Tower, Emerald Avenue cor. Garnet Road, Ortigas, Pasig City</li>
              <li>+63 (9) 178215815</li>
              <li>customersupport@afcsme.com.ph</li>
              <li className="pt-2">
                <Link to="/application-form" className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-sm text-white/50 text-center">
          <p>&copy; 2026 AFC SME Finance Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
