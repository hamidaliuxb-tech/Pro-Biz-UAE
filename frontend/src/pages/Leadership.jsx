import { Linkedin } from 'lucide-react';
import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { IMAGES, SITE } from '@/data/site';

const TEAM = [
  {
    name: 'O. Al Mansoori',
    role: 'Managing Partner',
    image: IMAGES.partnerMale,
    background: 'Two decades across UAE corporate services, banking and business operations, advising founders, family businesses and international groups on establishment and structure.',
    expertise: ['Corporate Structuring', 'UAE Market Entry', 'Banking Coordination'],
  },
  {
    name: 'E. Vasquez',
    role: 'Director, Business Advisory',
    image: IMAGES.partnerFemale,
    background: 'International advisory background spanning strategy, transactions and cross-border expansion, with a focus on SME and mid-market businesses entering the Gulf.',
    expertise: ['Business Strategy', 'M&A Support', 'International Expansion'],
  },
  {
    name: 'J. Whitfield',
    role: 'Head of Governance & Compliance Coordination',
    image: IMAGES.advisor,
    background: 'Career across corporate administration, governance frameworks and regulatory coordination for holding structures, family businesses and investment vehicles.',
    expertise: ['Corporate Governance', 'Compliance Coordination', 'Family Business Structures'],
  },
];

export default function Leadership() {
  return (
    <main data-testid="leadership-page">
      <PageHero
        overline="Leadership"
        title="Executive-Level Counsel, Personally Delivered."
        text="Every Pro Biz UAE engagement is led by senior advisers with deep expertise in UAE corporate services, structuring and cross-border expansion."
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((m, i) => {
              const initials = m.name.split(' ').map((n) => n[0]).join('');
              return (
                <Reveal key={m.name} delay={i * 0.1}>
                  <div className="group bg-white border border-navy/10 hover:border-gold/50 transition-all duration-300 shadow-sm" data-testid={`leadership-profile-${i + 1}`}>
                    <div className="h-44 bg-gradient-to-br from-navy via-navy-800 to-navy-900 flex items-center justify-center relative overflow-hidden border-b border-gold/15">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center bg-navy/60 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="font-serif text-2xl text-gold tracking-widest">{initials}</span>
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-serif text-xl text-navy">{m.name}</h3>
                          <p className="text-xs font-mono uppercase tracking-[0.15em] text-gold mt-1">{m.role}</p>
                        </div>
                        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" data-testid={`leadership-linkedin-${i + 1}`} className="text-slate-400 hover:text-gold transition-colors" aria-label="LinkedIn">
                          <Linkedin size={18} />
                        </a>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-5">{m.background}</p>
                      <div className="flex flex-wrap gap-2">
                        {m.expertise.map((e) => (
                          <span key={e} className="text-[11px] border border-navy/15 px-3 py-1 text-slate-500">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
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
