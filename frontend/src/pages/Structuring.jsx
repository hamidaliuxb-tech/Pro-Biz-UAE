import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import StructureDiagram from '@/components/StructureDiagram';
import { IMAGES } from '@/data/site';

const TRACKS = [
  {
    slug: 'holding-companies',
    title: 'Holding Companies',
    text: 'Consolidation, protection and succession — the strategic centre of a group structure.',
  },
  {
    slug: 'spv-structures',
    title: 'SPV Structures',
    text: 'Purpose-built vehicles that isolate risk and make assets transferable and financeable.',
  },
  {
    slug: 'family-business-structures',
    title: 'Family Business Structures',
    text: 'Governance, ownership and succession frameworks for enterprises that span generations.',
  },
  {
    slug: 'corporate-restructuring',
    title: 'Restructuring & Exit',
    text: 'Composed support for ownership change, consolidation, succession and business exit.',
  },
];

const GOVERNANCE_POINTS = [
  'Shareholder agreements that encode decision rights and exits',
  'Board governance and documented responsibilities',
  'Corporate resolutions and records kept current',
  'Beneficial ownership and UBO transparency',
  'Compliance calendars for licences and filings',
  'Succession provisions for shareholders and directors',
];

export default function Structuring() {
  return (
    <main data-testid="structuring-page">
      <PageHero
        overline="Corporate Structuring"
        title="Architecture Before Incorporation."
        text="We design how your entities, ownership and assets are arranged — holding companies, operating companies, SPVs and the governance that connects them."
        image={IMAGES.facade}
      />

      <section className="bg-navy py-16 lg:py-24 grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading dark overline="The Structure Visualizer" title="Anatomy of a Well-Built Structure" className="mb-12 max-w-2xl" />
          <StructureDiagram />
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="Structuring Disciplines" title="Four Ways We Build" className="mb-12" />
          <div className="grid sm:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
            {TRACKS.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.06} className="bg-cream">
                <Link to={`/services/${t.slug}`} data-testid={`structuring-track-${t.slug}`} className="group block p-8 lg:p-10 h-full hover:bg-navy transition-colors duration-500">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl sm:text-2xl text-navy group-hover:text-cream transition-colors duration-500">{t.title}</h3>
                    <ArrowUpRight size={20} className="text-gold shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="mt-3 text-sm text-slate-500 group-hover:text-cream/60 transition-colors duration-500 leading-relaxed">{t.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading overline="Governance" title="Governance Is the Operating System of the Structure." />
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {GOVERNANCE_POINTS.map((g) => (
                <li key={g} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-1.5" /> {g}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-slate-400 italic border-l-2 border-gold/40 pl-4">
              Legal and tax advice is provided by appropriately licensed professional partners where required.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand title="Structure first. Entities second. Regrets never." text="Tell us where you intend to be in ten years — we will design the structure that gets you there." />
    </main>
  );
}
