import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { API } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { supabase } from '@/lib/supabase';
import { INSIGHTS } from '@/data/insights';

const CATEGORIES = ['UAE Business', 'Corporate', 'Finance', 'Tax & Compliance', 'Investment'];

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

function parseBody(text) {
  const blocks = [];
  let list = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) { list = null; continue; }
    if (line.startsWith('## ')) { list = null; blocks.push({ t: 'h2', x: line.slice(3) }); }
    else if (line.startsWith('> ')) { list = null; blocks.push({ t: 'quote', x: line.slice(2) }); }
    else if (line.startsWith('- ')) {
      if (!list) { list = { t: 'list', items: [] }; blocks.push(list); }
      list.items.push(line.slice(2));
    } else { list = null; blocks.push({ t: 'p', x: line }); }
  }
  return blocks;
}

function bodyToText(blocks = []) {
  return blocks.map((b) => {
    if (b.t === 'h2') return `## ${b.x}`;
    if (b.t === 'quote') return `> ${b.x}`;
    if (b.t === 'list') return b.items.map((i) => `- ${i}`).join('\n');
    return b.x;
  }).join('\n\n');
}

const EMPTY = {
  title: '', slug: '', category: 'UAE Business', excerpt: '',
  author: 'Pro Biz UAE Advisory Desk', author_role: '',
  published_at: new Date().toISOString().slice(0, 10), reading_time: '5 min read',
  image: '', related: '', body: '',
};

const slugify = (t) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function InsightsManager({ adminKey }) {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const headers = { 'X-Admin-Key': adminKey };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, adminKey);
      setForm((f) => ({ ...f, image: publicUrl }));
      toast.success('Image uploaded successfully.');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const load = async () => {
    try {
      const r = await axios.get(`${API}/insights`, { timeout: 2000 });
      if (Array.isArray(r.data) && r.data.length > 0) {
        setArticles(r.data.sort((a, b) => (b.published_at || '').localeCompare(a.published_at || '')));
        return;
      }
    } catch {}

    try {
      const { data, error } = await supabase.from('insights').select('*').order('published_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        setArticles(data);
        return;
      }
    } catch {}

    setArticles(INSIGHTS);
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Title and slug are required.'); return; }
    setSaving(true);
    const payload = {
      title: form.title, slug: form.slug, category: form.category, excerpt: form.excerpt,
      author: form.author, author_role: form.author_role, published_at: form.published_at,
      reading_time: form.reading_time, image: form.image,
      related: form.related ? form.related.split(',').map((s) => s.trim()).filter(Boolean) : [],
      content: parseBody(form.body),
    };
    try {
      let saved = false;
      try {
        if (form.id) await axios.put(`${API}/insights/${form.id}`, payload, { headers, timeout: 2500 });
        else await axios.post(`${API}/insights`, payload, { headers, timeout: 2500 });
        saved = true;
      } catch (backendErr) {}

      if (!saved) {
        if (form.id) {
          const { error } = await supabase.from('insights').update(payload).eq('id', form.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('insights').insert([payload]);
          if (error) throw error;
        }
      }

      toast.success('Article saved — live on the site.');
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      let deleted = false;
      try {
        await axios.delete(`${API}/insights/${a.id}`, { headers, timeout: 2500 });
        deleted = true;
      } catch {}

      if (!deleted) {
        const { error } = await supabase.from('insights').delete().eq('id', a.id);
        if (error) throw error;
      }

      toast.success('Article deleted.');
      load();
    } catch {
      toast.error('Delete failed.');
    }
  };

  if (form) {
    return (
      <div className="bg-white border border-navy/10 p-8" data-testid="insights-editor">
        <button onClick={() => setForm(null)} data-testid="insights-editor-back-btn" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-gold mb-8">
          <ArrowLeft size={14} /> Back to Articles
        </button>
        <h2 className="font-serif text-2xl text-navy mb-8">{form.id ? 'Edit Article' : 'New Article'}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Title *</label>
            <input data-testid="insight-input-title" className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.id ? f.slug : slugify(e.target.value) }))} />
          </div>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input data-testid="insight-input-slug" className={inputCls} value={form.slug} onChange={set('slug')} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select data-testid="insight-select-category" className={inputCls} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Featured Image</label>
            <div className="flex gap-2">
              <input data-testid="insight-input-image" className={inputCls} value={form.image} onChange={set('image')} placeholder="https://… or upload file" />
              <label className="shrink-0 bg-navy hover:bg-gold text-cream hover:text-white px-4 py-3 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors duration-300 flex items-center justify-center">
                {uploading ? 'Uploading…' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {form.image && (
              <div className="mt-2 relative w-28 h-16 border border-navy/10 overflow-hidden bg-slate-100">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className={labelCls}>Author</label>
            <input data-testid="insight-input-author" className={inputCls} value={form.author} onChange={set('author')} />
          </div>
          <div>
            <label className={labelCls}>Author Role</label>
            <input data-testid="insight-input-author-role" className={inputCls} value={form.author_role} onChange={set('author_role')} />
          </div>
          <div>
            <label className={labelCls}>Publication Date</label>
            <input type="date" data-testid="insight-input-date" className={inputCls} value={form.published_at} onChange={set('published_at')} />
          </div>
          <div>
            <label className={labelCls}>Reading Time</label>
            <input data-testid="insight-input-reading-time" className={inputCls} value={form.reading_time} onChange={set('reading_time')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Excerpt</label>
            <textarea rows={2} data-testid="insight-input-excerpt" className={inputCls} value={form.excerpt} onChange={set('excerpt')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Related Article Slugs (comma separated)</label>
            <input data-testid="insight-input-related" className={inputCls} value={form.related} onChange={set('related')} placeholder="slug-one, slug-two" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Article Body</label>
            <textarea rows={16} data-testid="insight-input-body" className={`${inputCls} font-mono text-xs leading-relaxed`} value={form.body} onChange={set('body')} />
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Formatting: blank line = new paragraph · <code>## Heading</code> = section heading · <code>&gt; quote</code> = pull quote · <code>- item</code> = bullet list
            </p>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={save} disabled={saving} data-testid="insight-save-btn" className="bg-gold text-white text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Article'}
          </button>
          <button onClick={() => setForm(null)} data-testid="insight-cancel-btn" className="border border-navy/20 text-navy text-sm px-8 py-3.5 hover:border-gold transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="insights-manager">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500">{articles.length} articles published</p>
        <button onClick={() => setForm({ ...EMPTY, id: null })} data-testid="insights-new-btn" className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-5 py-2.5 hover:bg-navy-700 transition-colors">
          <Plus size={15} /> New Article
        </button>
      </div>
      <div className="bg-white border border-navy/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]" data-testid="insights-table">
          <thead>
            <tr className="bg-navy text-cream text-left">
              {['Title', 'Category', 'Published', 'Reading', 'Actions'].map((h) => (
                <th key={h} className="p-4 text-xs font-mono uppercase tracking-[0.15em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-navy/10 hover:bg-cream/60" data-testid={`insight-row-${a.slug}`}>
                <td className="p-4">
                  <p className="font-medium text-navy">{a.title}</p>
                  <p className="text-xs text-slate-400 font-mono">/insights/{a.slug}</p>
                </td>
                <td className="p-4 text-xs text-slate-600">{a.category}</td>
                <td className="p-4 text-xs font-mono text-slate-500">{a.published_at}</td>
                <td className="p-4 text-xs text-slate-500">{a.reading_time}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => setForm({ ...a, related: (a.related || []).join(', '), body: bodyToText(a.content), id: a.id })} data-testid={`insight-edit-${a.slug}`} className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-gold hover:text-gold transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => remove(a)} data-testid={`insight-delete-${a.slug}`} className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={12} /> Delete
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
