import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import mainLogo from '../Images/main logo.png'

const companyItems = [
  { label: 'About', href: '/about' },
  { label: 'Financial Statement', href: '/financial-statement' },
]

const productItems = [
  { label: 'Real Estate Mortgage', href: '/products#product-mortgage' },
  { label: 'Real Estate Takeout', href: '/products#product-takeout' },
  { label: 'Acquisition Loan', href: '/products#product-acquisition' },
]

const resourceItems = [
  { label: 'Loan Calculator', href: '/calculator' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Forms', href: '/application-form' },
]

const propertyItems = [
  { label: 'Browse Properties', href: '/properties' },
  { label: 'Available Properties', href: '/properties' },
]

function Chevron({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function DesktopDropdown({ label, items, active }) {
  const [open, setOpen] = useState(false)
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      setOpen(true)
    }, 140)
  }

  const handleMouseLeave = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, 220)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          if (openTimerRef.current) clearTimeout(openTimerRef.current)
          if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
          setOpen((prev) => !prev)
        }}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
          active ? 'text-red-600 bg-red-50' : 'text-[#1a1f4e] hover:text-red-600'
        }`}
        type="button"
      >
        {label}
        <Chevron open={open} />
      </button>

      <div
        className={`absolute left-0 top-full mt-2 min-w-[220px] bg-white rounded-xl shadow-lg p-2 transition-all duration-300 z-50 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        {items.map((item) => (
          <Link
            key={`${label}-${item.href}-${item.label}`}
            to={item.href}
            className="block px-3 py-2 rounded-lg text-sm text-[#1a1f4e] hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function MobileSection({ title, items, onNavigate }) {
  return (
    <details className="group">
      <summary className="list-none cursor-pointer select-none py-2 text-sm font-medium text-[#1a1f4e] flex items-center justify-between">
        {title}
        <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="pb-2 pl-3 space-y-1">
        {items.map((item) => (
          <Link
            key={`${title}-${item.href}-${item.label}`}
            to={item.href}
            onClick={onNavigate}
            className="block py-1.5 text-sm text-gray-600 hover:text-red-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  )
}

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    setMobileMenuOpen(false)
    setHeaderVisible(true)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY

      if (mobileMenuOpen) {
        setHeaderVisible(true)
        lastScrollYRef.current = currentY
        return
      }

      if (currentY <= 10) {
        setHeaderVisible(true)
      } else if (currentY > lastScrollYRef.current && currentY > 90) {
        setHeaderVisible(false)
      } else if (currentY < lastScrollYRef.current) {
        setHeaderVisible(true)
      }

      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileMenuOpen])

  const isHome = location.pathname === '/'
  const isCompany = location.pathname === '/about' || location.pathname === '/financial-statement'
  const isProducts = location.pathname === '/products'
  const isResources = ['/calculator', '/faqs', '/application-form'].includes(location.pathname)
  const isProperties = location.pathname === '/properties'
  const isContact = location.pathname === '/contact'

  return (
    <header
      className={`sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm transition-[transform,background-color,box-shadow] duration-300 ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {!mobileMenuOpen && (
        <div className="hidden lg:block bg-[#1a1f4e] text-white/80">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="mailto:info@afcfinance.com" className="hover:text-white transition-colors">
                customersupport@afcsme.com.ph
              </a>
              <a href="tel:+6309000000000" className="hover:text-white transition-colors">
                +63 (9) 178215815
              </a>
            </div>
            <p className="text-white/70">SEC Registered</p>
          </div>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0">
          <img src={mainLogo} alt="AFC SME Finance" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        <div className="hidden lg:flex items-center justify-between flex-1 gap-4 min-w-0">
          <div className="flex items-center gap-1 px-2 py-1.5">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isHome ? 'text-red-600 bg-red-50' : 'text-[#1a1f4e] hover:text-red-600'
              }`}
            >
              Home
            </Link>

            <DesktopDropdown label="Company" items={companyItems} active={isCompany} />
            <DesktopDropdown label="Products" items={productItems} active={isProducts} />
            <DesktopDropdown label="Resources" items={resourceItems} active={isResources} />
            <DesktopDropdown label="Properties" items={propertyItems} active={isProperties} />

            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isContact ? 'text-red-600 bg-red-50' : 'text-[#1a1f4e] hover:text-red-600'
              }`}
            >
              Contact Us
            </Link>
          </div>

          <Link
            to="/application-form"
            className="hidden xl:inline-flex items-center justify-center whitespace-nowrap bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-sm"
          >
            Apply / Inquire Now
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 text-[#1a1f4e]"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="relative block w-6 h-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                mobileMenuOpen ? 'top-2 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-6 bg-current rounded transition-all duration-300 ${
                mobileMenuOpen ? 'top-2 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`lg:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4">
          <Link to="/" className={`block py-2 text-sm font-medium ${isHome ? 'text-red-600' : 'text-[#1a1f4e]'}`}>
            Home
          </Link>
          <MobileSection title="Company" items={companyItems} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileSection title="Products" items={productItems} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileSection title="Resources" items={resourceItems} onNavigate={() => setMobileMenuOpen(false)} />
          <MobileSection title="Properties" items={propertyItems} onNavigate={() => setMobileMenuOpen(false)} />
          <Link to="/contact" className={`block py-2 text-sm font-medium ${isContact ? 'text-red-600' : 'text-[#1a1f4e]'}`}>
            Contact Us
          </Link>
          <Link
            to="/application-form"
            className="mt-4 inline-block w-full text-center whitespace-nowrap bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            Apply / Inquire Now
          </Link>
        </div>
      </div>
    </header>
  )
}
