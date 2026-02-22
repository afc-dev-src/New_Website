import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import remImage from '../Images/RENm.jpg'
import takeoutImage from '../Images/takeout.jpg'
import acquisitionImage from '../Images/acqui.jpg'

const slides = [
  {
    id: 1,
    eyebrow: 'AFC SME Finance',
    title: 'Real Estate Mortgage',
    subtitle: 'Secure practical financing built for property buyers and growing SMEs.',
    description: 'Flexible terms and faster evaluations for residential and commercial financing.',
    inquireHref: '/#inquiry-form',
    learnMoreHref: '/products#product-mortgage',
    image: remImage,
  },
  {
    id: 2,
    eyebrow: 'Tailored Refinance',
    title: 'Real Estate Takeout',
    subtitle: 'Move your existing loan to better terms with a clearer repayment plan.',
    description: 'Switch to a financing structure that protects cash flow and supports expansion.',
    inquireHref: '/#inquiry-form',
    learnMoreHref: '/products#product-takeout',
    image: takeoutImage,
  },
  {
    id: 3,
    eyebrow: 'Growth Capital',
    title: 'Acquisition Loan',
    subtitle: 'Acquire strategic assets and properties with the right lending partner.',
    description: 'Structured funding for SME owners planning expansion and long-term growth.',
    inquireHref: '/#inquiry-form',
    learnMoreHref: '/products#product-acquisition',
    image: acquisitionImage,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const containerRef = useRef(null)

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const goToSlide = (index) => {
    setCurrent(index)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    const distance = touchStart - e.changedTouches[0].clientX
    if (distance > 50) nextSlide()
    if (distance < -50) prevSlide()
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="relative min-w-full h-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f4e]/95 via-[#1a1f4e]/80 to-transparent" />

            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl">
                  <p className="inline-block text-red-400 text-sm font-semibold tracking-wider uppercase mb-4">
                    {s.eyebrow}
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                    {s.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 mb-4 leading-relaxed">{s.subtitle}</p>
                  <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                    {s.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={s.inquireHref}
                      className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-center"
                    >
                      Inquire Now
                    </Link>
                    <Link
                      to={s.learnMoreHref}
                      className="border border-white/40 text-white hover:bg-white hover:text-[#1a1f4e] hover:border-white font-semibold text-base px-8 py-4 rounded-xl w-full sm:w-auto hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
