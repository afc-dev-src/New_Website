import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import remImage from '../Images/1.png'
import takeoutImage from '../Images/2.png'
import acquisitionImage from '../Images/3.png'

const slides = [
  {
    id: 1,
    title: 'SANGLA TITULO',
    learnMoreHref: '/products#product-mortgage',
    image: remImage,
  },
  {
    id: 2,
    title: 'Real Estate Takeout',
    learnMoreHref: '/products#product-takeout',
    image: takeoutImage,
  },
  {
    id: 3,
    title: 'Acquisition Loan',
    learnMoreHref: '/products#product-acquisition',
    image: acquisitionImage,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const autoSlideDelay = 5000

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
    if (e.targetTouches?.length > 0) {
      setTouchStart(e.targetTouches[0].clientX)
    }
  }

  const handleTouchEnd = (e) => {
    if (!touchStart || !e.changedTouches?.length) return
    const distance = touchStart - e.changedTouches[0].clientX
    if (distance > 50) nextSlide()
    if (distance < -50) prevSlide()
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, autoSlideDelay)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="w-full max-w-[1920px] mx-auto">
      <div
        className="relative w-full h-[80vh] md:h-[85vh] lg:h-[75vh] min-h-[420px] md:min-h-[520px] max-h-[720px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <Link
              key={slide.id}
              to={slide.learnMoreHref}
              className="block min-w-full h-full"
              aria-label={`View ${slide.title}`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                style={{ transform: 'scale(1.00)' }}
                loading={slide.id === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </Link>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-3 py-8">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={idx === current ? 'h-2.5 w-8 rounded-full bg-gray-800' : 'h-2.5 w-2.5 rounded-full bg-gray-400'}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
