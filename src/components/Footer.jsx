import { Link } from 'react-router-dom'
import mainLogo from '../Images/logo.png'
import { CONTACT_INFO, REGULATORY_INFO } from '../constants'

export default function Footer() {
  return (
    <footer className="bg-[#1a1f4e] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src={mainLogo} alt="AFC SME Finance" loading="lazy" className="logo-pulse-on-check h-18 w-auto object-contain" />
            </Link>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              SEC-registered. Focused on practical lending solutions for SMEs and property buyers.
            </p>
            <p className="text-white/40 text-xs mt-4 italic">
              SEC Registration No. {REGULATORY_INFO.SEC_REGISTRATION_NO} | Certificate of Authority No. {REGULATORY_INFO.CERTIFICATE_OF_AUTHORITY_NO}
            </p>
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
              <li>{CONTACT_INFO.OFFICE_ADDRESS}</li>
              <li>{CONTACT_INFO.PHONE}</li>
              <li>{CONTACT_INFO.EMAIL}</li>
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
          <div className="mt-3">
            <Link
              to="/admin"
              className="inline-block text-xs border border-white/30 text-white/80 hover:text-white hover:border-white/60 px-3 py-1.5 rounded"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
