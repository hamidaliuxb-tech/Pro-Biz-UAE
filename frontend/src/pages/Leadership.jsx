import { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { SITE } from '@/data/site';
import { DEFAULT_TEAM } from '@/data/team';

export default function Leadership() {
  const [team, setTeam] = useState(DEFAULT_TEAM);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('probiz_team_members');
      if (cached) setTeam(JSON.parse(cached));
    } catch {}
  }, []);

  return (
    <main data-testid="leadership-page">
      <PageHero
        overline="Leadership"
        title="Executive-Level Counsel, Personally Delivered."
        text="Every Pro Biz UAE engagement is led by senior advisers with deep expertise in UAE corporate services, structuring and cross-border expansion."
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {team.map((m, i) => (
              <Reveal key={m.id || m.name} delay={i * 0.1}>
                <div className="group flex flex-col justify-between h-full pt-6 pb-2 border-t-2 border-navy/15 hover:border-gold transition-colors duration-500" data-testid={`leadership-profile-${i + 1}`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-gold/80 tracking-widest font-semibold">0{i + 1} // ADVISER</span>
                      <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" data-testid={`leadership-linkedin-${i + 1}`} className="text-slate-400 hover:text-gold transition-colors p-1" aria-label="LinkedIn">
                        <Linkedin size={17} />
                      </a>
                    </div>
                    <h3 className="font-serif text-2xl lg:text-3xl text-navy group-hover:text-gold transition-colors duration-300 leading-tight">{m.name}</h3>
                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-gold mt-2 font-medium">{m.role}</p>
                    <div className="w-12 h-px bg-gold/40 my-5" />
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">{m.background}</p>
                  </div>
                  <div className="pt-4 border-t border-navy/10">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2.5">Key Disciplines</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.expertise.map((e) => (
                        <span key={e} className="text-[11px] font-mono text-navy/80 bg-white/80 border border-navy/10 px-2.5 py-0.5">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 lg:py-24 grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading dark overline="Join the Firm" title="Careers at Pro Biz UAE" />
          <Reveal delay={0.1}>
            <p className="text-cream/70 leading-relaxed text-base">
              We selectively welcome advisers with corporate services, banking, legal or governance backgrounds
              who share our standards of discretion and client care. Introduce yourself in confidence via our contact page.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABand dark={false} title="Speak with a senior adviser directly." />
    </main>
  );
}
