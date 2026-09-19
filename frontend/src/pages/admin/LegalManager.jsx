import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Shield, FileText, AlertCircle, Cookie, Save, RotateCcw } from 'lucide-react';
import { LEGAL_PAGES } from '@/data/legal';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const DOC_KEYS = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle },
  { id: 'cookies', label: 'Cookie Policy', icon: Cookie },
];

export default function LegalManager() {
  const [legalDocs, setLegalDocs] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_legal_pages');
      return cached ? JSON.parse(cached) : LEGAL_PAGES;
    } catch {
      return LEGAL_PAGES;
    }
  });

  const [activeDocKey, setActiveDocKey] = useState('privacy');
  const [editingSectionIdx, setEditingSectionIdx] = useState(null);
  const [sectionForm, setSectionForm] = useState({ h: '', p: '' });
  const [docMetaForm, setDocMetaForm] = useState(null);

  const currentDoc = legalDocs[activeDocKey] || LEGAL_PAGES[activeDocKey];

  const persist = (updatedDocs) => {
    setLegalDocs(updatedDocs);
    try {
      localStorage.setItem('probiz_legal_pages', JSON.stringify(updatedDocs));
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      console.error(e);
      toast.error('Failed to save legal documents locally.');
      return false;
    }
  };

  const startEditMeta = () => {
    setDocMetaForm({
      title: currentDoc.title || '',
      subtitle: currentDoc.subtitle || '',
      updated: currentDoc.updated || '',
    });
  };

  const saveMeta = () => {
    if (!docMetaForm.title.trim()) {
      toast.error('Document title cannot be empty.');
      return;
    }
    const updated = {
      ...legalDocs,
      [activeDocKey]: {
        ...currentDoc,
        title: docMetaForm.title.trim(),
        subtitle: docMetaForm.subtitle.trim(),
        updated: docMetaForm.updated.trim(),
      },
    };
    if (persist(updated)) {
      toast.success(currentDoc.title + ' header details updated!');
      setDocMetaForm(null);
    }
  };

  const startAddSection = () => {
    const nextNum = (currentDoc.sections || []).length + 1;
    setEditingSectionIdx('new');
    setSectionForm({ h: nextNum + '. ', p: '' });
  };

  const startEditSection = (index) => {
    const sec = currentDoc.sections[index];
    setEditingSectionIdx(index);
    setSectionForm({ h: sec.h || '', p: sec.p || '' });
  };

  const saveSection = () => {
    if (!sectionForm.h.trim() || !sectionForm.p.trim()) {
      toast.error('Both section heading and paragraph text are required.');
      return;
    }

    const currentSections = [...(currentDoc.sections || [])];
    if (editingSectionIdx === 'new') {
      currentSections.push({
        h: sectionForm.h.trim(),
        p: sectionForm.p.trim(),
      });
    } else {
      currentSections[editingSectionIdx] = {
        h: sectionForm.h.trim(),
        p: sectionForm.p.trim(),
      };
    }

    const updated = {
      ...legalDocs,
      [activeDocKey]: {
        ...currentDoc,
        sections: currentSections,
      },
    };

    if (persist(updated)) {
      toast.success(editingSectionIdx === 'new' ? 'New section added!' : 'Section updated!');
      setEditingSectionIdx(null);
      setSectionForm({ h: '', p: '' });
    }
  };

  const deleteSection = (index) => {
    const sec = currentDoc.sections[index];
    if (!window.confirm('Delete section "' + sec.h + '"? This cannot be undone.')) return;

    const currentSections = currentDoc.sections.filter((_, i) => i !== index);
    const updated = {
      ...legalDocs,
      [activeDocKey]: {
        ...currentDoc,
        sections: currentSections,
      },
    };

    if (persist(updated)) {
      toast.success('Section deleted.');
    }
  };

  const moveSection = (index, direction) => {
    const targetIdx = index + direction;
    const currentSections = [...(currentDoc.sections || [])];
    if (targetIdx < 0 || targetIdx >= currentSections.length) return;

    const [removed] = currentSections.splice(index, 1);
    currentSections.splice(targetIdx, 0, removed);

    const updated = {
      ...legalDocs,
      [activeDocKey]: {
        ...currentDoc,
        sections: currentSections,
      },
    };

    if (persist(updated)) {
      toast.success('Section order updated.');
    }
  };

  const resetDocToDefault = () => {
    if (!window.confirm('Reset "' + currentDoc.title + '" to default statutory UAE PDPL legal text?')) return;

    const updated = {
      ...legalDocs,
      [activeDocKey]: LEGAL_PAGES[activeDocKey],
    };

    if (persist(updated)) {
      toast.success(currentDoc.title + ' reset to official default text.');
    }
  };

  return (
    <div className="space-y-8" data-testid="legal-manager">
      <div className="bg-white border border-navy/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-navy">Legal & Regulatory Compliance</h2>
            <p className="text-xs text-slate-400 mt-1">Manage Privacy Policy, Terms, Disclaimer & Cookie Policy pages</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DOC_KEYS.map((doc) => {
              const Icon = doc.icon;
              const active = activeDocKey === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveDocKey(doc.id);
                    setEditingSectionIdx(null);
                    setDocMetaForm(null);
                  }}
                  className={'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors border ' + (
                    active
                      ? 'bg-navy text-cream border-navy'
                      : 'border-navy/15 text-slate-500 hover:border-gold hover:text-navy'
                  )}
                >
                  <Icon size={14} className={active ? 'text-gold' : 'text-slate-400'} />
                  {doc.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-navy/10 p-6">
        {docMetaForm ? (
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-navy">Edit Document Header</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Page Title *</label>
                <input
                  className={inputCls}
                  value={docMetaForm.title}
                  onChange={(e) => setDocMetaForm({ ...docMetaForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Subtitle / Scope</label>
                <input
                  className={inputCls}
                  value={docMetaForm.subtitle}
                  onChange={(e) => setDocMetaForm({ ...docMetaForm, subtitle: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Effective Date Tag</label>
                <input
                  className={inputCls}
                  value={docMetaForm.updated}
                  onChange={(e) => setDocMetaForm({ ...docMetaForm, updated: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDocMetaForm(null)}
                className="border border-navy/20 px-4 py-2 text-xs font-mono text-slate-500 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={saveMeta}
                className="bg-navy text-cream px-5 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700"
              >
                Save Header
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold font-medium">Currently Editing</span>
              <h3 className="font-serif text-2xl text-navy mt-1">{currentDoc.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentDoc.subtitle} · <span className="font-mono text-slate-400">{currentDoc.updated}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startEditMeta}
                className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-2 text-xs text-navy hover:border-gold hover:text-gold transition-colors font-mono uppercase tracking-wider"
              >
                <Pencil size={12} /> Edit Header
              </button>
              <button
                onClick={resetDocToDefault}
                className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-2 text-xs text-slate-500 hover:text-navy hover:border-navy transition-colors font-mono uppercase tracking-wider"
                title="Reset to default UAE statutory text"
              >
                <RotateCcw size={12} /> Reset Defaults
              </button>
              <button
                onClick={startAddSection}
                className="inline-flex items-center gap-2 bg-navy text-cream px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700 transition-colors"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>
          </div>
        )}
      </div>

      {editingSectionIdx !== null && (
        <div className="bg-white border-2 border-gold/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-navy">
              {editingSectionIdx === 'new' ? 'Add New Section to ' + currentDoc.title : 'Edit Section ' + (editingSectionIdx + 1)}
            </h3>
            <button
              onClick={() => setEditingSectionIdx(null)}
              className="text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-navy"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Section Heading *</label>
              <input
                className={inputCls}
                placeholder="e.g. 9. Dispute Resolution & UAE Courts Jurisdiction"
                value={sectionForm.h}
                onChange={(e) => setSectionForm({ ...sectionForm, h: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Section Content / Legal Text *</label>
              <textarea
                rows={7}
                className={inputCls}
                placeholder="Write or paste statutory policy text, rules, regulatory disclosures, or client terms..."
                value={sectionForm.p}
                onChange={(e) => setSectionForm({ ...sectionForm, p: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingSectionIdx(null)}
                className="border border-navy/20 px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={saveSection}
                className="inline-flex items-center gap-2 bg-navy text-cream px-6 py-2 text-xs font-mono uppercase tracking-wider hover:bg-navy-700 transition-colors"
              >
                <Save size={13} /> {editingSectionIdx === 'new' ? 'Add Section' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-navy/10">
        <div className="p-4 border-b border-navy/10 flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-navy font-semibold">
            {(currentDoc.sections || []).length} Sections on {currentDoc.title}
          </h4>
          <span className="text-xs text-slate-400">Reorder or click Edit to modify any clause</span>
        </div>

        <div className="divide-y divide-navy/10">
          {(currentDoc.sections || []).length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No sections in this document yet. Click &quot;Add Section&quot; to create one.
            </div>
          )}
          {(currentDoc.sections || []).map((sec, idx) => (
            <div key={idx} className="p-5 hover:bg-cream/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-navy text-cream px-2 py-0.5 font-bold shrink-0">
                    Section {idx + 1}
                  </span>
                  <h5 className="font-serif text-base text-navy font-medium line-clamp-1">{sec.h}</h5>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed pl-7 whitespace-pre-line">
                  {sec.p}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pt-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, -1)}
                  className="p-1.5 border border-navy/10 text-slate-400 hover:text-navy hover:border-navy disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  disabled={idx === (currentDoc.sections || []).length - 1}
                  onClick={() => moveSection(idx, 1)}
                  className="p-1.5 border border-navy/10 text-slate-400 hover:text-navy hover:border-navy disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  onClick={() => startEditSection(idx)}
                  className="inline-flex items-center gap-1 border border-navy/15 px-2.5 py-1 text-xs text-navy hover:border-gold hover:text-gold transition-colors ml-1"
                >
                  <Pencil size={11} /> Edit
                </button>
                <button
                  onClick={() => deleteSection(idx)}
                  className="inline-flex items-center gap-1 border border-red-200 px-2.5 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
