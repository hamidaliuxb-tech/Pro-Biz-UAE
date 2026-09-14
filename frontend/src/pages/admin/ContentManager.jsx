import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/lib/api';
import { SITE, STATS } from '@/data/site';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const SITE_FIELDS = [
  ['name', 'Company Name'],
  ['tagline', 'Homepage Tagline'],
  ['phone', 'Telephone'],
  ['whatsapp', 'WhatsApp Number (international format, digits only)'],
  ['email', 'Email'],
  ['address', 'Office Address'],
  ['hours', 'Business Hours'],
  ['linkedin', 'LinkedIn URL'],
  ['instagram', 'Instagram URL'],
  ['youtube', 'YouTube URL'],
];

export default function ContentManager({ adminKey }) {
  const [site, setSite] = useState(SITE);
  const [stats, setStats] = useState(STATS);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/content`).then((r) => {
      if (r.data.site) setSite({ ...SITE, ...r.data.site });
      if (r.data.stats?.length === 4) setStats(r.data.stats);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/content`, { site, stats }, { headers: { 'X-Admin-Key': adminKey } });
      toast.success('Site content saved — live across the website.');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <p className="font-mono text-sm text-slate-400">Loading…</p>;

  return (
    <div className="bg-white border border-navy/10 p-8" data-testid="content-manager">
      <h2 className="font-serif text-2xl text-navy mb-2">Site Content</h2>
      <p className="text-sm text-slate-500 mb-8">These details appear across the whole website — header, footer, contact page and homepage. Changes go live immediately after saving.</p>

      <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-4">Company Details</h3>
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        {SITE_FIELDS.map(([key, label]) => (
          <div key={key} className={key === 'tagline' || key === 'address' ? 'sm:col-span-2' : ''}>
            <label className={labelCls}>{label}</label>
            <input
              data-testid={`content-input-${key}`}
              className={inputCls}
              value={site[key] || ''}
              onChange={(e) => setSite({ ...site, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gold mb-4">Homepage Statistics</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="border border-navy/10 p-4">
            <label className={labelCls}>Value</label>
            <input
              data-testid={`content-stat-value-${i}`}
              className={`${inputCls} mb-3`}
              value={s.value}
              onChange={(e) => setStats(stats.map((x, xi) => (xi === i ? { ...x, value: e.target.value } : x)))}
            />
            <label className={labelCls}>Label</label>
            <input
              data-testid={`content-stat-label-${i}`}
              className={inputCls}
              value={s.label}
              onChange={(e) => setStats(stats.map((x, xi) => (xi === i ? { ...x, label: e.target.value } : x)))}
            />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} data-testid="content-save-btn" className="bg-gold text-navy text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Site Content'}
      </button>
    </div>
  );
}
