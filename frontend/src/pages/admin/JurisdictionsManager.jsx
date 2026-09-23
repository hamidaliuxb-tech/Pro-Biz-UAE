import { useState } from 'react';
import { toast } from 'sonner';
import { Save, RotateCcw, Plus, Trash2, Pencil, Globe, Layers, Table, BookOpen } from 'lucide-react';
import { DEFAULT_JURISDICTIONS } from '@/data/jurisdictions';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

export default function JurisdictionsManager() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_jurisdictions_data');
      return cached ? JSON.parse(cached) : DEFAULT_JURISDICTIONS;
    } catch {
      return DEFAULT_JURISDICTIONS;
    }
  });

  const [activeTab, setActiveTab] = useState('chips'); // 'hero', 'chips', 'matrix'
  const [newChip, setNewChip] = useState('');
  const [editingRowIdx, setEditingRowIdx] = useState(null); // null or index or 'new'
  const [rowForm, setRowForm] = useState({
    label: '',
    mainland: '',
    freezone: '',
    financial: '',
    international: '',
  });

  const persist = (updatedData) => {
    setData(updatedData);
    try {
      localStorage.setItem('probiz_jurisdictions_data', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('storage'));
      toast.success('Jurisdictions content saved — live on /jurisdictions');
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

  const saveHero = () => {
    persist(data);
  };

  const addChip = (e) => {
    e.preventDefault();
    const clean = newChip.trim();
    if (!clean) return;
    if ((data.chips || []).includes(clean)) {
      toast.error('This jurisdiction is already listed.');
      return;
    }
    const nextChips = [...(data.chips || []), clean];
    const updated = { ...data, chips: nextChips };
    persist(updated);
    setNewChip('');
  };

  const removeChip = (chip) => {
    if (!window.confirm('Remove jurisdiction "' + chip + '"?')) return;
    const nextChips = (data.chips || []).filter((c) => c !== chip);
    const updated = { ...data, chips: nextChips };
    persist(updated);
  };

  const startEditRow = (idx) => {
    const r = data.rows[idx];
    setEditingRowIdx(idx);
    setRowForm({
      label: r.label,
      mainland: r.values?.mainland || '',
      freezone: r.values?.freezone || '',
      financial: r.values?.financial || '',
      international: r.values?.international || '',
    });
  };

  const startAddRow = () => {
    setEditingRowIdx('new');
    setRowForm({
      label: '',
      mainland: '',
      freezone: '',
      financial: '',
      international: '',
    });
  };

  const saveRow = () => {
    if (!rowForm.label.trim()) {
      toast.error('Criteria name is required.');
      return;
    }

    const nextRow = {
      label: rowForm.label.trim(),
      values: {
        mainland: rowForm.mainland.trim(),
        freezone: rowForm.freezone.trim(),
        financial: rowForm.financial.trim(),
        international: rowForm.international.trim(),
      },
    };

    const nextRows = [...(data.rows || [])];
    if (editingRowIdx === 'new') {
      nextRows.push(nextRow);
    } else {
      nextRows[editingRowIdx] = nextRow;
    }

    const updated = { ...data, rows: nextRows };
    persist(updated);
    setEditingRowIdx(null);
  };

  const deleteRow = (idx) => {
    const r = data.rows[idx];
    if (!window.confirm('Delete comparison criteria "' + r.label + '"?')) return;
    const nextRows = data.rows.filter((_, i) => i !== idx);
    const updated = { ...data, rows: nextRows };
    persist(updated);
  };

  const resetDefaults = () => {
    if (!window.confirm('Reset all Jurisdictions data to official default matrix?')) return;
    setData(DEFAULT_JURISDICTIONS);
    localStorage.removeItem('probiz_jurisdictions_data');
    window.dispatchEvent(new Event('storage'));
    toast.success('Reset Jurisdictions to default.');
  };

  return (
    <div className="space-y-8" data-testid="jurisdictions-manager">
      {/* Top Header */}
      <div className="bg-white border border-navy/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold font-medium">Page Content Manager</span>
          <h2 className="font-serif text-2xl text-navy mt-1">Jurisdictions Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control Hero, Advised Ecosystem Chips, and Interactive Comparison Matrix</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetDefaults}
            className="border border-navy/15 px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-navy hover:border-navy transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={12} /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-navy/10 pb-1 overflow-x-auto no-scrollbar">
        {[
          ['chips', 'Advised Ecosystem Chips', Layers],
          ['matrix', 'Comparison Matrix Table', Table],
          ['hero', 'Page Hero Header', BookOpen],
        ].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeTab === id ? 'border-gold text-navy font-semibold bg-white' : 'border-transparent text-slate-500 hover:text-navy'
            }`}
          >
            <Icon size={14} className={activeTab === id ? 'text-gold' : 'text-slate-400'} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Chips */}
      {activeTab === 'chips' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl text-navy">Jurisdictions We Advise Across</h3>
              <p className="text-xs text-slate-500 mt-1">Displayed as interactive badges on /jurisdictions</p>
            </div>
            <form onSubmit={addChip} className="flex gap-2">
              <input
                className="bg-white border border-navy/15 px-4 py-2 text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold w-64"
                placeholder="e.g. Dubai South or Masdar City"
                value={newChip}
                onChange={(e) => setNewChip(e.target.value)}
              />
              <button
                type="submit"
                className="bg-navy text-cream px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus size={13} /> Add Chip
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-4">
            {(data.chips || []).map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 border border-navy/15 bg-cream/50 px-4 py-2 text-xs text-navy font-medium group hover:border-gold transition-colors"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeChip(c)}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                  title="Remove chip"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white border border-navy/10 p-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-navy">Interactive Comparison Matrix Rows ({data.rows?.length || 0})</h3>
              <p className="text-xs text-slate-400 mt-1">Comparison criteria across Mainland, Free Zone, Financial Free Zone & International</p>
            </div>
            <button
              onClick={startAddRow}
              className="inline-flex items-center gap-1.5 bg-navy text-cream px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700"
            >
              <Plus size={13} /> Add Criteria Row
            </button>
          </div>

          {editingRowIdx !== null && (
            <div className="bg-white border-2 border-gold/40 p-6 space-y-4">
              <h4 className="font-serif text-lg text-navy">
                {editingRowIdx === 'new' ? 'New Comparison Criteria' : 'Edit Criteria: ' + data.rows[editingRowIdx]?.label}
              </h4>
              <div>
                <label className={labelCls}>Criteria Name / Label *</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Visa Quotas & Substance"
                  value={rowForm.label}
                  onChange={(e) => setRowForm({ ...rowForm, label: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>UAE Mainland Value</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Details for UAE Mainland..."
                    value={rowForm.mainland}
                    onChange={(e) => setRowForm({ ...rowForm, mainland: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Free Zone Value</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Details for Free Zone..."
                    value={rowForm.freezone}
                    onChange={(e) => setRowForm({ ...rowForm, freezone: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Financial Free Zone Value (DIFC / ADGM)</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Details for Financial Free Zone..."
                    value={rowForm.financial}
                    onChange={(e) => setRowForm({ ...rowForm, financial: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>International Value</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Details for International / Offshore..."
                    value={rowForm.international}
                    onChange={(e) => setRowForm({ ...rowForm, international: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingRowIdx(null)}
                  className="border border-navy/20 px-4 py-2 text-xs font-mono text-slate-500 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRow}
                  className="bg-navy text-cream px-5 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700"
                >
                  Save Criteria Row
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-navy/10 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-navy text-cream text-left">
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em] w-48">Criteria</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em]">Mainland</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em]">Free Zone</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em]">Financial Free Zone</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em]">International</th>
                  <th className="p-4 text-xs font-mono uppercase tracking-[0.15em] w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {(data.rows || []).map((r, idx) => (
                  <tr key={idx} className="hover:bg-cream/50 align-top">
                    <td className="p-4 font-medium text-navy text-xs">{r.label}</td>
                    <td className="p-4 text-xs text-slate-600 leading-relaxed max-w-xs">{r.values?.mainland}</td>
                    <td className="p-4 text-xs text-slate-600 leading-relaxed max-w-xs">{r.values?.freezone}</td>
                    <td className="p-4 text-xs text-slate-600 leading-relaxed max-w-xs">{r.values?.financial}</td>
                    <td className="p-4 text-xs text-slate-600 leading-relaxed max-w-xs">{r.values?.international}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditRow(idx)}
                          className="text-slate-400 hover:text-gold transition-colors p-1"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteRow(idx)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Hero */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-navy/10 p-8 space-y-6">
          <h3 className="font-serif text-xl text-navy">Page Hero Header</h3>
          <div>
            <label className={labelCls}>Hero Overline</label>
            <input
              className={inputCls}
              value={data.hero?.overline || ''}
              onChange={(e) => handleHeroChange('overline', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Hero Main Title</label>
            <input
              className={inputCls}
              value={data.hero?.title || ''}
              onChange={(e) => handleHeroChange('title', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Hero Description</label>
            <textarea
              rows={4}
              className={inputCls}
              value={data.hero?.text || ''}
              onChange={(e) => handleHeroChange('text', e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={saveHero} className="bg-navy text-cream px-5 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-navy-700">
              Save Hero
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
