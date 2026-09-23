import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal, SectionHeading, Marquee, GoldButton, GhostButton, CTABand, Overline } from '@/components/common';
import StructureDiagram from '@/components/StructureDiagram';
import { IMAGES, MARQUEE_ITEMS, PILLARS, PROCESS_STEPS, SECTORS, HOME_FAQS, PARTNER_NOTE } from '@/data/site';
import { useSite } from '@/lib/SiteContext';
import { SERVICE_GROUPS } from '@/data/services';
import { useServices } from '@/lib/useServices';
import { API } from '@/lib/api';
import { INSIGHTS } from '@/data/insights';
import { getInsightsList } from '@/lib/dataService';

const HERO_LINES = ['Build.', 'Structure.', 'Grow.', 'Protect.'];

const GOVERNANCE_ITEMS = [
  'Shareholder agreements', 'Board governance', 'Corporate resolutions', 'Director responsibilities',
  'Beneficial ownership', 'Corporate records', 'Compliance calendars', 'Succession planning', 'Risk management',
];

const BANKING_ITEMS = [
  'Corporate profile preparation', 'Business model presentation', 'Source of funds documentation',
  'KYC & UBO documentation', 'Banking application coordination', 'Payment & merchant solutions', 'Treasury requirements',
];

const MARKET_ENTRY_ITEMS = [
  'UAE entry strategy', 'Local company formation', 'Holding structures', 'Regional headquarters',
  'Banking coordination', 'Tax coordination', 'Corporate administration', 'Business operations',
];

function Hero() {
  const { site: SITE } = useSite();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-navy">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.img
          src={IMAGES.hero}
          alt="Dubai skyline and business district"
          className="w-full h-[120%] object-cover object-[center_35%]"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Soft directional gradient on left: guarantees text legibility while keeping skyline bright & vibrant */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/35 to-transparent sm:w-[60%] w-full pointer-events-none" />
        {/* Top gradient for navbar clarity */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy/70 via-navy/20 to-transparent pointer-events-none" />
        {/* Bottom smooth fade to next section */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-navy via-navy/40 to-transparent pointer-events-none" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-44 w-full z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xs font-mono uppercase tracking-[0.3em] text-gold font-medium mb-8 [text-shadow:0_2px_14px_rgba(0,0,0,0.85)]"
        >
          Corporate Services · Advisory · Structuring — UAE
        </motion.p>

        <h1 className="font-serif tracking-tight leading-[1.02] text-cream text-5xl sm:text-6xl lg:text-8xl mb-8 [text-shadow:0_3px_24px_rgba(10,17,40,0.9),0_1px_4px_rgba(0,0,0,0.9)]">
          {HERO_LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${i === 3 ? 'italic text-gold' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45 + i * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="text-base sm:text-lg text-cream font-normal max-w-xl leading-relaxed mb-10 [text-shadow:0_2px_16px_rgba(10,17,40,0.9),0_1px_4px_rgba(0,0,0,0.9)]"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <GoldButton to="/consultation" testid="hero-book-consultation-btn">Book a Confidential Consultation</GoldButton>
          <GhostButton to="/services" testid="hero-explore-services-btn">Explore Our Services</GhostButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-3 text-cream/40"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] rotate-90 origin-center translate-y-[-8px]">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrustSection() {
  const { stats: STATS } = useSite();
  return (
    <section className="bg-cream py-20 lg:py-28" data-testid="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
          <SectionHeading overline="Chapter 01 — Trust" title="Built Around Your Business. Designed for the Long Term." />
          <Reveal delay={0.15}>
            <p className="text-base text-slate-600 leading-relaxed lg:pt-10">
              Pro Biz UAE combines deep UAE market knowledge with corporate services, business advisory,
              compliance coordination and financial ecosystem expertise — connected through strategic
              partnerships with licensed professionals. We do not simply register companies. We build
              the corporate foundation for your next stage of growth.
            </p>
          </Reveal>
        </div>
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
  );
}

function ServicesSection() {
  const services = useServices();
  return (
    <section className="bg-white py-20 lg:py-28" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <SectionHeading overline="Chapter 02 — Services" title="A Complete Corporate Architecture." />
          <Reveal delay={0.1}>
            <GhostButton to="/services" dark={false} testid="services-view-all-btn">View All Services</GhostButton>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
          {SERVICE_GROUPS.map((group, gi) => (
            <Reveal key={group.id} delay={gi * 0.08} className="bg-white">
              <div className="p-8 lg:p-10 h-full group hover:bg-cream transition-colors duration-500">
                <p className="text-xs font-mono text-gold mb-3">0{gi + 1}</p>
                <h3 className="font-serif text-xl sm:text-2xl text-navy mb-3">{group.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{group.tagline}</p>
                <ul className="space-y-2.5">
                  {services.filter((s) => s.group === group.id).map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        data-testid={`service-link-${s.slug}`}
                        className="group/link inline-flex items-center gap-2 text-sm text-navy/80 hover:text-gold transition-colors duration-300"
                      >
                        {s.title}
                        <ArrowUpRight size={13} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="text-xs text-slate-400 italic">{PARTNER_NOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}

function WhyUsSection() {
  return (
    <section className="bg-navy py-20 lg:py-28 grain-overlay" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading dark overline="Chapter 03 — Why Pro Biz UAE" title="More Than Setup. A Long-Term Corporate Partner." className="mb-14 max-w-2xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10 border border-cream/10">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="bg-navy">
              <div className="p-8 lg:p-10 h-full hover:bg-navy-800 transition-colors duration-500">
                <p className="font-mono text-xs text-gold mb-4">0{i + 1}</p>
                <h3 className="font-serif text-xl text-cream mb-3">{p.title}</h3>
                <p className="text-sm text-cream/60 leading-relaxed">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketEntrySection() {
  return (
    <section className="bg-cream py-20 lg:py-28" data-testid="market-entry-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="relative">
            <img src={IMAGES.skyline} alt="Dubai skyline" className="w-full aspect-[4/5] object-cover" />
            <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4 -z-10" />
          </div>
        </Reveal>
        <div>
          <SectionHeading overline="Chapter 04 — Market Entry" title="From Global Ambition to UAE Presence." />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              For international entrepreneurs and companies, we design and execute the complete UAE
              entry — strategically sequenced, structurally sound, operationally ready.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {MARKET_ENTRY_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-navy/80">
                  <Check size={14} className="text-gold shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <GoldButton to="/consultation" testid="market-entry-cta-btn">Plan Your UAE Market Entry</GoldButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section className="bg-white py-20 lg:py-28" data-testid="governance-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading overline="Chapter 05 — Corporate Governance" title="Strong Businesses Need Strong Structures." />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              Governance is not paperwork — it is a strategic advantage. Banks assess it, investors
              price it, and partners expect it. We implement the documentation and cadence that keep
              your company decision-ready.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <GhostButton to="/structuring" dark={false} testid="governance-explore-btn">Explore Structuring & Governance</GhostButton>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
            {GOVERNANCE_ITEMS.map((item) => (
              <div key={item} className="bg-white p-5 flex items-center gap-3 hover:bg-cream transition-colors duration-300">
                <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0" />
                <span className="text-sm text-navy/80">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BankingSection() {
  return (
    <section className="bg-navy py-20 lg:py-28 grain-overlay" data-testid="banking-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="relative group">
            <img
              src={IMAGES.banking}
              alt="DIFC Dubai Corporate Banking"
              className="w-full aspect-[4/3] object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 border border-gold/30 -translate-x-4 translate-y-4 -z-10" />
            <div className="absolute bottom-5 left-5 bg-navy/95 backdrop-blur-md border border-gold/40 px-4 py-2.5 shadow-xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-mono tracking-widest text-gold uppercase font-bold">DIFC · DUBAI</p>
                <p className="text-[11px] text-cream/85 font-sans tracking-wide">Corporate Banking & Advisory</p>
              </div>
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHeading dark overline="Chapter 06 — Banking" title="Corporate Banking Support" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base text-cream/70 leading-relaxed">
              Opening a corporate bank account is an important part of establishing a UAE business.
              We help clients prepare their corporate profile, documentation and banking presentation,
              and coordinate introductions to appropriate banking partners.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {BANKING_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-cream/75">
                  <Check size={14} className="text-gold shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-xs text-cream/45 leading-relaxed border-l-2 border-gold/40 pl-4">
              Banking approval remains subject to the individual bank’s KYC, compliance and credit policies.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-8">
            <GoldButton to="/services/banking-support" testid="banking-learn-more-btn">Learn About Banking Support</GoldButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InvestorSection() {
  return (
    <section className="bg-white py-20 lg:py-28" data-testid="investor-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-14">
          <SectionHeading overline="Chapter 07 — Investor Solutions" title="Structuring Opportunities. Protecting Interests." />
          <Reveal delay={0.1}>
            <p className="text-base text-slate-600 leading-relaxed lg:pt-10">
              Investment vehicles, holding companies, SPVs, real estate structures, joint ventures and
              shareholder arrangements — designed as one coherent architecture. Explore each layer of
              a typical structure below.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <div className="bg-navy p-8 lg:p-14 grain-overlay">
            <StructureDiagram />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectorsSection() {
  return (
    <section className="bg-cream py-20 lg:py-28" data-testid="sectors-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading overline="Chapter 08 — Sectors" title="Sector-Focused Corporate Solutions" className="mb-14 max-w-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10">
          {SECTORS.map((sector, i) => (
            <Reveal key={sector} delay={(i % 4) * 0.05} className="bg-cream">
              <div className="p-6 lg:p-8 h-full hover:bg-white transition-colors duration-300 group">
                <p className="font-serif text-lg text-navy group-hover:text-uaegreen transition-colors duration-300">{sector}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="text-xs text-slate-400 italic">
            Activities in regulated sectors are subject to applicable UAE regulatory approvals and licensing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="bg-navy py-20 lg:py-28 grain-overlay" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading dark overline="Chapter 09 — Process" title="A Disciplined Path from Intent to Operation." className="mb-14 max-w-2xl" />
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-px bg-cream/10 border border-cream/10">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08} className="bg-navy">
              <div className="p-7 lg:p-8 h-full hover:bg-navy-800 transition-colors duration-500">
                <p className="font-mono text-2xl text-gold mb-4">{step.num}</p>
                <h3 className="font-serif text-lg text-cream mb-3">{step.title}</h3>
                <p className="text-sm text-cream/55 leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsPreview() {
  const [articles, setArticles] = useState(INSIGHTS.slice(0, 3));

  useEffect(() => {
    getInsightsList().then((data) => setArticles(data.slice(0, 3))).catch(() => {});
  }, []);

  if (!articles.length) return null;

  return (
    <section className="bg-white py-20 lg:py-28" data-testid="insights-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <SectionHeading overline="Chapter 10 — Insights" title="Perspective Before Decision." />
          <Reveal delay={0.1}>
            <GhostButton to="/insights" dark={false} testid="insights-view-all-btn">All Insights</GhostButton>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <Link to={`/insights/${a.slug}`} data-testid={`insight-card-${a.slug}`} className="group block">
                <div className="overflow-hidden mb-5">
                  <img src={a.image} alt={a.title} className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-2">{a.category}</p>
                <h3 className="font-serif text-xl text-navy leading-snug group-hover:text-gold transition-colors duration-300 mb-3">{a.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{a.excerpt}</p>
                <p className="mt-4 text-xs font-mono text-slate-400">{a.published_at} · {a.reading_time}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [faqs, setFaqs] = useState(HOME_FAQS);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('probiz_site_faqs');
      if (cached) setFaqs(JSON.parse(cached));
    } catch {}
  }, []);

  return (
    <section className="bg-cream py-20 lg:py-28" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading overline="Chapter 11 — FAQ" title="Questions We Are Asked Often." className="mb-12" />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`faq-accordion-item-${i + 1}`} className="border-navy/10">
                <AccordionTrigger className="text-left font-serif text-lg text-navy hover:text-uaegreen py-6">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-6">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main data-testid="home-page">
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <TrustSection />
      <ServicesSection />
      <WhyUsSection />
      <MarketEntrySection />
      <GovernanceSection />
      <BankingSection />
      <InvestorSection />
      <SectorsSection />
      <ProcessSection />
      <InsightsPreview />
      <FAQSection />
      <CTABand text="Share your objectives in confidence. We will respond with a considered, structured view of the next step." />
    </main>
  );
}
