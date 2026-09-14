import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JURISDICTION_CHIPS, JURISDICTION_MATRIX, IMAGES } from '@/data/site';

export default function Jurisdictions() {
  const { columns, rows } = JURISDICTION_MATRIX;

  return (
    <main data-testid="jurisdictions-page">
      <PageHero
        overline="Your Gateway to the UAE"
        title="One Country. Many Jurisdictions. One Right Answer — Yours."
        text="The UAE offers mainland, free zone, financial free zone and international structures, each with distinct advantages. We help you compare them honestly — because not every structure is appropriate for every business."
        image={IMAGES.difc}
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="The Ecosystem" title="Jurisdictions We Advise Across" className="mb-10" />
          <Reveal>
            <div className="flex flex-wrap gap-3">
              {JURISDICTION_CHIPS.map((j) => (
                <span key={j} data-testid={`jurisdiction-chip-${j.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="border border-navy/15 bg-white px-5 py-2.5 text-sm text-navy/80 hover:border-gold hover:text-gold transition-colors duration-300">
                  {j}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24" data-testid="jurisdiction-comparison">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading overline="Interactive Comparison" title="Mainland vs Free Zone vs Financial Free Zone vs International" className="mb-12 max-w-3xl" />

          <div className="hidden lg:block overflow-x-auto border border-navy/10">
            <table className="w-full text-sm" data-testid="jurisdiction-matrix-table">
              <thead>
                <tr className="bg-navy text-cream">
                  <th className="text-left p-5 font-mono text-xs uppercase tracking-[0.15em] w-48">Criteria</th>
                  {columns.map((c) => (
                    <th key={c.key} className="text-left p-5">
                      <span className="font-serif text-lg block">{c.title}</span>
                      <span className="text-[11px] font-mono text-gold/80 block mt-1">{c.tag}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.label} className={ri % 2 === 0 ? 'bg-cream' : 'bg-white'}>
                    <td className="p-5 font-medium text-navy align-top">{row.label}</td>
                    {columns.map((c) => (
                      <td key={c.key} className="p-5 text-slate-600 leading-relaxed align-top">{row.values[c.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            <Tabs defaultValue="mainland">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full bg-cream h-auto">
                {columns.map((c) => (
                  <TabsTrigger
                    key={c.key}
                    value={c.key}
                    data-testid={`jurisdiction-tab-${c.key === 'financial' ? 'financial-freezone' : c.key}`}
                    className="text-xs py-3 data-[state=active]:bg-navy data-[state=active]:text-cream"
                  >
                    {c.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {columns.map((c) => (
                <TabsContent key={c.key} value={c.key}>
                  <div className="border border-navy/10 mt-4">
                    {rows.map((row, ri) => (
                      <div key={row.label} className={`p-5 ${ri % 2 === 0 ? 'bg-cream' : 'bg-white'} border-b border-navy/10 last:border-0`}>
                        <p className="text-xs font-mono uppercase tracking-[0.15em] text-gold mb-2">{row.label}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{row.values[c.key]}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Reveal className="mt-8">
            <p className="text-xs text-slate-400 leading-relaxed italic max-w-3xl">
              This comparison is indicative only. Activity scope, ownership, tax treatment and requirements vary by
              emirate, zone and activity, and change over time. A confidential consultation will confirm the position for your specific case.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand title="The right jurisdiction is a strategic decision. Make it with advice, not a price list." text="Tell us about your business and objectives — we will map the options honestly." />
    </main>
  );
}
