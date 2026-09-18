import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { API } from '@/lib/api';
import { uploadImage } from '@/lib/upload';

const CATEGORIES = ['Corporate Websites', 'Business Websites', 'E-Commerce', 'Digital Marketing', 'Professional Services', 'Real Estate', 'Consultancy', 'Healthcare', 'Other'];

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const EMPTY = {
  title: '', client_name: '', industry: '', location: '', project_type: '',
  category: 'Corporate Websites', requirement: '', solution: '', outcome: '',
  images: '', logo: '', features: '', tech: '', url: '',
  testimonial: '', testimonial_author: '',
  published: false, confidential: false, sample: false, order: 0,
};

const toList = (s) => s.split(/\n|,/).map((x) => x.trim()).filter(Boolean);

export default function PortfolioManager({ adminKey }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const headers = { 'X-Admin-Key': adminKey };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadImage(file, adminKey);
      setForm((f) => ({
        ...f,
        images: f.images ? `${f.images}\n${publicUrl}` : publicUrl,
      }));
      toast.success('Screenshot uploaded successfully.');
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const publicUrl = await uploadImage(file, adminKey);
      setForm((f) => ({ ...f, logo: publicUrl }));
      toast.success('Logo uploaded successfully.');
    } catch (err) {
      toast.error('Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const load = () => axios.get(`${API}/admin/projects`, { headers })
    .then((r) => setProjects(r.data))
    .catch(() => toast.error('Failed to load projects'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const startEdit = (p) => setForm({
    ...p,
    images: (p.images || []).join('\n'),
    features: (p.features || []).join(', '),
    tech: (p.tech || []).join(', '),
  });

  const save = async () => {
    if (!form.title) { toast.error('Project title is required.'); return; }
    setSaving(true);
    const payload = {
      title: form.title, client_name: form.client_name, industry: form.industry,
      location: form.location, project_type: form.project_type, category: form.category,
      requirement: form.requirement, solution: form.solution, outcome: form.outcome,
      images: toList(form.images), logo: form.logo,
      features: toList(form.features), tech: toList(form.tech),
      url: form.url, testimonial: form.testimonial, testimonial_author: form.testimonial_author,
      published: form.published, confidential: form.confidential,
      sample: form.sample, order: Number(form.order) || 0,
    };
    try {
      if (form.id) await axios.put(`${API}/projects/${form.id}`, payload, { headers });
      else await axios.post(`${API}/projects`, payload, { headers });
      toast.success('Project saved.');
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/projects/${p.id}`, { headers });
      toast.success('Project deleted.');
      load();
    } catch {
      toast.error('Delete failed.');
    }
  };

  const togglePublish = async (p) => {
    try {
      await axios.put(`${API}/projects/${p.id}`, { ...p, published: !p.published }, { headers });
      toast.success(p.published ? 'Project unpublished.' : 'Project published.');
      load();
    } catch {
      toast.error('Update failed.');
    }
  };

  if (form) {
    return (
      <div className="bg-white border border-navy/10 p-8" data-testid="portfolio-editor">
        <button onClick={() => setForm(null)} data-testid="portfolio-editor-back-btn" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-gold mb-8">
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <h2 className="font-serif text-2xl text-navy mb-8">{form.id ? 'Edit Project' : 'New Project'}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Project Title *</label>
            <input data-testid="project-input-title" className={inputCls} value={form.title} onChange={set('title')} />
          </div>
          <div>
            <label className={labelCls}>Customer / Company Name</label>
            <input data-testid="project-input-client" className={inputCls} value={form.client_name} onChange={set('client_name')} />
          </div>
          <div>
            <label className={labelCls}>Industry</label>
            <input data-testid="project-input-industry" className={inputCls} value={form.industry} onChange={set('industry')} />
          </div>
          <div>
            <label className={labelCls}>Business Location</label>
            <input data-testid="project-input-location" className={inputCls} value={form.location} onChange={set('location')} placeholder="Dubai, UAE" />
          </div>
          <div>
            <label className={labelCls}>Project Type</label>
            <input data-testid="project-input-type" className={inputCls} value={form.project_type} onChange={set('project_type')} placeholder="Corporate Website, E-Commerce Store…" />
          </div>
          <div>
            <label className={labelCls}>Category (filter)</label>
            <select data-testid="project-select-category" className={inputCls} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Customer Requirement / Challenge</label>
            <textarea rows={3} data-testid="project-input-requirement" className={inputCls} value={form.requirement} onChange={set('requirement')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Solution Provided</label>
            <textarea rows={3} data-testid="project-input-solution" className={inputCls} value={form.solution} onChange={set('solution')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Project Outcome</label>
            <textarea rows={2} data-testid="project-input-outcome" className={inputCls} value={form.outcome} onChange={set('outcome')} />
          </div>
          <div className="sm:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className={labelCls + ' mb-0'}>Screenshots / Images (one URL per line)</label>
              <label className="bg-navy hover:bg-gold text-cream hover:text-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors duration-300">
                {uploadingImage ? 'Uploading…' : '+ Upload Screenshot'}
                <input type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
              </label>
            </div>
            <textarea rows={3} data-testid="project-input-images" className={`${inputCls} font-mono text-xs`} value={form.images} onChange={set('images')} placeholder="https://… or click upload screenshot above" />
          </div>
          <div>
            <label className={labelCls}>Customer Logo URL</label>
            <div className="flex gap-2">
              <input data-testid="project-input-logo" className={inputCls} value={form.logo} onChange={set('logo')} placeholder="https://… or upload" />
              <label className="shrink-0 bg-navy hover:bg-gold text-cream hover:text-white px-3 py-3 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors duration-300 flex items-center justify-center">
                {uploadingLogo ? '…' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
          </div>
          <div>
            <label className={labelCls}>Live Website URL</label>
            <input data-testid="project-input-url" className={inputCls} value={form.url} onChange={set('url')} placeholder="https://…" />
          </div>
          <div>
            <label className={labelCls}>Key Features (comma separated)</label>
            <input data-testid="project-input-features" className={inputCls} value={form.features} onChange={set('features')} />
          </div>
          <div>
            <label className={labelCls}>Technology Used (comma separated)</label>
            <input data-testid="project-input-tech" className={inputCls} value={form.tech} onChange={set('tech')} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Client Testimonial</label>
            <textarea rows={2} data-testid="project-input-testimonial" className={inputCls} value={form.testimonial} onChange={set('testimonial')} />
          </div>
          <div>
            <label className={labelCls}>Testimonial Author</label>
            <input data-testid="project-input-testimonial-author" className={inputCls} value={form.testimonial_author} onChange={set('testimonial_author')} />
          </div>
          <div>
            <label className={labelCls}>Display Order</label>
            <input type="number" data-testid="project-input-order" className={inputCls} value={form.order} onChange={set('order')} />
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-8 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" data-testid="project-checkbox-published" checked={form.published} onChange={set('published')} className="accent-[#00732F]" />
              <span className="text-sm text-navy">Published (visible on website)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" data-testid="project-checkbox-confidential" checked={form.confidential} onChange={set('confidential')} className="accent-[#00732F]" />
              <span className="text-sm text-navy">Confidential (hide client name, URL & testimonial publicly)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" data-testid="project-checkbox-sample" checked={form.sample} onChange={set('sample')} className="accent-[#00732F]" />
              <span className="text-sm text-navy">Mark as Sample / placeholder</span>
            </label>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={save} disabled={saving} data-testid="project-save-btn" className="bg-gold text-white text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <button onClick={() => setForm(null)} data-testid="project-cancel-btn" className="border border-navy/20 text-navy text-sm px-8 py-3.5 hover:border-gold transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="portfolio-manager">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500">{projects.length} projects · {projects.filter((p) => p.published).length} published</p>
        <button onClick={() => setForm({ ...EMPTY, id: null })} data-testid="portfolio-new-btn" className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-5 py-2.5 hover:bg-uaegreen transition-colors">
          <Plus size={15} /> New Project
        </button>
      </div>
      <div className="bg-white border border-navy/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]" data-testid="portfolio-table">
          <thead>
            <tr className="bg-navy text-cream text-left">
              {['Order', 'Project', 'Category', 'Status', 'Actions'].map((h) => (
                <th key={h} className="p-4 text-xs font-mono uppercase tracking-[0.15em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-navy/10 hover:bg-cream/60" data-testid={`project-row-${p.id}`}>
                <td className="p-4 font-mono text-xs text-slate-500">{p.order}</td>
                <td className="p-4">
                  <p className="font-medium text-navy">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.client_name}</p>
                </td>
                <td className="p-4 text-xs text-slate-600">{p.category}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.1em] px-2 py-1 ${p.published ? 'bg-uaegreen/10 text-uaegreen' : 'bg-navy/5 text-navy/50'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    {p.confidential && <span className="text-[10px] font-mono uppercase tracking-[0.1em] px-2 py-1 bg-gold/10 text-gold">Confidential</span>}
                    {p.sample && <span className="text-[10px] font-mono uppercase tracking-[0.1em] px-2 py-1 bg-navy/5 text-slate-500">Sample</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => togglePublish(p)} data-testid={`project-toggle-${p.id}`} className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-uaegreen hover:text-uaegreen transition-colors">
                      {p.published ? <EyeOff size={12} /> : <Eye size={12} />} {p.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => startEdit(p)} data-testid={`project-edit-${p.id}`} className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-uaegreen hover:text-uaegreen transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => remove(p)} data-testid={`project-delete-${p.id}`} className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
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
