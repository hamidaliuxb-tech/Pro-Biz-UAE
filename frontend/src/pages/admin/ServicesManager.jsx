import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { API } from '@/lib/api';
import { SERVICE_GROUPS } from '@/data/services';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const pairs = (s) => lines(s).map((l) => l.split('|').map((x) => x.trim()));
const faqsToText = (faqs = []) => faqs.map((f) => `${f.q} | ${f.a}`).join('\n');
const processToText = (steps = []) => steps.map((p) => `${p.title} | ${p.text}`).join('\n');
const timelineToText = (rows = []) => rows.map((t) => `${t.phase} | ${t.duration}`).join('\n');
const textToFaqs = (s) => pairs(s).filter((r) => r.length === 2).map(([q, a]) => ({ q: q.trim(), a: a.trim() }));
const textToProcess = (s) => pairs(s).filter((r) => r.length === 2).map(([title, text]) => ({ title: title.trim(), text: text.trim() }));
const textToTimeline = (s) => pairs(s).filter((r) => r.length === 2).map(([phase, duration]) => ({ phase: phase.trim(), duration: duration.trim() }));

const EMPTY = {
  title: '', slug: '', group: SERVICE_GROUPS[0].id, summary: '', what: '', why: '',
  role: '', partners: '', order: 99,
  whoText: '', considerationsText: '', documentsText: '',
  processText: '', timelineText: '', faqsText: '',
};

export default function ServicesManager({ adminKey }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const headers = { 'X-Admin-Key': adminKey };

  const load = () => axios.get(`${API}/services`)
    .then((r) => setServices(r.data))
    .catch(() => toast.error('Failed to load services'));

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (s) => setForm({
    ...s,
    whoText: (s.who || []).join('\n'),
    considerationsText: (s.considerations || []).join('\n'),
    documentsText: (s.documents || []).join('\n'),
    processText: processToText(s.process),
    timelineText: timelineToText(s.timeline),
    faqsText: faqsToText(s.faqs),
  });

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Title and slug are required.'); return; }
    setSaving(true);
    const payload = {
      slug: form.slug, group: form.group, title: form.title, summary: form.summary,
      what: form.what, why: form.why, role: form.role, partners: form.partners,
      order: Number(form.order) || 0,
      who: lines(form.whoText),
      considerations: lines(form.considerationsText),
      documents: lines(form.documentsText),
      process: textToProcess(form.processText),
      timeline: textToTimeline(form.timelineText),
      faqs: textToFaqs(form.faqsText),
    };
    try {
      if (form.id) await axios.put(`${API}/services/${form.id}`, payload, { headers });
      else await axios.post(`${API}/services`, payload, { headers });
      toast.success('Service saved — live on the site.');
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/services/${s.id}`, { headers });
      toast.success('Service deleted.');
      load();
    } catch {
      toast.error('Delete failed.');
    }
  };

  if (form) {
    return (
      <div className="bg-white border border-navy/10 p-8" data-testid="services-editor">
        <button onClick={() => setForm(null)} data-testid="services-editor-back-btn" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-gold mb-8">
          <ArrowLeft size={14} /> Back to Services
        </button>
        <h2 className="font-serif text-2xl text-navy mb-8">{form.id ? `Edit — ${form.title}` : 'New Service'}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Service Title *</label>
            <input data-testid="service-input-title" className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.id ? f.slug : e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))} />
          </div>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input data-testid="service-input-slug" className={inputCls} value={form.slug} onChange={set('slug')} />
          </div>
          <div>
            <label className={labelCls}>Practice Group</label>
            <select data-testid="service-select-group" className={inputCls} value={form.group} onChange={set('group')}>
              {SERVICE_GROUPS.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Display Order</label>
            <input type="number" data-testid="service-input-order" className={inputCls} value={form.order} onChange={set('order')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Summary (shown on cards)</label>
            <input data-testid="service-input-summary" className={inputCls} value={form.summary} onChange={set('summary')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>What the Service Is</label>
            <textarea rows={3} data-testid="service-input-what" className={inputCls} value={form.what} onChange={set('what')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Why It Matters</label>
            <textarea rows={3} data-testid="service-input-why" className={inputCls} value={form.why} onChange={set('why')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Our Role</label>
            <textarea rows={3} data-testid="service-input-role" className={inputCls} value={form.role} onChange={set('role')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Professional Partners Note</label>
            <textarea rows={2} data-testid="service-input-partners" className={inputCls} value={form.partners} onChange={set('partners')} />
          </div>
          <div>
            <label className={labelCls}>Who Needs It (one per line)</label>
            <textarea rows={4} data-testid="service-input-who" className={`${inputCls} text-xs`} value={form.whoText} onChange={set('whoText')} />
          </div>
          <div>
            <label className={labelCls}>Key Considerations (one per line)</label>
            <textarea rows={4} data-testid="service-input-considerations" className={`${inputCls} text-xs`} value={form.considerationsText} onChange={set('considerationsText')} />
          </div>
          <div>
            <label className={labelCls}>Process Steps — Title | Text (one per line)</label>
            <textarea rows={4} data-testid="service-input-process" className={`${inputCls} font-mono text-xs`} value={form.processText} onChange={set('processText')} />
          </div>
          <div>
            <label className={labelCls}>Timeline — Phase | Duration (one per line)</label>
            <textarea rows={4} data-testid="service-input-timeline" className={`${inputCls} font-mono text-xs`} value={form.timelineText} onChange={set('timelineText')} />
          </div>
          <div>
            <label className={labelCls}>Typical Documents (one per line)</label>
            <textarea rows={4} data-testid="service-input-documents" className={`${inputCls} text-xs`} value={form.documentsText} onChange={set('documentsText')} />
          </div>
          <div>
            <label className={labelCls}>FAQs — Question | Answer (one per line)</label>
            <textarea rows={4} data-testid="service-input-faqs" className={`${inputCls} font-mono text-xs`} value={form.faqsText} onChange={set('faqsText')} />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={save} disabled={saving} data-testid="service-save-btn" className="bg-gold text-white text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Service'}
          </button>
          <button onClick={() => setForm(null)} data-testid="service-cancel-btn" className="border border-navy/20 text-navy text-sm px-8 py-3.5 hover:border-gold transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="services-manager">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500">{services.length} services live on the website</p>
        <button onClick={() => setForm({ ...EMPTY, id: null })} data-testid="services-new-btn" className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-5 py-2.5 hover:bg-uaegreen transition-colors">
          <Plus size={15} /> New Service
        </button>
      </div>
      <div className="bg-white border border-navy/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]" data-testid="services-table">
          <thead>
            <tr className="bg-navy text-cream text-left">
              {['Service', 'Practice Group', 'Slug', 'Actions'].map((h) => (
                <th key={h} className="p-4 text-xs font-mono uppercase tracking-[0.15em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-navy/10 hover:bg-cream/60" data-testid={`service-row-${s.slug}`}>
                <td className="p-4 font-medium text-navy">{s.title}</td>
                <td className="p-4 text-xs text-slate-600">{SERVICE_GROUPS.find((g) => g.id === s.group)?.title || s.group}</td>
                <td className="p-4 text-xs font-mono text-slate-400">/services/{s.slug}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(s)} data-testid={`service-edit-${s.slug}`} className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-uaegreen hover:text-uaegreen transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => remove(s)} data-testid={`service-delete-${s.slug}`} className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
