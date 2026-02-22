import { Link } from 'react-router-dom'
import { homeProductExplorer } from '../data/products'

export default function ProductExplorer() {
  return (
    <section className="section-fade-in section-surface py-20 md:py-24" data-reveal>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10 md:mb-12">
          <p className="text-red-600 text-sm font-semibold tracking-wider uppercase mb-3">Explore Products</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e]">Find the Financing Path for Your Goal</h2>
          <p className="text-[#1a1f4e]/70 mt-4 leading-relaxed">
            Browse each product and reveal quick requirement highlights before you proceed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {homeProductExplorer.map((product) => (
            <article
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/85 backdrop-blur-sm shadow-sm"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(26,31,78,0.25), rgba(26,31,78,0.88)), url(${product.sectionBgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />

              <div className="relative p-7 min-h-[300px] flex flex-col">
                <img
                  src={product.thumbImage}
                  alt={`${product.title} icon`}
                  className="w-20 h-20 object-contain mb-5 transition-transform duration-300 group-hover:scale-105 group-focus-within:scale-105"
                />
                <h3 className="text-xl font-bold text-[#1a1f4e] group-hover:text-white group-focus-within:text-white transition-colors">
                  {product.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1a1f4e]/75 group-hover:text-white/85 group-focus-within:text-white/85 transition-colors">
                  {product.description}
                </p>

                <div className="mt-auto pt-5">
                  <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300">
                    <p className="text-xs uppercase tracking-wider font-semibold text-red-300 mb-2">Mini Requirements</p>
                    <ul className="space-y-1 text-sm text-white/90 mb-4">
                      {product.hoverDetails.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={product.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 group-hover:text-white group-focus-within:text-white transition-colors"
                  >
                    Explore Product
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
