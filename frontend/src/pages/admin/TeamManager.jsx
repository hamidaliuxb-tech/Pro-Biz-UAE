import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft, Users, Check } from 'lucide-react';
import { DEFAULT_TEAM } from '@/data/team';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const EMPTY = {
  name: '',
  role: '',
  linkedin: 'https://www.linkedin.com',
  background: '',
  disciplinesText: '',
};

export default function TeamManager() {
  const [team, setTeam] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_team_members');
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.filter(
          (m) => !['team-1', 'team-2', 'team-3'].includes(m.id) && m.name !== 'O. Al Mansoori' && m.name !== 'E. Vasquez' && m.name !== 'J. Whitfield'
        );
      }
      return DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const startEdit = (m) => setForm({
    ...m,
    disciplinesText: (m.expertise || []).join(', '),
  });

  const save = () => {
    if (!form.name || !form.role) {
      toast.error('Adviser name and role are required.');
      return;
    }
    setSaving(true);
    const updatedMember = {
      id: form.id || 'team-' + Date.now(),
      name: form.name.trim(),
      role: form.role.trim(),
      linkedin: form.linkedin?.trim() || 'https://www.linkedin.com',
      background: form.background?.trim() || '',
      expertise: (form.disciplinesText || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    let nextTeam;
    if (form.id) {
      nextTeam = team.map((m) => (m.id === form.id ? updatedMember : m));
    } else {
      nextTeam = [...team, updatedMember];
    }

    setTeam(nextTeam);
    try {
      localStorage.setItem('probiz_team_members', JSON.stringify(nextTeam));
      toast.success('Adviser profile saved — live on the Leadership page.');
    } catch {
      toast.error('Failed to persist team profile.');
    } finally {
      setSaving(false);
      setForm(null);
    }
  };

  const remove = (m) => {
    if (!window.confirm(`Remove "${m.name}" from Leadership? This cannot be undone.`)) return;
    const nextTeam = team.filter((x) => x.id !== m.id);
    setTeam(nextTeam);
    try {
      localStorage.setItem('probiz_team_members', JSON.stringify(nextTeam));
      toast.success('Adviser profile removed.');
    } catch {
      toast.error('Failed to update team.');
    }
  };

  const resetDefaults = () => {
    if (!window.confirm('Reset team profiles to initial default members?')) return;
    setTeam(DEFAULT_TEAM);
    localStorage.removeItem('probiz_team_members');
    toast.success('Reset to default team.');
  };

  if (form) {
    return (
      <div className="bg-white border border-navy/10 p-8" data-testid="team-editor">
        <button
          onClick={() => setForm(null)}
          data-testid="team-editor-back-btn"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-gold mb-8"
        >
          <ArrowLeft size={14} /> Back to Team List
        </button>
        <h2 className="font-serif text-2xl text-navy mb-8">
          {form.id ? `Edit Adviser — ${form.name}` : 'New Leadership Member'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              data-testid="team-input-name"
              className={inputCls}
              placeholder="e.g. Tariq Al Nuaimi"
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div>
            <label className={labelCls}>Role / Designation *</label>
            <input
              data-testid="team-input-role"
              className={inputCls}
              placeholder="e.g. Senior Partner, Corporate Advisory"
              value={form.role}
              onChange={set('role')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>LinkedIn Profile URL</label>
            <input
              data-testid="team-input-linkedin"
              className={inputCls}
              placeholder="https://www.linkedin.com/in/..."
              value={form.linkedin}
              onChange={set('linkedin')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Professional Background / Bio</label>
            <textarea
              rows={4}
              data-testid="team-input-background"
              className={inputCls}
              placeholder="Summary of experience, advisory background, and client representation..."
              value={form.background}
              onChange={set('background')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Key Disciplines & Expertise (Comma separated)</label>
            <input
              data-testid="team-input-expertise"
              className={inputCls}
              placeholder="Corporate Structuring, UAE Market Entry, Banking Coordination, Free Zones"
              value={form.disciplinesText}
              onChange={set('disciplinesText')}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            data-testid="team-save-btn"
            className="bg-gold text-white text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Check size={16} /> {saving ? 'Saving…' : 'Save Adviser'}
          </button>
          <button
            onClick={() => setForm(null)}
            data-testid="team-cancel-btn"
            className="border border-navy/20 text-navy text-sm px-8 py-3.5 hover:border-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="team-manager">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-navy">Leadership & Team</h2>
          <p className="text-sm text-slate-500 mt-1">{team.length} advisers published on the Leadership page</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDefaults}
            className="border border-navy/15 text-slate-500 text-xs font-mono uppercase tracking-wider px-4 py-2.5 hover:text-navy hover:border-navy transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={() => setForm({ ...EMPTY, id: null })}
            data-testid="team-new-btn"
            className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-5 py-2.5 hover:bg-navy-700 transition-colors"
          >
            <Plus size={15} /> Add Adviser
          </button>
        </div>
      </div>

      <div className="bg-white border border-navy/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]" data-testid="team-table">
          <thead>
            <tr className="bg-navy text-cream text-left">
              {['Adviser Name', 'Role & Designation', 'Expertise Tags', 'Actions'].map((h) => (
                <th key={h} className="p-4 text-xs font-mono uppercase tracking-[0.15em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.map((m, idx) => (
              <tr key={m.id || m.name} className="border-t border-navy/10 hover:bg-cream/60" data-testid={`team-row-${idx}`}>
                <td className="p-4">
                  <p className="font-medium text-navy text-base">{m.name}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-sm mt-0.5">{m.background}</p>
                </td>
                <td className="p-4 text-xs font-mono text-gold font-medium">{m.role}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {(m.expertise || []).map((e) => (
                      <span key={e} className="text-[10px] bg-slate-100 px-2 py-0.5 text-slate-600 border border-slate-200">{e}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(m)}
                      className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-gold hover:text-gold transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    >
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
