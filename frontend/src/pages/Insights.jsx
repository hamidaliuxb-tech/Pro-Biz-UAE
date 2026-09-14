import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageHero, Reveal, CTABand } from '@/components/common';
import { API } from '@/lib/api';
import { IMAGES } from '@/data/site';

const CATEGORIES = ['All', 'UAE Business', 'Corporate', 'Finance', 'Tax & Compliance', 'Investment'];

export default function Insights() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/insights`)
      .then((res) => setArticles(res.data.sort((a, b) => b.published_at.localeCompare(a.published_at))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? articles : articles.filter((a) => a.category === category);

  return (
    <main data-testid="insights-page">
      <PageHero
        overline="Insights & Intelligence"
        title="Perspective Before Decision."
        text="Structured analysis on UAE corporate, banking, tax and investment matters — written for decision-makers."
        image={IMAGES.tower}
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap gap-3 mb-12">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  data-testid={`insights-filter-${c.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  onClick={() => setCategory(c)}
                  className={`border px-5 py-2.5 text-sm transition-colors duration-300 ${
                    category === c ? 'border-gold bg-navy text-cream' : 'border-navy/15 bg-white text-navy/70 hover:border-gold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {loading ? (
            <p className="text-slate-400 font-mono text-sm">Loading insights…</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((a, i) => (
                <Reveal key={a.slug} delay={(i % 3) * 0.08}>
                  <Link to={`/insights/${a.slug}`} data-testid={`insight-card-${a.slug}`} className="group block bg-white border border-navy/10 hover:border-gold/50 transition-colors duration-500">
                    <div className="overflow-hidden">
                      <img src={a.image} alt={a.title} className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-7">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-3">{a.category}</p>
                      <h2 className="font-serif text-xl text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-300">{a.title}</h2>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-5">{a.excerpt}</p>
                      <p className="text-xs font-mono text-slate-400">{a.author} · {a.published_at} · {a.reading_time}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Prefer a conversation to a reading list?" />
    </main>
  );
}
