import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertCircle, Cookie, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { PageHero, Reveal } from '@/components/common';
import { LEGAL_PAGES } from '@/data/legal';
import { SITE } from '@/data/site';

const LEGAL_TABS = [
  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle },
  { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
];

export default function Legal() {
  const { page } = useParams();
  const currentKey = LEGAL_PAGES[page] ? page : 'privacy';
  const content = LEGAL_PAGES[currentKey];

  return (
    <main data-testid="legal-page" className="bg-cream min-h-screen">
      <PageHero
        overline="Statutory Disclosures & Compliance"
        title={content.title}
        text={content.subtitle || content.updated}
      />

      {/* Legal Subnavigation Tabs */}
      <div className="bg-white border-b border-navy/10 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto py-3 no-scrollbar">
            {LEGAL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentKey === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={`/legal/${tab.id}`}
                  data-testid={`legal-tab-${tab.id}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 border-b-2 ${
                    isActive
                      ? 'border-gold text-navy font-semibold bg-navy/5'
                      : 'border-transparent text-slate-500 hover:text-navy hover:border-slate-300'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-gold' : 'text-slate-400'} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Legal Content */}
            <div className="lg:col-span-8 bg-white p-8 sm:p-12 border border-navy/10 shadow-xs">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-navy/10 text-xs font-mono text-slate-400">
                <span>{content.updated}</span>
                <span className="uppercase tracking-widest text-gold font-semibold">Official Firm Policy</span>
              </div>

              <div className="space-y-10">
                {content.sections.map((s, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <div id={`sec-${i + 1}`} className="scroll-mt-36">
                      <h2 className="font-serif text-xl sm:text-2xl text-navy mb-3.5 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-gold inline-block shrink-0" />
                        {s.h}
                      </h2>
                      <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line pl-4.5">
                        {s.p}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Sidebar with Company Information & Quick Nav */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
              {/* Quick Navigation Card */}
              <div className="bg-white border border-navy/10 p-6">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-4">On This Document</h3>
                <ul className="space-y-2.5 text-xs text-slate-500">
                  {content.sections.map((s, i) => (
                    <li key={i}>
                      <a
                        href={`#sec-${i + 1}`}
                        className="hover:text-gold transition-colors block line-clamp-1 py-0.5"
                      >
                        {s.h}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Registered Corporate Office Card */}
              <div className="bg-navy text-cream p-7 border border-gold/25 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-3">Registered Office</h3>
                <p className="font-serif text-lg text-cream mb-4">{SITE.name}</p>

                <div className="space-y-3.5 text-xs text-cream/75 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                    <span>{SITE.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gold shrink-0" />
                    <a href={`mailto:${SITE.email}`} className="hover:text-gold transition-colors">{SITE.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gold shrink-0" />
                    <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors">{SITE.phone}</a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cream/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cream/50">UAE Legal Jurisdiction</span>
                  <Link to="/contact" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
                    Contact Us <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
