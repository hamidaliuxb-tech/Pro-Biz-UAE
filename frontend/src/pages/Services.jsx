import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHero, Reveal, SectionHeading, CTABand } from '@/components/common';
import { SERVICE_GROUPS } from '@/data/services';
import { useServices } from '@/lib/useServices';
import { IMAGES, PARTNER_NOTE } from '@/data/site';

export default function Services() {
  const services = useServices();
  return (
    <main data-testid="services-page">
      <PageHero
        overline="Services"
        title="An Integrated Corporate Capability."
        text="Sixteen disciplines across four practices — designed to work together across the full life of your business, from first incorporation to exit and succession."
        image={IMAGES.tower}
      />
      {SERVICE_GROUPS.map((group, gi) => (
        <section key={group.id} className={`${gi % 2 === 0 ? 'bg-cream' : 'bg-white'} py-16 lg:py-24`} data-testid={`service-group-${group.id}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading overline={`Practice 0${gi + 1}`} title={group.title} className="mb-4" />
            <Reveal><p className="text-base text-slate-600 max-w-2xl mb-12">{group.tagline}</p></Reveal>
            <div className="grid sm:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
              {services.filter((s) => s.group === group.id).map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.06} className={gi % 2 === 0 ? 'bg-cream' : 'bg-white'}>
                  <Link
                    to={`/services/${s.slug}`}
                    data-testid={`service-card-${s.slug}`}
                    className="group block p-8 lg:p-10 h-full hover:bg-navy hover:shadow-[inset_0_3px_0_#00732F] transition-all duration-500"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-xl sm:text-2xl text-navy group-hover:text-cream transition-colors duration-500">{s.title}</h3>
                      <ArrowUpRight size={20} className="text-gold shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <p className="mt-4 text-sm text-slate-500 group-hover:text-cream/60 transition-colors duration-500 leading-relaxed">{s.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="bg-navy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-cream/40 italic">{PARTNER_NOTE}</p>
        </div>
      </section>
      <CTABand title="Not sure which service fits? That is exactly what the consultation is for." />
    </main>
  );
}
