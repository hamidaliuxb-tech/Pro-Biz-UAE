import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading, GhostButton } from '@/components/common';
import { API } from '@/lib/api';

export default function PortfolioTeaser() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get(`${API}/projects`).then((res) => setProjects(res.data.slice(0, 3))).catch(() => {});
  }, []);

  if (!projects.length) return null;

  return (
    <section className="bg-white py-20 lg:py-28" data-testid="portfolio-teaser-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <SectionHeading overline="Our Web Projects" title="Websites Designed & Built by Pro Biz UAE." />
          <Reveal delay={0.1}>
            <GhostButton to="/portfolio" dark={false} testid="portfolio-view-all-btn">View Our Work</GhostButton>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Link to={`/portfolio/${p.id}`} data-testid={`teaser-project-${p.id}`} className="group block">
                <div className="relative overflow-hidden mb-5">
                  <img src={p.images[0]} alt={p.title} className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.sample && (
                    <span className="absolute top-3 left-3 bg-uaegreen text-white text-[10px] font-mono uppercase tracking-[0.15em] px-3 py-1.5">Sample</span>
                  )}
                </div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-2">{p.category}</p>
                <h3 className="font-serif text-xl text-navy leading-snug group-hover:text-uaegreen transition-colors duration-300 flex items-center gap-2">
                  {p.title} <ArrowRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-2">{p.client_name} · {p.industry}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
