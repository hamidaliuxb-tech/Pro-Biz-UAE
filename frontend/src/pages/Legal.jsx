import { useParams, Link } from 'react-router-dom';
import { PageHero, Reveal } from '@/components/common';
import { LEGAL_PAGES } from '@/data/legal';

export default function Legal() {
  const { page } = useParams();
  const content = LEGAL_PAGES[page];

  if (!content) {
    return (
      <main className="bg-navy min-h-[70vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-serif text-4xl text-cream mb-6">Page not found.</h1>
          <Link to="/legal/privacy" data-testid="legal-notfound-link" className="text-gold text-sm underline">Privacy Policy</Link>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="legal-page">
      <PageHero overline="Legal" title={content.title} text={content.updated} />
      <section className="bg-cream py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.sections.map((s, i) => (
            <Reveal key={i} className="mb-10">
              <h2 className="font-serif text-xl sm:text-2xl text-navy mb-3">{s.h}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
