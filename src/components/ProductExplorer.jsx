import { Link } from 'react-router-dom'
import { homeProductExplorer } from '../data/products'
import processApplyImage from '../Images/Apply.svg'
import processSubmitImage from '../Images/Submit.svg'
import processEvaluateImage from '../Images/Evaluation.svg'
import processReleaseImage from '../Images/Release.svg'

const PROCESS_TILES = [
  {
    id: 'apply',
    label: 'Apply',
    image: processApplyImage,
  },
  {
    id: 'submit',
    label: 'Submit Requirements',
    image: processSubmitImage,
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    image: processEvaluateImage,
  },
  {
    id: 'release',
    label: 'Release',
    image: processReleaseImage,
  },
]

export default function ProductExplorer({ middleContent = null }) {
  return (
    <div>
      <section className="bg-[#f8fafc] py-4 md:py-5">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-2">
            <p className="text-[#8c93a8] text-xs md:text-sm font-semibold tracking-wider uppercase">How it works</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {PROCESS_TILES.map((tile) => (
              <div
                key={tile.id}
                className="group min-h-[96px] md:min-h-[128px] lg:min-h-[144px] px-1 py-1 text-center rounded-xl border border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-[#dbe3ff] hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.10)]"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="mx-auto h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain transition-transform duration-200 group-hover:scale-105"
                />
                <p className="mt-1 text-xs md:text-sm font-bold text-[#1a1f4e] leading-tight">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-fade-in py-10 md:py-12 bg-white" data-reveal>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-7 md:mb-8">
            <p className="text-[#8c93a8] text-xs md:text-sm font-semibold tracking-wider uppercase mb-2">Our Services</p>
            <h2 className="text-xl md:text-3xl font-bold text-[#0d2a7a]">Fast, Secure and Personalized Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {homeProductExplorer.map((service) => (
              <article
                key={service.id}
                className="group h-full overflow-hidden rounded-2xl border border-[#dbe3ff] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition-all duration-250 hover:-translate-y-1 hover:border-[#c9d6ff] hover:shadow-[0_16px_30px_rgba(15,23,42,0.14)]"
              >
                <div className="h-36 overflow-hidden border-b border-[#e5e7eb]">
                  <img
                    src={service.sectionBgImage}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="px-4 py-4 md:px-5 md:py-5">
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <h3 className="text-base md:text-lg font-bold text-[#0d2a7a] leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed mb-3">{service.description}</p>
                  <ul className="space-y-1 text-xs text-[#475569] mb-4 min-h-[48px]">
                    {service.whatFor.slice(0, 2).map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                  <Link
                    to={service.href}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1a1f4e] text-white text-xs md:text-sm font-semibold px-4 py-2 transition-colors duration-200 hover:bg-[#243278]"
                  >
                    Click to Learn More
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {middleContent}
    </div>
  )
}
