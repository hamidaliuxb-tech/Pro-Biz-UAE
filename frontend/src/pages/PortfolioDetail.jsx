import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, ExternalLink, Check } from 'lucide-react';
import { Reveal, Overline } from '@/components/common';
import { API } from '@/lib/api';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="bg-cream min-h-screen pt-40 pb-24 text-center"><p className="font-mono text-sm text-slate-400">Loading…</p></main>;
  }

  if (!project) {
    return (
      <main className="bg-navy min-h-[70vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-serif text-4xl text-cream mb-6">Project not found.</h1>
          <Link to="/portfolio" data-testid="project-notfound-back-link" className="text-gold text-sm underline">Back to Our Work</Link>
        </div>
      </main>
    );
  }

  const meta = [
    ['Client', project.client_name], ['Industry', project.industry],
    ['Location', project.location], ['Project Type', project.project_type],
  ].filter(([, v]) => v);

  return (
    <main data-testid="portfolio-detail-page">
      <section className="bg-navy pt-36 pb-16 lg:pt-44 lg:pb-20 grain-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link to="/portfolio" data-testid="project-back-link" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cream/50 hover:text-uaegreen transition-colors mb-10">
              <ArrowLeft size={14} /> All Projects
            </Link>
            <Overline dark>{project.category}</Overline>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream tracking-tight leading-tight text-balance">{project.title}</h1>
            {project.sample && (
              <p className="mt-6 inline-block border border-uaegreen/50 text-uaegreen text-xs font-mono uppercase tracking-[0.15em] px-4 py-2">
                Sample case study — placeholder content shown until a real client project is published
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            {project.images?.[0] && (
              <img src={project.images[0]} alt={project.title} className="w-full aspect-[16/8] object-cover mb-10" data-testid="project-hero-image" />
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 border border-navy/10 mb-14">
              {meta.map(([k, v]) => (
                <div key={k} className="bg-white p-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-1">{k}</p>
                  <p className="text-sm text-navy font-medium">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-14">
              <div>
                <Overline>The Requirement</Overline>
                <p className="text-base text-slate-700 leading-relaxed">{project.requirement}</p>
              </div>
              <div>
                <Overline>The Solution</Overline>
                <p className="text-base text-slate-700 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-14">
              {(project.features?.length || 0) > 0 && (
                <div>
                  <Overline>Key Features Developed</Overline>
                  <ul className="space-y-3">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check size={14} className="text-uaegreen shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(project.tech?.length || 0) > 0 && (
                <div>
                  <Overline>Technology & Platform</Overline>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="border border-navy/15 bg-white px-4 py-2 text-xs text-navy/80">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {project.outcome && (
              <div className="bg-navy p-8 lg:p-12 mb-14 grain-overlay">
                <Overline dark>The Outcome</Overline>
                <p className="font-serif text-xl lg:text-2xl text-cream leading-relaxed">{project.outcome}</p>
              </div>
            )}

            {project.testimonial && (
              <blockquote className="border-l-2 border-uaegreen pl-6 py-2 mb-14">
                <p className="font-serif italic text-xl text-navy/80 leading-relaxed">“{project.testimonial}”</p>
                {project.testimonial_author && <footer className="mt-3 text-xs font-mono text-slate-400">— {project.testimonial_author}</footer>}
              </blockquote>
            )}

            {(project.images?.length || 0) > 1 && (
              <div className="grid sm:grid-cols-2 gap-6 mb-14">
                {project.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} screenshot ${i + 2}`} className="w-full aspect-[16/10] object-cover" />
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" data-testid="project-live-url-btn" className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-7 py-3.5 hover:bg-uaegreen transition-colors duration-300">
                  View Live Website <ExternalLink size={15} />
                </a>
              )}
              <Link to="/consultation?service=website-design-development" data-testid="project-detail-cta-btn" className="inline-flex items-center gap-2 bg-gold text-white text-sm font-medium px-7 py-3.5 hover:bg-gold-soft transition-colors duration-300">
                Discuss Your Project <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
