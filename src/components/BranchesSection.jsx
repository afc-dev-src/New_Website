import { useMemo, useState } from 'react'
import { branches } from '../data/branches'

export default function BranchesSection({ compact = false, sectionId = 'branches' }) {
  if (!branches || branches.length === 0) {
    return null
  }

  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id)
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Branch')

  const filterOptions = ['Nearby', 'Branch']

  const filteredBranches = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    return branches.filter((branch) => {
      const matchesText =
        keyword.length === 0 ||
        branch.name.toLowerCase().includes(keyword) ||
        branch.address.toLowerCase().includes(keyword)

      const matchesType = selectedFilter === 'Branch' || selectedFilter === 'Nearby'
      return matchesText && matchesType
    })
  }, [searchText, selectedFilter])

  const selectedBranch = useMemo(
    () => filteredBranches.find((branch) => branch.id === selectedBranchId) || filteredBranches[0] || null,
    [selectedBranchId, filteredBranches]
  )

  return (
    <section id={sectionId} className="section-fade-in py-16 md:py-20 bg-[#f5f7ff]" data-reveal>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="inline-block h-[3px] w-10 bg-red-600 rounded-full mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f4e]">Locate us</h2>
          <p className="text-[#1a1f4e]/80 mt-4 leading-relaxed">
            All our regular branches are open from 9:00 AM to 4:30 PM. Check-clearing cut-off will be at 2:30 PM.
          </p>
          <p className="text-[#1a1f4e]/80 mt-4 leading-relaxed">
            Note that schedule of branches may change without prior notice due to unforeseen circumstances.
          </p>
        </div>

        <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <label className="relative w-full sm:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Select area"
                className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-[#1a1f4e] focus:outline-none focus:border-red-500"
              />
            </label>

            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFilter(option)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedFilter === option
                    ? 'bg-[#1a1f4e] text-white border-[#1a1f4e]'
                    : 'bg-white text-[#1a1f4e] border-gray-300 hover:border-[#1a1f4e]/60'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button type="button" className="self-start lg:self-auto text-sm text-red-600 font-semibold hover:text-red-700">
            Show more filters
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#d6dae8] bg-white">
          <div className="border-b border-[#d6dae8] px-4 py-2 text-sm text-[#1a1f4e]/70">
            {filteredBranches.length} results
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] min-h-[530px]">
            <div className="border-r border-[#d6dae8] max-h-[530px] overflow-y-auto">
              {filteredBranches.length === 0 && (
                <div className="p-5 text-sm text-[#1a1f4e]/70">No branches found for the selected filters.</div>
              )}

              {filteredBranches.map((branch) => {
                const isSelected = branch.id === selectedBranch?.id

                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`w-full text-left p-4 border-b border-[#edf0f7] transition-colors ${
                      isSelected ? 'bg-[#f7f9ff]' : 'bg-white hover:bg-[#fafbff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#1a1f4e]/60">{branch.pinLabel}</p>
                        <h3 className="text-lg font-bold text-[#1a1f4e] leading-tight">{branch.name}</h3>
                      </div>
                      <span className="mt-1 text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 016 6c0 4.02-6 10-6 10S4 12.02 4 8a6 6 0 016-6z" />
                        </svg>
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#1a1f4e]/75 leading-relaxed">{branch.address}</p>
                    <p className="mt-3 text-xs text-[#1a1f4e]/70">Monday - Friday</p>
                  </button>
                )
              })}
            </div>

            <div className="bg-[#f4f5f8]">
              {selectedBranch ? (
                <iframe
                  title={`${selectedBranch.name} map`}
                  src={selectedBranch.mapEmbedUrl}
                  className="w-full h-[530px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-[530px] flex items-center justify-center text-[#1a1f4e]/60 text-sm">
                  Select a branch to view map.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
