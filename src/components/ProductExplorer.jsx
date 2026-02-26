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

export default function ProductExplorer() {
  return (
    <div>
      <section className="bg-[#f8fafc] py-10 md:py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {PROCESS_TILES.map((tile) => (
              <div
                key={tile.id}
                className="min-h-[150px] md:min-h-[200px] lg:min-h-[220px] px-2 py-2 text-center"
              >
                <img
                  src={tile.image}
                  alt={tile.label}
                  loading="lazy"
                  className="mx-auto h-14 w-14 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain"
                />
                <p className="mt-2 text-sm md:text-base font-bold text-[#1a1f4e] leading-tight">
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
            {homeProductExplorer.map((service, index) => (
                <article
                  key={service.id}
                  className="h-full overflow-hidden rounded-2xl border border-[#dbe3ff] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
                >
                  <div className="h-36 overflow-hidden border-b border-[#e5e7eb]">
                    <img
                      src={service.sectionBgImage}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
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
                    <span className="inline-flex items-center justify-center rounded-lg bg-[#1a1f4e] text-white text-xs md:text-sm font-semibold px-4 py-2">
                      Start Application
                    </span>
                  </div>
                </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
