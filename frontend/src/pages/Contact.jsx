import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/common';
import LeadForm from '@/components/LeadForm';
import { useSite } from '@/lib/SiteContext';

export default function Contact() {
  const { site: SITE } = useSite();
  const DETAILS = [
    { icon: MapPin, label: 'Office', value: SITE.address },
    { icon: Phone, label: 'Telephone', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, label: 'Business Hours', value: SITE.hours },
  ];
  return (
    <main data-testid="contact-page">
      <PageHero
        overline="Contact"
        title="Let’s Discuss Your Business."
        text="Whether you are establishing your first UAE company, expanding an international business or restructuring an existing operation, our team can help you evaluate the next step."
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeading overline="Reach Us" title="Direct & Confidential" className="mb-10" />
            <div className="space-y-6">
              {DETAILS.map((d) => {
                const Icon = d.icon;
                return (
                  <Reveal key={d.label}>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">{d.label}</p>
                        {d.href ? (
                          <a href={d.href} data-testid={`contact-${d.label.toLowerCase().replace(/\s/g, '-')}`} className="text-sm text-navy hover:text-gold transition-colors">{d.value}</a>
                        ) : (
                          <p className="text-sm text-navy leading-relaxed">{d.value}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
              <Reveal>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="contact-whatsapp-btn"
                  className="inline-flex items-center gap-3 border border-navy/20 px-6 py-3.5 text-sm text-navy hover:border-uaegreen hover:text-uaegreen transition-colors duration-300 mt-2"
                >
                  <MessageCircle size={16} /> Message us on WhatsApp
                </a>
              </Reveal>
            </div>

            <Reveal className="mt-10">
              <div className="border border-navy/10 overflow-hidden" data-testid="contact-map">
                <iframe
                  title="Pro Biz UAE — Dubai Office"
                  src="https://www.google.com/maps?q=Ibn+Battuta+Gate,+Jebel+Ali,+Dubai&output=embed"
                  className="w-full h-72 border-0"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-xs text-slate-400">Visits by appointment. Appointment booking available on request.</p>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <div className="bg-white border border-navy/10 p-8 lg:p-12">
                <h2 className="font-serif text-2xl text-navy mb-2">Send a Confidential Enquiry</h2>
                <p className="text-sm text-slate-500 mb-8">A senior adviser reviews every enquiry personally. Expect a response within one business day.</p>
                <LeadForm source="contact" testidPrefix="contact-form" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
