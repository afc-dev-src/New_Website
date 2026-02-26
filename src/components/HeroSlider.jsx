import { useState, useEffect } from 'react'
import remImage from '../Images/1.png'
import takeoutImage from '../Images/2.png'
import acquisitionImage from '../Images/3.png'

const slides = [
  {
    id: 1,
    eyebrow: 'Built on Your Asset',
    title: 'Real Estate Mortgage',
    subtitle: 'Secure practical financing built for property buyers and growing SMEs.',
    description: 'Flexible terms and faster evaluations for residential and commercial financing.',
    inquireHref: '/#inquiry-form',
    learnMoreHref: '/products#product-mortgage',
    image: remImage,
  },
  {
    id: 2,
    eyebrow: 'Refinance with Clarity',
    title: 'Real Estate Takeout',
    subtitle: 'Move your existing loan into a structure that better fits your current needs.',
    description: 'Clear repayment terms and practical options to improve monthly cash flow.',
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full max-w-[1920px] mx-auto h-[52vh] sm:h-[58vh] md:h-[64vh] lg:h-[70vh] xl:h-[74vh] min-h-[320px] sm:min-h-[380px] md:min-h-[460px] max-h-[880px] overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-w-full h-full">
            <img
              src={slide.image}
              alt={`Hero slide ${slide.id}`}
              className="w-full h-full object-cover object-center"
              loading={slide.id === 1 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
