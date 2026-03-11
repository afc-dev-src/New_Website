import { Link } from 'react-router-dom'
import BranchesSection from '../components/BranchesSection'

export default function BranchLocator() {
  return (
    <div className="bg-[#f7f9ff]">
      <section className="section-fade-in relative overflow-hidden py-10 md:py-14" data-reveal>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_32%),linear-gradient(135deg,#0d143d_0%,#1a1f4e_52%,#2d4ea0_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />
        <div className="pointer-events-none absolute -top-16 right-10 h-44 w-44 rounded-full border border-white/15 bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-28 w-28 rotate-12 rounded-[2rem] border border-white/10 bg-white/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-white">
          <div className="max-w-3xl">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.24em] text-red-200">Branch Locator</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">
              Visit the AFC SME branch nearest to you
            </h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-white/82">
              Browse all AFC SME offices, review branch details, and open directions instantly from one polished
              locator experience.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#branch-locator"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1f4e] shadow-[0_16px_36px_rgba(15,23,42,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore Branches
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/16"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
      <BranchesSection sectionId="branch-locator" />
    </div>
  )
}
