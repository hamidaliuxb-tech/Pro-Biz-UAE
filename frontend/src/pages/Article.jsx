import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Reveal, Overline, CTABand } from '@/components/common';
import { API } from '@/lib/api';
import { getInsightBySlug, getInsightsList } from '@/lib/dataService';
import { INSIGHTS } from '@/data/insights';

const Block = ({ block }) => {
  if (block.t === 'h2') return <h2 className="font-serif text-2xl sm:text-3xl text-navy mt-12 mb-5">{block.x}</h2>;
  if (block.t === 'quote') return (
    <blockquote className="my-10 border-l-2 border-gold pl-6 py-2">
      <p className="font-serif italic text-xl text-navy/80 leading-relaxed">{block.x}</p>
    </blockquote>
  );
  if (block.t === 'list') return (
    <ul className="my-6 space-y-3">
      {block.items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-base text-slate-700 leading-relaxed">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold shrink-0 mt-2.5" /> {item}
        </li>
      ))}
    </ul>
  );
  return <p className="text-base text-slate-700 leading-relaxed my-5">{block.x}</p>;
};

export default function Article() {
  const { slug } = useParams();
  const fallbackArticle = INSIGHTS.find((a) => a.slug === slug) || null;
  const [article, setArticle] = useState(fallbackArticle);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(!fallbackArticle);

  useEffect(() => {
    let isMounted = true;
    getInsightBySlug(slug)
      .then(async (data) => {
        if (!isMounted) return;
        if (data) {
          setArticle(data);
          const all = await getInsightsList();
          const relatedSlugs = Array.isArray(data.related) ? data.related : [];
          setRelated(Array.isArray(all) ? all.filter((a) => relatedSlugs.includes(a.slug)) : []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <main className="bg-cream min-h-screen pt-40 pb-24 text-center"><p className="font-mono text-sm text-slate-400">Loading…</p></main>;
  }

  if (!article) {
    return (
      <main className="bg-navy min-h-[70vh] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="font-serif text-4xl text-cream mb-6">Article not found.</h1>
          <Link to="/insights" data-testid="article-notfound-back-link" className="text-gold text-sm underline">Back to Insights</Link>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="article-page">
      <section className="bg-navy pt-36 pb-16 lg:pt-44 lg:pb-20 grain-overlay">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <Link to="/insights" data-testid="article-back-link" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cream/50 hover:text-gold transition-colors mb-10">
              <ArrowLeft size={14} /> All Insights
            </Link>
            <Overline dark>{article.category}</Overline>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream tracking-tight leading-tight text-balance">{article.title}</h1>
            <div className="mt-8 flex items-center gap-4 text-xs font-mono text-cream/50">
              <span>{article.author} · {article.author_role}</span>
              <span className="text-gold">·</span>
              <span>{article.published_at}</span>
              <span className="text-gold">·</span>
              <span>{article.reading_time}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <img src={article.image} alt={article.title} className="w-full aspect-[16/8] object-cover mb-12" />
            {article.content.map((block, i) => <Block key={i} block={block} />)}
            <div className="gold-hairline my-12" />
            <p className="text-xs text-slate-400 italic leading-relaxed">
              This article is for general informational purposes only and does not constitute legal, tax, financial or investment advice.
            </p>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Overline>Related Reading</Overline>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {related.map((a) => (
                <Link key={a.slug} to={`/insights/${a.slug}`} data-testid={`related-article-${a.slug}`} className="group flex gap-6 border border-navy/10 p-5 hover:border-uaegreen/50 transition-colors duration-300">
                  <img src={a.image} alt="" className="w-28 h-28 object-cover shrink-0 hidden sm:block" />
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-2">{a.category}</p>
                    <h3 className="font-serif text-lg text-navy leading-snug group-hover:text-gold transition-colors">{a.title}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-3">{a.reading_time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand title="Reading about structure is the first step. Structuring is the second." />
    </main>
  );
}
