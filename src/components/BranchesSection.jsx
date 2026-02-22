import { useMemo, useState } from 'react'
import { branches } from '../data/branches'

export default function BranchesSection({ compact = false, sectionId = 'branches' }) {
  if (!branches || branches.length === 0) {
    return null
  }

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id)

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) || branches[0],
    [selectedBranchId]
  )

  return (
    <section id={sectionId} className="section-fade-in py-16 md:py-20 bg-[#f5f7ff]" data-reveal>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-red-600 text-sm font-semibold tracking-wider uppercase mb-3">Our Branches</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e]">Connect With the Nearest Team</h2>
          <p className="text-[#1a1f4e]/70 mt-4">Ortigas is the official Head Office of AFC SME Finance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {branches.map((branch) => {
            const isSelected = branch.id === selectedBranch?.id

            return (
              <article
                key={branch.id}
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                  isSelected ? 'border-[#1a1f4e]/40 bg-white shadow-md' : 'border-white/40 bg-white/80 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a1f4e]">{branch.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs uppercase tracking-wider text-red-600 font-semibold">{branch.pinLabel}</p>
                      {branch.isHeadOffice && (
                        <span className="text-[11px] font-bold uppercase bg-[#1a1f4e] text-white px-2 py-0.5 rounded-full">
                          Head Office
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      isSelected
                        ? 'bg-[#1a1f4e] text-white border-[#1a1f4e]'
                        : 'text-[#1a1f4e] border-[#1a1f4e]/20 hover:border-[#1a1f4e]/40'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'View Map'}
                  </button>
                </div>

                <ul className="space-y-3 text-sm text-[#1a1f4e]/80">
                  <li>
                    <span className="font-semibold text-[#1a1f4e]">Pin:</span> {branch.address}
                  </li>
                  {branch.telephone && (
                    <li>
                      <span className="font-semibold text-[#1a1f4e]">Telephone:</span> {branch.telephone}
                    </li>
                  )}
                  {branch.mobile && (
                    <li>
                      <span className="font-semibold text-[#1a1f4e]">Phone:</span> {branch.mobile}
                    </li>
                  )}
                  <li>
                    <span className="font-semibold text-[#1a1f4e]">Email:</span>{' '}
                    <a href={`mailto:${branch.email}`} className="text-red-600 hover:text-red-700">
                      {branch.email}
                    </a>
                  </li>
                </ul>

                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Open in Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5h5v5M10 14L19 5M5 19h14" />
                  </svg>
                </a>
              </article>
            )
          })}
        </div>

        {!compact && selectedBranch && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/40 shadow-sm bg-white">
            <iframe
              title={`${selectedBranch.name} map`}
              src={selectedBranch.mapEmbedUrl}
              className="w-full h-80 md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  )
}
