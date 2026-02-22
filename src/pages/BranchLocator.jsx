import BranchesSection from '../components/BranchesSection'

export default function BranchLocator() {
  return (
    <div>
      <section className="section-fade-in py-12 bg-[#1a1f4e]" data-reveal>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Branch Locator</h1>
          <p className="text-xl text-white/80">Visit the nearest AFC SME branch for on-ground assistance.</p>
        </div>
      </section>
      <BranchesSection sectionId="branch-locator" />
    </div>
  )
}
