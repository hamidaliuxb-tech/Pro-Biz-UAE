import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { PageHero } from '@/components/common';
import { API } from '@/lib/api';
import { SERVICES, getService } from '@/data/services';

const OBJECTIVES = [
  'Start a UAE business', 'Expand an existing company', 'Establish a holding company',
  'Open a corporate bank account', 'Investment structure', 'Corporate restructuring',
  'Accounting / tax support', 'Compliance support', 'Other',
];
const TIMELINES = ['Immediately', 'Within 1 – 3 months', '3 – 6 months', 'Exploring options'];
const LOCATIONS = ['Based in the UAE', 'Outside the UAE', 'Planning to relocate'];
const SIZES = ['Under USD 50k', 'USD 50k – 250k', 'USD 250k – 1M', 'USD 1M+', 'Prefer to discuss'];

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

function ChipGroup({ options, value, onChange, testidPrefix }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          data-testid={`${testidPrefix}-${opt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          onClick={() => onChange(opt)}
          className={`border px-5 py-2.5 text-sm transition-colors duration-300 ${
            value === opt ? 'border-gold bg-navy text-cream' : 'border-navy/15 bg-white text-navy/70 hover:border-uaegreen'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function Consultation() {
  const [params] = useSearchParams();
  const prefill = params.get('service');
  const prefillService = prefill ? getService(prefill) : null;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    objective: prefillService ? prefillService.title : '',
    timeline: '', current_location: '', investment_size: '', business_activity: '',
    name: '', company: '', email: '', phone: '', country: '',
    service_required: prefillService ? prefillService.title : '',
    message: prefillService ? `Enquiry regarding: ${prefillService.title}` : '',
    consent: false,
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const canNext = step === 0 ? !!data.objective : true;

  const submit = async () => {
    if (!data.name || !data.email) {
      toast.error('Please provide your name and email.');
      return;
    }
    if (!data.consent) {
      toast.error('Please agree to the Privacy Policy to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/enquiries`, {
        name: data.name, company: data.company, email: data.email, phone: data.phone,
        country: data.country, business_activity: data.business_activity,
        current_location: data.current_location, service_required: data.service_required || data.objective,
        investment_size: data.investment_size, message: data.message, consent: data.consent,
        source: 'consultation',
        questionnaire: { objective: data.objective, timeline: data.timeline },
      });
      setDone(true);
      toast.success('Consultation request received.');
    } catch (e) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = ['Intent', 'Context', 'Details', 'Review'];

  if (done) {
    return (
      <main data-testid="consultation-page">
        <PageHero overline="Consultation" title="Request Received." />
        <section className="bg-cream py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 mx-auto mb-8 border border-gold flex items-center justify-center">
              <Check size={28} className="text-gold" />
            </motion.div>
            <h2 className="font-serif text-3xl text-navy mb-4">Thank you, {data.name.split(' ')[0]}.</h2>
            <p className="text-slate-600 leading-relaxed">
              Your request for a confidential consultation has been received. A senior member of our team
              will review your objectives and respond within one business day.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main data-testid="consultation-page">
      <PageHero
        overline="Confidential Consultation"
        title="Begin with a Structured Conversation."
        text="Four short steps. Your answers remain confidential and are reviewed by a senior adviser — never a sales team."
      />

      <section className="bg-cream py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 mb-12">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <div className={`w-full h-px ${i <= step ? 'bg-gold' : 'bg-navy/15'}`} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${i <= step ? 'text-gold' : 'text-slate-400'}`}>
                  0{i + 1} {label}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
            >
              {step === 0 && (
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-navy mb-8">What are you looking to achieve?</h2>
                  <ChipGroup options={OBJECTIVES} value={data.objective} onChange={(v) => set('objective', v)} testidPrefix="consultation-objective" />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-10">
                  <div>
                    <h2 className="font-serif text-2xl text-navy mb-6">What is your timeline?</h2>
                    <ChipGroup options={TIMELINES} value={data.timeline} onChange={(v) => set('timeline', v)} testidPrefix="consultation-timeline" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-navy mb-6">Where are you currently based?</h2>
                    <ChipGroup options={LOCATIONS} value={data.current_location} onChange={(v) => set('current_location', v)} testidPrefix="consultation-location" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl text-navy mb-6">Estimated investment or business size</h2>
                    <ChipGroup options={SIZES} value={data.investment_size} onChange={(v) => set('investment_size', v)} testidPrefix="consultation-size" />
                  </div>
                  <div>
                    <label className={labelCls}>Business Activity</label>
                    <input data-testid="consultation-input-activity" className={inputCls} value={data.business_activity} onChange={(e) => set('business_activity', e.target.value)} placeholder="e.g. Commodities trading, software, consultancy…" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input data-testid="consultation-form-input-name" className={inputCls} value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input data-testid="consultation-form-input-company" className={inputCls} value={data.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" data-testid="consultation-form-input-email" className={inputCls} value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input data-testid="consultation-form-input-phone" className={inputCls} value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+971 ..." />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input data-testid="consultation-form-input-country" className={inputCls} value={data.country} onChange={(e) => set('country', e.target.value)} placeholder="Country of residence" />
                  </div>
                  <div>
                    <label className={labelCls}>Service Required</label>
                    <select data-testid="consultation-form-select-service" className={inputCls} value={data.service_required} onChange={(e) => set('service_required', e.target.value)}>
                      <option value="">Select…</option>
                      {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                      <option>Other / Not sure yet</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Message</label>
                    <textarea rows={4} data-testid="consultation-form-input-message" className={inputCls} value={data.message} onChange={(e) => set('message', e.target.value)} placeholder="Briefly describe your objectives…" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-serif text-2xl text-navy mb-8">Review & Confirm</h2>
                  <div className="border border-navy/10 bg-white divide-y divide-navy/10 mb-8" data-testid="consultation-review">
                    {[
                      ['Objective', data.objective], ['Timeline', data.timeline], ['Location', data.current_location],
                      ['Investment / Size', data.investment_size], ['Activity', data.business_activity],
                      ['Name', data.name], ['Email', data.email], ['Service', data.service_required],
                    ].filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 px-6 py-4">
                        <span className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500">{k}</span>
                        <span className="text-sm text-navy text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer mb-8">
                    <input type="checkbox" data-testid="consultation-form-checkbox-consent" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 accent-[#00732F]" />
                    <span className="text-xs text-slate-500 leading-relaxed">I agree to the Privacy Policy and consent to being contacted regarding my enquiry.</span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12">
            <button
              type="button"
              data-testid="consultation-step-back-btn"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors disabled:opacity-0"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 3 ? (
              <button
                type="button"
                data-testid="consultation-step-next-btn"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 bg-navy text-cream text-sm font-medium px-7 py-3.5 hover:bg-uaegreen transition-colors disabled:opacity-40"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                data-testid="consultation-submit-btn"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gold text-white text-sm font-medium px-7 py-3.5 hover:bg-gold-soft transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Request a Confidential Consultation'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </section>
      <div className="flag-ribbon" />
    </main>
  );
}
