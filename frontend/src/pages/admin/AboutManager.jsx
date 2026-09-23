import { useState } from 'react';
import { toast } from 'sonner';
import { Save, RotateCcw, Plus, Trash2, Pencil, BookOpen, Target, Eye, Sparkles } from 'lucide-react';
import { DEFAULT_ABOUT } from '@/data/about';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

export default function AboutManager() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_about_data');
      return cached ? JSON.parse(cached) : DEFAULT_ABOUT;
    } catch {
      return DEFAULT_ABOUT;
    }
  });

  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero'); // 'hero', 'story', 'mission', 'values', 'stats'

  // Form states for adding/editing a Value
  const [editingValueIdx, setEditingValueIdx] = useState(null);
  const [valueForm, setValueForm] = useState({ title: '', text: '' });

  const persist = (updatedData) => {
    setData(updatedData);
    try {
      localStorage.setItem('probiz_about_data', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));
      toast.success('About page content saved — live on /about');
      return true;
    } catch {
      toast.error('Failed to save to local storage.');
      return false;
    }
  };

  const handleHeroChange = (k, v) => {
    const updated = {
      ...data,
      hero: { ...data.hero, [k]: v },
    };
    setData(updated);
  };

  const handleStoryChange = (k, v) => {
    const updated = {
      ...data,
      story: { ...data.story, [k]: v },
    };
    setData(updated);
  };

  const handleStatChange = (idx, k, v) => {
    const nextStats = [...(data.stats || [])];
    nextStats[idx] = { ...nextStats[idx], [k]: v };
    const updated = { ...data, stats: nextStats };
    setData(updated);
  };

  const saveAll = () => {
    setSaving(true);
    persist(data);
    setSaving(false);
  };

  const resetDefaults = () => {
    if (!window.confirm('Reset all About page sections to original default text?')) return;
    setData(DEFAULT_ABOUT);
    localStorage.removeItem('probiz_about_data');
    window.dispatchEvent(new Event('storage'));
    toast.success('Reset About page to default.');
  };

  const startAddValue = () => {
    setEditingValueIdx('new');
    setValueForm({ title: '', text: '' });
  };

  const startEditValue = (idx) => {
    setEditingValueIdx(idx);
    setValueForm({ ...data.values[idx] });
  };

  const saveValue = () => {
    if (!valueForm.title.trim() || !valueForm.text.trim()) {
      toast.error('Value title and description are required.');
      return;
    }
    const nextValues = [...(data.values || [])];
    if (editingValueIdx === 'new') {
      nextValues.push({ title: valueForm.title.trim(), text: valueForm.text.trim() });
    } else {
      nextValues[editingValueIdx] = { title: valueForm.title.trim(), text: valueForm.text.trim() };
    }
    const updated = { ...data, values: nextValues };
    persist(updated);
    setEditingValueIdx(null);
  };

  const deleteValue = (idx) => {
    if (!window.confirm('Delete this standard / value?')) return;
    const nextValues = data.values.filter((_, i) => i !== idx);
    const updated = { ...data, values: nextValues };
    persist(updated);
  };

  return (
    <div className="space-y-8" data-testid="about-manager">
      {/* Top Header */}
      <div className="bg-white border border-navy/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold font-medium">Page Content Manager</span>
          <h2 className="font-serif text-2xl text-navy mt-1">About Firm Page Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control Hero, Company Story, Mission & Vision, Core Standards, and Metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetDefaults}
            className="border border-navy/15 px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-navy hover:border-navy transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={12} /> Reset Defaults
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-navy text-cream px-5 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700 transition-colors inline-flex items-center gap-2"
          >
            <Save size={13} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex gap-2 border-b border-navy/10 pb-1 overflow-x-auto no-scrollbar">
        {[
          ['hero', 'Page Hero', BookOpen],
          ['story', 'Our Story', BookOpen],
          ['mission', 'Mission & Vision', Target],
          ['values', 'Standards & Values', Sparkles],
          ['stats', 'Firm in Numbers', Eye],
        ].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeSection === id ? 'border-gold text-navy font-semibold bg-white' : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Icon size={14} className={activeSection === id ? 'text-gold' : 'text-slate-400'} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero */}
      {activeSection === 'hero' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <h3 className="font-serif text-xl text-navy">Page Hero Header</h3>
          <div>
            <label className={labelCls}>Hero Overline</label>
            <input
              className={inputCls}
              value={data.hero?.overline || ''}
              onChange={(e) => handleHeroChange('overline', e.target.value)}
              placeholder="e.g. About Pro Biz UAE"
            />
          </div>
          <div>
            <label className={labelCls}>Hero Main Title</label>
            <input
              className={inputCls}
              value={data.hero?.title || ''}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              placeholder="e.g. Built on Experience. Driven by Integrity."
            />
          </div>
          <div>
            <label className={labelCls}>Hero Description / Philosophy</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.hero?.text || ''}
              onChange={(e) => handleHeroChange('text', e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={saveAll} className="bg-navy text-cream px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-navy-700">
              Save Hero
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Story */}
      {activeSection === 'story' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <h3 className="font-serif text-xl text-navy">Our Story Section</h3>
          <div>
            <label className={labelCls}>Story Section Heading</label>
            <input
              className={inputCls}
              value={data.story?.heading || ''}
              onChange={(e) => handleStoryChange('heading', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Story Paragraph 1</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.story?.p1 || ''}
              onChange={(e) => handleStoryChange('p1', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Story Paragraph 2</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.story?.p2 || ''}
              onChange={(e) => handleStoryChange('p2', e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={saveAll} className="bg-navy text-cream px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-navy-700">
              Save Story
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Mission & Vision */}
      {activeSection === 'mission' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <h3 className="font-serif text-xl text-navy">Mission & Vision Statements</h3>
          <div>
            <label className={labelCls}>Our Mission Statement</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.mission || ''}
              onChange={(e) => setData({ ...data, mission: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>Our Vision Statement</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.vision || ''}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={saveAll} className="bg-navy text-cream px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-navy-700">
              Save Mission & Vision
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Values / Standards */}
      {activeSection === 'values' && (
        <div className="space-y-6">
          <div className="bg-white border border-navy/10 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-navy">Standards & Core Principles ({data.values?.length || 0})</h3>
              <p className="text-xs text-slate-400 mt-1">Displayed in &quot;How We Work&quot; on the About page</p>
            </div>
            <button
              onClick={startAddValue}
              className="inline-flex items-center gap-1.5 bg-navy text-cream px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700"
            >
              <Plus size={13} /> Add Standard
            </button>
          </div>

          {editingValueIdx !== null && (
            <div className="bg-white border-2 border-gold/40 p-6 space-y-4">
              <h4 className="font-serif text-lg text-navy">
                {editingValueIdx === 'new' ? 'New Standard' : 'Edit Standard'}
              </h4>
              <div>
                <label className={labelCls}>Title / Standard Name *</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Regulatory Awareness"
                  value={valueForm.title}
                  onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Explanation Text *</label>
                <textarea
                  rows={4}
                  className={inputCls}
                  placeholder="Detailed explanation of this operational standard..."
                  value={valueForm.text}
                  onChange={(e) => setValueForm({ ...valueForm, text: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingValueIdx(null)}
                  className="border border-navy/20 px-4 py-2 text-xs font-mono text-slate-500 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={saveValue}
                  className="bg-navy text-cream px-5 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700"
                >
                  Save Standard
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {(data.values || []).map((v, i) => (
              <div key={i} className="bg-white border border-navy/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-gold font-bold">0{i + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditValue(i)}
                        className="text-slate-400 hover:text-gold transition-colors p-1"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteValue(i)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-serif text-lg text-navy mb-2">{v.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Stats */}
      {activeSection === 'stats' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <div>
            <h3 className="font-serif text-xl text-navy">The Firm in Numbers (Key Metrics)</h3>
            <p className="text-xs text-slate-400 mt-1">Displayed on the About page and Homepage stats bar</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {(data.stats || []).map((s, idx) => (
              <div key={idx} className="border border-navy/10 p-5 bg-cream/30 space-y-3">
                <span className="text-[10px] font-mono text-gold font-semibold uppercase tracking-widest">Metric 0{idx + 1}</span>
                <div>
                  <label className={labelCls}>Metric Value</label>
                  <input
                    className={inputCls}
                    value={s.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="e.g. 150+"
                  />
                </div>
                <div>
                  <label className={labelCls}>Metric Label</label>
                  <input
                    className={inputCls}
                    value={s.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="e.g. Businesses Supported"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={saveAll} className="bg-navy text-cream px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-navy-700">
              Save Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
