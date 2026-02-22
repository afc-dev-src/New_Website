import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Properties from './pages/Properties'
import Calculator from './pages/Calculator'
import Disclosures from './pages/Disclosures'
import About from './pages/About'
import FinancialStatement from './pages/FinancialStatement'
import FAQs from './pages/FAQs'
import ApplicationForm from './pages/ApplicationForm'
import Contact from './pages/Contact'
import BranchLocator from './pages/BranchLocator'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top on route change, or to hash if present
    const hash = location.hash
    if (hash) {
      // Delay slightly to allow DOM to render
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo(0, 0)
        }
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollManager />
      <ErrorBoundary>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/financial-statement" element={<FinancialStatement />} />
            <Route path="/products" element={<Products />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/disclosures" element={<Disclosures />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/application-form" element={<ApplicationForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/branches" element={<BranchLocator />} />
          </Routes>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
