import { Link } from 'react-router-dom'
import { homeProductExplorer } from '../data/products'

export default function ProductExplorer() {
  return (
    <section className="relative section-fade-in pb-12 md:pb-16 -mt-10 md:-mt-16 z-20" data-reveal>
      <div className="h-36 md:h-44 w-full bg-[#f5f7ff]" />
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-24 md:-mt-28">
        <div className="rounded-2xl md:rounded-3xl bg-[#eef1f7] shadow-sm border border-[#d7dcea] px-5 md:px-10 py-7 md:py-10">
          <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
            <p className="text-[#8c93a8] text-sm font-semibold tracking-wider uppercase mb-3">Our Services</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0d2a7a]">Fast, Secure and Personalized Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {homeProductExplorer.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl min-h-[300px] md:min-h-[350px] border border-white/30 shadow-sm"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${product.sectionBgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a7a]/90 via-[#0d2a7a]/40 to-white/25" />
                <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-white/85 backdrop-blur-sm border border-white/70 flex items-center justify-center">
                  <img
                    src={product.thumbImage}
                    alt={`${product.title} logo`}
                    loading="lazy"
                    className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">{product.title}</h3>
                  <div className="mt-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300">
                    <ul className="space-y-1 text-sm text-white/95 mb-4">
                      {product.whatFor.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to={product.href}
                    className="inline-flex items-center justify-center rounded-lg bg-white/25 hover:bg-white/35 text-white font-semibold px-5 py-2.5 backdrop-blur-sm transition-colors"
                  >
                    Explore Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
