import { useParams, Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageHero, Reveal, SectionHeading, GoldButton, CTABand, Overline } from '@/components/common';
import { getGroup } from '@/data/services';
import { useServices } from '@/lib/useServices';
import { IMAGES } from '@/data/site';

const List = ({ items = [], dark = false }) => (
  <ul className="space-y-3">
    {(items || []).map((item) => (
      <li key={item} className={`flex items-start gap-3 text-sm leading-relaxed ${dark ? 'text-cream/75' : 'text-slate-600'}`}>
        <Check size={14} className="text-gold shrink-0 mt-0.5" /> {item}
      </li>
    ))}
  </ul>
);

export default function ServiceDetail() {
  const { slug } = useParams();
  const services = useServices();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <main className="bg-navy min-h-[70vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-serif text-4xl text-cream mb-6">Service not found.</h1>
          <Link to="/services" data-testid="service-notfound-back-link" className="text-gold text-sm underline">View all services</Link>
        </div>
      </main>
    );
  }

  const group = getGroup(service.group);

  return (
    <main data-testid="service-detail-page">
      <PageHero overline={`${group.title}`} title={service.title} text={service.summary} image={IMAGES.facade} />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" data-testid="service-back-link" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-uaegreen transition-colors mb-12">
            <ArrowLeft size={14} /> All Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <Reveal>
              <Overline>What It Is</Overline>
              <p className="text-base text-slate-700 leading-relaxed">{service.what}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Overline>Why It Matters</Overline>
              <p className="text-base text-slate-700 leading-relaxed">{service.why}</p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mt-16">
            <Reveal>
              <Overline>Who Needs It</Overline>
              <List items={service.who} />
            </Reveal>
            <Reveal delay={0.1}>
              <Overline>Key Considerations</Overline>
              <List items={service.considerations} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 lg:py-24 grain-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading dark overline="Process" title="A Typical Engagement" className="mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10 border border-cream/10 mb-16">
            {(service.process || []).map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07} className="bg-navy">
                <div className="p-7 h-full">
                  <p className="font-mono text-xl text-gold mb-3">0{i + 1}</p>
                  <h3 className="font-serif text-lg text-cream mb-2">{step.title}</h3>
                  <p className="text-sm text-cream/55 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal>
              <Overline dark>Expected Timeline</Overline>
              <div className="border border-cream/10">
                {(service.timeline || []).map((t) => (
                  <div key={t.phase} className="flex justify-between gap-4 px-6 py-4 border-b border-cream/10 last:border-0">
                    <span className="text-sm text-cream/75">{t.phase}</span>
                    <span className="text-sm font-mono text-gold text-right shrink-0">{t.duration}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Overline dark>Typical Documents</Overline>
              <List items={service.documents} dark />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <Overline>Our Role</Overline>
            <p className="text-base text-slate-700 leading-relaxed mb-8">{service.role}</p>
            <Overline>Professional Partners</Overline>
            <p className="text-sm text-slate-500 leading-relaxed italic border-l-2 border-gold/50 pl-4">{service.partners}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Overline>FAQs</Overline>
            <Accordion type="single" collapsible>
              {(service.faqs || []).map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} data-testid={`service-faq-item-${i + 1}`} className="border-navy/10">
                  <AccordionTrigger className="text-left font-serif text-base text-navy hover:text-uaegreen">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream max-w-xl text-balance">Discuss Your Requirements Confidentially</h2>
          <GoldButton to={`/consultation?service=${service.slug}`} testid="service-detail-cta-btn">Request a Consultation</GoldButton>
        </div>
      </section>

      <CTABand dark={false} title="Prefer to write to us directly?" text="Our team responds to all enquiries within one business day." />
    </main>
  );
}
