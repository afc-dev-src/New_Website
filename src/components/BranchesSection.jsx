import { useEffect, useMemo, useState } from 'react'
import { branches } from '../data/branches'

const filterOptions = [
  { id: 'all', label: 'All Offices' },
  { id: 'head-office', label: 'Head Office' },
  { id: 'branch-office', label: 'Branch Offices' },
]

const scheduleHighlights = [
  { label: 'Regular Hours', value: '9:00 AM - 4:30 PM' },
  { label: 'Check-Clearing', value: '2:30 PM cut-off' },
  { label: 'Availability', value: 'Subject to branch advisories' },
]

function SearchIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function MapPinIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
      />
      <circle cx="12" cy="11" r="2.5" strokeWidth={2} />
    </svg>
  )
}

function ClockIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PhoneIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5.5A2.5 2.5 0 015.5 3h2A2.5 2.5 0 0110 5.1l.33 2.31a2.5 2.5 0 01-.72 2.12l-1.2 1.2a16 16 0 006.39 6.39l1.2-1.2a2.5 2.5 0 012.12-.72L18.9 14A2.5 2.5 0 0121 16.5v2A2.5 2.5 0 0118.5 21h-.75C9.6 21 3 14.4 3 6.25V5.5z"
      />
    </svg>
  )
}

function sanitizePhoneNumber(value) {
  return (value || '').replace(/[^\d+]/g, '')
}

function getBranchPhoneDetails(branch) {
  const phoneDetails = []

  if (branch.telephone) {
    phoneDetails.push({ label: 'Telephone', value: branch.telephone })
  }

  if (branch.mobile) {
    phoneDetails.push({ label: 'Mobile', value: branch.mobile })
  }

  return phoneDetails
}

export default function BranchesSection({ compact = false, sectionId = 'branches' }) {
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id ?? null)
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filteredBranches = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    return branches.filter((branch) => {
      const matchesText =
        keyword.length === 0 ||
        branch.name.toLowerCase().includes(keyword) ||
        branch.address.toLowerCase().includes(keyword)

      const matchesType =
        selectedFilter === 'all' ||
        (selectedFilter === 'head-office' && branch.isHeadOffice) ||
        (selectedFilter === 'branch-office' && !branch.isHeadOffice)

      return matchesText && matchesType
    })
  }, [searchText, selectedFilter])

  useEffect(() => {
    if (!filteredBranches.some((branch) => branch.id === selectedBranchId)) {
      setSelectedBranchId(filteredBranches[0]?.id ?? null)
    }
  }, [filteredBranches, selectedBranchId])

  const selectedBranch = useMemo(
    () => filteredBranches.find((branch) => branch.id === selectedBranchId) || null,
    [filteredBranches, selectedBranchId]
  )

  if (!branches || branches.length === 0) {
    return null
  }

  const sectionPadding = compact ? 'py-9 md:py-10' : 'py-10 md:py-12'
  const branchCountLabel = `${filteredBranches.length} office${filteredBranches.length === 1 ? '' : 's'}`
  const headOfficeCount = branches.filter((branch) => branch.isHeadOffice).length
  const branchOfficeCount = branches.filter((branch) => !branch.isHeadOffice).length
  const branchPhoneDetails = selectedBranch ? getBranchPhoneDetails(selectedBranch) : []
  const branchContactNumber = branchPhoneDetails[0]?.value || ''
  const branchCallHref = branchContactNumber ? `tel:${sanitizePhoneNumber(branchContactNumber)}` : null
  const selectedFilterLabel = filterOptions.find((option) => option.id === selectedFilter)?.label

  return (
    <section id={sectionId} className={`section-fade-in bg-[#f7f9ff] ${sectionPadding}`} data-reveal>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="rounded-[24px] border border-[#dbe3ff] bg-white p-4 md:p-5 shadow-[0_18px_40px_rgba(26,31,78,0.08)]">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
            <div>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-red-600">Branch Summary</p>
              <h2 className="mt-2 text-xl md:text-2xl font-bold text-[#1a1f4e]">
                {branchCountLabel} available across our network
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#1a1f4e]/72">
                Browse offices, review contact details, and open directions quickly using the locator below.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]">
                  Showing: {selectedFilterLabel}
                </span>
                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600">
                  {branchCountLabel}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="relative block">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search by branch, city, or address"
                  className="w-full rounded-xl border border-[#d6deef] bg-white py-3 pl-12 pr-4 text-sm text-[#1a1f4e] shadow-sm outline-none transition-colors focus:border-red-400"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedFilter(option.id)}
                    className={`rounded-full px-3.5 py-2 text-xs md:text-sm font-semibold transition-all duration-200 ${
                      selectedFilter === option.id
                        ? 'bg-[#1a1f4e] text-white shadow-[0_10px_24px_rgba(26,31,78,0.16)]'
                        : 'border border-[#d4dcf1] bg-white text-[#1a1f4e]/75 hover:border-[#1a1f4e]/28'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[18px] border border-[#e4e9fb] bg-[#f9fbff] px-4 py-4 md:min-h-[104px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/55">Available Offices</p>
              <p className="mt-2 text-lg font-bold text-[#1a1f4e]">{branchCountLabel}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#1a1f4e]/60">Browse every office currently matched by your search and filter.</p>
            </div>
            <div className="rounded-[18px] border border-[#e4e9fb] bg-[#f9fbff] px-4 py-4 md:min-h-[104px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/55">Head Office</p>
              <p className="mt-2 text-lg font-bold text-[#1a1f4e]">{headOfficeCount}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#1a1f4e]/60">Main support hub for central coordination and servicing.</p>
            </div>
            <div className="rounded-[18px] border border-[#e4e9fb] bg-[#f9fbff] px-4 py-4 md:min-h-[104px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/55">Branch Offices</p>
              <p className="mt-2 text-lg font-bold text-[#1a1f4e]">{branchOfficeCount}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#1a1f4e]/60">Regional offices available for nearby inquiries and visits.</p>
            </div>
            <div className="rounded-[18px] border border-[#e4e9fb] bg-[#f9fbff] px-4 py-4 md:min-h-[104px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/55">Service Window</p>
              <p className="mt-2 text-lg font-bold text-[#1a1f4e]">9:00 AM - 4:30 PM</p>
              <p className="mt-1 text-xs leading-relaxed text-[#1a1f4e]/60">Standard office hours for branch assistance and walk-in visits.</p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {scheduleHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-[#e4e9fb] bg-[linear-gradient(180deg,#f9fbff_0%,#f2f6ff_100%)] px-4 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/55">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#1a1f4e]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[18px] border border-[#e4e9fb] bg-[#f9fbff] px-4 py-3 text-sm leading-relaxed text-[#1a1f4e]/68">
            For a smoother visit, we recommend calling the selected branch first to confirm availability, support hours,
            and any branch-specific advisory before traveling.
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-[22px] border border-[#dbe3ff] bg-white p-2.5 shadow-[0_16px_34px_rgba(26,31,78,0.08)] xl:h-full">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-[#edf1fb] px-2 pb-2.5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/45">Office</p>
                  <p className="mt-1 text-base font-bold text-[#1a1f4e]">{branchCountLabel}</p>
                </div>
                <span className="rounded-full bg-[#f2f6ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]/70">
                  {selectedFilterLabel}
                </span>
              </div>

              <div className="mt-2.5 flex-1 space-y-2 overflow-y-auto pr-1 max-h-[620px] xl:max-h-[760px]">
              {filteredBranches.length === 0 && (
                <div className="rounded-[18px] border border-dashed border-[#d6deef] bg-[#f8faff] px-4 py-8 text-center text-sm text-[#1a1f4e]/65">
                  No branches found for your search. Try a different city or reset the office filter.
                </div>
              )}

              {filteredBranches.map((branch) => {
                const isSelected = branch.id === selectedBranch?.id
                const branchPhones = getBranchPhoneDetails(branch)

                return (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`w-full rounded-[18px] border p-3.5 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-[#1a1f4e]/12 bg-[linear-gradient(145deg,#f9fbff_0%,#eef3ff_100%)] shadow-[0_12px_24px_rgba(26,31,78,0.10)]'
                        : 'border-[#e7ebf7] bg-white hover:border-[#cfd9f2] hover:bg-[#fbfcff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600">
                          {branch.pinLabel}
                        </span>
                        <h3 className="mt-2 text-base font-bold text-[#1a1f4e]">{branch.name}</h3>
                      </div>
                      <div
                        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                          isSelected ? 'bg-[#1a1f4e] text-white' : 'bg-[#f4f7ff] text-red-500'
                        }`}
                      >
                        <MapPinIcon className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    <p className="mt-2 text-[11px] leading-relaxed text-[#1a1f4e]/72">{branch.address}</p>
                    <div className="mt-2.5 space-y-1">
                      <div className="inline-flex items-center gap-2 text-[11px] font-medium text-[#1a1f4e]/60">
                        <ClockIcon className="h-4 w-4 text-[#1a1f4e]/45" />
                        Monday to Friday
                      </div>
                      <div className="inline-flex items-center gap-2 text-[11px] font-medium text-[#1a1f4e]/60">
                        <PhoneIcon className="h-4 w-4 text-[#1a1f4e]/45" />
                        {branchPhones.length > 0
                          ? branchPhones.map((item) => `${item.label}: ${item.value}`).join(' | ')
                          : 'Phone details available via email request'}
                      </div>
                    </div>
                  </button>
                )
              })}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[22px] border border-[#dbe3ff] bg-white p-4 md:p-5 shadow-[0_16px_34px_rgba(26,31,78,0.08)]">
              {selectedBranch ? (
                <>
                  <div className="grid gap-4 border-b border-[#edf1fb] pb-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/45">Details</p>
                      <h3 className="mt-2 text-xl md:text-2xl font-bold text-[#1a1f4e]">{selectedBranch.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#1a1f4e]/72">{selectedBranch.address}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[360px]">
                      <a
                        href={selectedBranch.directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-[#1a1f4e] px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(26,31,78,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        Get Directions
                      </a>
                      <a
                        href={`mailto:${selectedBranch.email}`}
                        className="inline-flex items-center justify-center rounded-xl border border-[#d7def1] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1a1f4e] transition-colors duration-200 hover:bg-[#f6f8ff]"
                      >
                        Email
                      </a>
                      {branchCallHref ? (
                        <a
                          href={branchCallHref}
                          className="inline-flex items-center justify-center rounded-xl border border-[#d7def1] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1a1f4e] transition-colors duration-200 hover:bg-[#f6f8ff]"
                        >
                          Call
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-xl border border-[#d7def1] bg-[#f8faff] px-3.5 py-2.5 text-sm font-semibold text-[#1a1f4e]/40">
                          Call
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="min-w-0 rounded-[16px] border border-[#e6ebf8] bg-[#f9fbff] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]/45">Office Type</p>
                      <p className="mt-1.5 text-sm font-semibold text-[#1a1f4e]">{selectedBranch.pinLabel}</p>
                    </div>
                    <div className="min-w-0 rounded-[16px] border border-[#e6ebf8] bg-[#f9fbff] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]/45">Available Phone</p>
                      <p className="mt-1.5 text-sm font-semibold text-[#1a1f4e] break-words">
                        {branchContactNumber || 'Available via email'}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-[16px] border border-[#e6ebf8] bg-[#f9fbff] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]/45">Email</p>
                      <p className="mt-1.5 text-sm font-semibold text-[#1a1f4e] break-all">{selectedBranch.email}</p>
                    </div>
                    <div className="min-w-0 rounded-[16px] border border-[#e6ebf8] bg-[#f9fbff] p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1f4e]/45">Visit Hours</p>
                      <p className="mt-1.5 text-sm font-semibold text-[#1a1f4e]">9:00 AM - 4:30 PM</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[16px] border border-[#e6ebf8] bg-[#f9fbff] px-3.5 py-3 text-xs leading-relaxed text-[#1a1f4e]/68">
                    {branchPhoneDetails.length > 0
                      ? `${branchPhoneDetails.map((item) => `${item.label}: ${item.value}`).join(' | ')}.`
                      : 'Phone details for this office are currently available through email coordination only.'}{' '}
                    Regular hours are 9:00 AM to 4:30 PM, with check-clearing cut-off at 2:30 PM.
                  </div>
                </>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-[18px] border border-dashed border-[#d6deef] bg-[#f8faff] text-sm text-[#1a1f4e]/65">
                  Select an office to view its details.
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#dbe3ff] bg-white shadow-[0_16px_34px_rgba(26,31,78,0.08)]">
              <div className="flex flex-col gap-2 border-b border-[#edf1fb] px-4 py-3.5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1f4e]/45">Maps</p>
                  <p className="mt-1 text-base font-bold text-[#1a1f4e]">
                    {selectedBranch ? `${selectedBranch.name} Location` : 'Select an office to load the map'}
                  </p>
                </div>
                {selectedBranch && (
                  <a
                    href={selectedBranch.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>

              {selectedBranch ? (
                <iframe
                  title={`${selectedBranch.name} map`}
                  src={selectedBranch.mapEmbedUrl}
                  className="h-[340px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex min-h-[340px] items-center justify-center bg-[#f8faff] text-sm text-[#1a1f4e]/65">
                  Select an office to view the map.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
