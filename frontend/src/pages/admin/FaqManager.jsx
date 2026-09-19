import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft, HelpCircle, Check } from 'lucide-react';
import { HOME_FAQS } from '@/data/site';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const EMPTY = {
  q: '',
  a: '',
};

export default function FaqManager() {
  const [faqs, setFaqs] = useState(() => {
    try {
      const cached = localStorage.getItem('probiz_site_faqs');
      return cached ? JSON.parse(cached) : HOME_FAQS;
    } catch {
      return HOME_FAQS;
    }
  });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.q || !form.a) {
      toast.error('Question and answer are both required.');
      return;
    }
    setSaving(true);
    const updatedFaq = {
      id: form.id || 'faq-' + Date.now(),
      q: form.q.trim(),
      a: form.a.trim(),
    };

    let nextFaqs;
    if (form.id) {
      nextFaqs = faqs.map((f, i) => (f.id === form.id || f.q === form.originalQ ? updatedFaq : f));
    } else {
      nextFaqs = [...faqs, updatedFaq];
    }

    setFaqs(nextFaqs);
    try {
      localStorage.setItem('probiz_site_faqs', JSON.stringify(nextFaqs));
      toast.success('FAQ saved — live on Homepage Chapter 11.');
    } catch {
      toast.error('Failed to persist FAQ.');
    } finally {
      setSaving(false);
      setForm(null);
    }
  };

  const remove = (index) => {
    if (!window.confirm('Delete this FAQ? This cannot be undone.')) return;
    const nextFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(nextFaqs);
    try {
      localStorage.setItem('probiz_site_faqs', JSON.stringify(nextFaqs));
      toast.success('FAQ removed.');
    } catch {
      toast.error('Failed to remove FAQ.');
    }
  };

  const resetDefaults = () => {
    if (!window.confirm('Reset FAQs to standard default questions?')) return;
    setFaqs(HOME_FAQS);
    localStorage.removeItem('probiz_site_faqs');
    toast.success('Reset to default FAQs.');
  };

  if (form) {
    return (
      <div className="bg-white border border-navy/10 p-8" data-testid="faq-editor">
        <button
          onClick={() => setForm(null)}
          data-testid="faq-editor-back-btn"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-gold mb-8"
        >
          <ArrowLeft size={14} /> Back to FAQ List
        </button>
        <h2 className="font-serif text-2xl text-navy mb-8">
          {form.id ? 'Edit Question & Answer' : 'New Frequently Asked Question'}
        </h2>

        <div className="space-y-6">
          <div>
            <label className={labelCls}>Question *</label>
            <input
              data-testid="faq-input-question"
              className={inputCls}
              placeholder="e.g. Can a foreign national own 100% of a UAE company?"
              value={form.q}
              onChange={set('q')}
            />
          </div>
          <div>
            <label className={labelCls}>Detailed Answer *</label>
            <textarea
              rows={6}
              data-testid="faq-input-answer"
              className={inputCls}
              placeholder="Provide a clear, authoritative explanation for prospective clients..."
              value={form.a}
              onChange={set('a')}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            data-testid="faq-save-btn"
            className="bg-gold text-white text-sm font-medium px-8 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Check size={16} /> {saving ? 'Saving…' : 'Save FAQ'}
          </button>
          <button
            onClick={() => setForm(null)}
            data-testid="faq-cancel-btn"
            className="border border-navy/20 text-navy text-sm px-8 py-3.5 hover:border-gold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="faq-manager">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-navy">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">{faqs.length} questions displayed on Chapter 11</p>
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
            data-testid="faq-new-btn"
            className="inline-flex items-center gap-2 bg-navy text-cream text-sm px-5 py-2.5 hover:bg-navy-700 transition-colors"
          >
            <Plus size={15} /> Add FAQ
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white border border-navy/10 p-6 flex flex-col sm:flex-row justify-between gap-4 items-start hover:border-gold/50 transition-colors">
            <div className="max-w-3xl">
              <h3 className="font-serif text-lg text-navy mb-2 flex items-start gap-2">
                <span className="font-mono text-xs text-gold mt-1">Q{i + 1}.</span> {f.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-6">{f.a}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
              <button
                onClick={() => setForm({ ...f, id: f.id || 'faq-' + i, originalQ: f.q })}
                className="inline-flex items-center gap-1.5 border border-navy/15 px-3 py-1.5 text-xs text-navy hover:border-gold hover:text-gold transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => remove(i)}
                className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
