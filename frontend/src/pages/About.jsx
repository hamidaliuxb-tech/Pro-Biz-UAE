import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { IMAGES, STATS } from '@/data/site';

const VALUES = [
  { title: 'Regulatory Awareness', text: 'We operate with current knowledge of UAE corporate, tax and compliance frameworks — and clear honesty about what requires licensed professionals.' },
  { title: 'International Relationships', text: 'A partner network spanning banks, law firms, tax advisers, accountants and free zone authorities across the UAE and key international markets.' },
  { title: 'Client-Centric Structure', text: 'Every recommendation begins with the client’s objectives — never with a preferred jurisdiction, package or partner.' },
  { title: 'Financial Ecosystem Knowledge', text: 'Practical understanding of how banks, auditors, authorities and investors actually evaluate a business.' },
];

export default function About() {
  return (
    <main data-testid="about-page">
      <PageHero
        overline="About Meridian"
        title="Built on Experience. Driven by Integrity."
        text="Meridian Corporate Partners was founded on a simple observation: businesses entering and operating in the UAE deserve the same standard of corporate counsel they would expect in London, Singapore or Zurich."
        image={IMAGES.boardroom}
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <SectionHeading overline="Our Story" title="A Firm Built for Consequential Decisions" className="mb-8" />
            <div className="space-y-5 text-base text-slate-600 leading-relaxed">
              <p>
                Our team brings together experience across the UAE business environment, financial services,
                corporate management and business strategy. We have sat on both sides of the table — as
                advisers and as operators — and we built Meridian around what serious businesses actually need.
              </p>
              <p>
                We are deliberately not a volume formation agency. We take on a considered number of
                engagements, we say no when a structure does not serve the client, and we measure our
                success in relationships that span years — not transactions that close in days.
              </p>
            </div>
          </Reveal>
          <div className="space-y-px">
            <Reveal delay={0.1}>
              <div className="bg-navy p-10 lg:p-12 grain-overlay">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-4">Our Mission</p>
                <p className="font-serif text-2xl lg:text-3xl text-cream leading-snug">
                  To simplify complex corporate decisions and help businesses build stronger foundations for sustainable growth.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white border border-navy/10 p-10 lg:p-12">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-4">Our Vision</p>
                <p className="font-serif text-2xl lg:text-3xl text-navy leading-snug">
                  To become a trusted corporate advisory partner for businesses and investors building their future in the UAE.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="How We Work" title="The Standards Behind the Advice" className="mb-12" />
          <div className="grid sm:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="bg-white">
                <div className="p-8 lg:p-10 h-full">
                  <p className="font-mono text-xs text-gold mb-3">0{i + 1}</p>
                  <h3 className="font-serif text-xl text-navy mb-3">{v.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="The Firm in Numbers" title="Measured by Relationships, Not Transactions" className="mb-12 max-w-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-cream">
                <div className="p-8 lg:p-10">
                  <p className="font-mono text-3xl lg:text-4xl text-gold mb-2">{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand title="Meet the firm behind the structure." text="A confidential consultation is the right first step — no obligation, no sales process." />
    </main>
  );
}
