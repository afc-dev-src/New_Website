import BranchesSection from '../components/BranchesSection'
import branchLocatorHeroImage from '../Images/RENm3.jpg'

export default function BranchLocator() {
  return (
    <div>
      <section className="section-fade-in relative overflow-hidden py-14 md:py-20" data-reveal>
        <img
          src={branchLocatorHeroImage}
          alt="Branch locator hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#0f153d]/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-white">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold">Branches</h1>
            <p className="text-white/85 mt-4">
              Find the nearest AFC SME branch and get support quickly through our branch list and map locator.
            </p>
          </div>
        </div>
      </section>
      <BranchesSection sectionId="branch-locator" />
    </div>
  )
}
