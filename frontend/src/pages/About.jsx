import { useState, useEffect } from 'react';
import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { IMAGES } from '@/data/site';
import { DEFAULT_ABOUT } from '@/data/about';

export default function About() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_about_data');
      return cached ? JSON.parse(cached) : DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const cached = localStorage.getItem('probiz_about_data');
        if (cached) setData(JSON.parse(cached));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const hero = data.hero || DEFAULT_ABOUT.hero;
  const story = data.story || DEFAULT_ABOUT.story;
  const mission = data.mission || DEFAULT_ABOUT.mission;
  const vision = data.vision || DEFAULT_ABOUT.vision;
  const values = data.values || DEFAULT_ABOUT.values;
  const stats = data.stats || DEFAULT_ABOUT.stats;

  return (
    <main data-testid="about-page">
      <PageHero
        overline={hero.overline || "About Pro Biz UAE"}
        title={hero.title || "Built on Experience. Driven by Integrity."}
        text={hero.text || "Pro Biz UAE was founded on a simple observation: businesses entering and operating in the UAE deserve the same standard of corporate counsel they would expect in London, Singapore or Zurich."}
        image={IMAGES.boardroom}
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <SectionHeading overline="Our Story" title={story.heading || "A Firm Built for Consequential Decisions"} className="mb-8" />
            <div className="space-y-5 text-base text-slate-600 leading-relaxed">
              <p>{story.p1}</p>
              {story.p2 && <p>{story.p2}</p>}
            </div>
          </Reveal>
          <div className="space-y-px">
            <Reveal delay={0.1}>
              <div className="bg-navy p-10 lg:p-12 grain-overlay">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-4">Our Mission</p>
                <p className="font-serif text-2xl lg:text-3xl text-cream leading-snug">
                  {mission}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-white border border-navy/10 p-10 lg:p-12">
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-4">Our Vision</p>
                <p className="font-serif text-2xl lg:text-3xl text-navy leading-snug">
                  {vision}
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
            {values.map((v, i) => (
              <Reveal key={v.title || i} delay={i * 0.06} className="bg-white">
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
            {stats.map((s, i) => (
              <Reveal key={s.label || i} delay={i * 0.08} className="bg-cream">
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
