import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { PageHero, Reveal } from '@/components/common';
import { API } from '@/lib/api';

const CATEGORIES = ['All', 'Corporate Websites', 'Business Websites', 'E-Commerce', 'Digital Marketing', 'Professional Services', 'Real Estate', 'Consultancy', 'Healthcare', 'Other'];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/projects`)
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? projects : projects.filter((p) => p.category === category);

  return (
    <main data-testid="portfolio-page">
      <PageHero
        overline="Our Web Projects · Client Work"
        title="Websites We Have Designed & Built."
        text="Browse selected projects and see the type of website Pro Biz UAE can create for your business — from corporate platforms to e-commerce storefronts."
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap gap-3 mb-12">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  data-testid={`portfolio-filter-${c.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  onClick={() => setCategory(c)}
                  className={`border px-5 py-2.5 text-sm transition-colors duration-300 ${
                    category === c ? 'border-gold bg-navy text-cream' : 'border-navy/15 bg-white text-navy/70 hover:border-uaegreen'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <p className="text-slate-400 font-mono text-sm">Loading projects…</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400">No projects in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
                  <div className="group bg-white border border-navy/10 hover:border-uaegreen/50 transition-colors duration-500 flex flex-col" data-testid={`project-card-${p.id}`}>
                    <div className="relative overflow-hidden">
                      <img src={p.images[0]} alt={p.title} className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" />
                      {p.sample && (
                        <span className="absolute top-3 left-3 bg-uaegreen text-white text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1.5">Sample</span>
                      )}
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-2">{p.category}</p>
                      <h3 className="font-serif text-xl text-navy leading-snug mb-2">{p.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">{p.client_name} · {p.industry} · {p.location}</p>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">{p.requirement}</p>
                      <div className="mt-auto flex gap-3">
                        <Link
                          to={`/portfolio/${p.id}`}
                          data-testid={`project-case-study-${p.id}`}
                          className="inline-flex items-center gap-2 bg-navy text-cream text-xs font-medium px-5 py-3 hover:bg-uaegreen transition-colors duration-300"
                        >
                          View Case Study <ArrowRight size={13} />
                        </Link>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`project-live-${p.id}`}
                            className="inline-flex items-center gap-2 border border-navy/20 text-navy text-xs px-5 py-3 hover:border-uaegreen hover:text-uaegreen transition-colors duration-300"
                          >
                            View Project <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-navy py-20 lg:py-24 grain-overlay" data-testid="portfolio-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flag-ribbon mb-14 opacity-90" />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <Reveal>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-cream tracking-tight max-w-xl text-balance">
                Looking for a Website Like This?
              </h2>
              <p className="mt-4 text-base text-cream/60 max-w-lg">
                Tell us about your business — we will propose a design approach, timeline and transparent scope for your project.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                to="/consultation?service=website-design-development"
                data-testid="portfolio-discuss-project-btn"
                className="inline-flex items-center gap-2 bg-gold text-white text-sm font-medium tracking-wide px-7 py-3.5 hover:bg-gold-soft transition-colors duration-300"
              >
                Discuss Your Project <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
