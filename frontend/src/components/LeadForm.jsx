import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/lib/api';
import { SERVICES } from '@/data/services';

const inputCls = 'w-full bg-white border border-navy/15 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-gold transition-colors duration-300';
const labelCls = 'block text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-2';

const INITIAL = {
  name: '', company: '', email: '', phone: '', country: '',
  business_activity: '', current_location: '', service_required: '',
  investment_size: '', message: '', consent: false,
};

export default function LeadForm({ source = 'contact', prefillService = '', testidPrefix = 'lead-form' }) {
  const [form, setForm] = useState({ ...INITIAL, service_required: prefillService });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      toast.error('Please agree to the Privacy Policy to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/enquiries`, { ...form, source });
      toast.success('Thank you. Your enquiry has been received — our team will respond within one business day.');
      setForm({ ...INITIAL, service_required: prefillService });
    } catch (err) {
      toast.error('Submission failed. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5" data-testid={`${testidPrefix}-form`}>
      <div>
        <label className={labelCls}>Name *</label>
        <input required data-testid={`${testidPrefix}-input-name`} className={inputCls} value={form.name} onChange={set('name')} placeholder="Full name" />
      </div>
      <div>
        <label className={labelCls}>Company</label>
        <input data-testid={`${testidPrefix}-input-company`} className={inputCls} value={form.company} onChange={set('company')} placeholder="Company name" />
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input required type="email" data-testid={`${testidPrefix}-input-email`} className={inputCls} value={form.email} onChange={set('email')} placeholder="you@company.com" />
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input data-testid={`${testidPrefix}-input-phone`} className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+971 ..." />
      </div>
      <div>
        <label className={labelCls}>Country</label>
        <input data-testid={`${testidPrefix}-input-country`} className={inputCls} value={form.country} onChange={set('country')} placeholder="Country of residence" />
      </div>
      <div>
        <label className={labelCls}>Current Location</label>
        <select data-testid={`${testidPrefix}-select-location`} className={inputCls} value={form.current_location} onChange={set('current_location')}>
          <option value="">Select…</option>
          <option>Based in the UAE</option>
          <option>Outside the UAE</option>
          <option>Planning to relocate</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Business Activity</label>
        <input data-testid={`${testidPrefix}-input-activity`} className={inputCls} value={form.business_activity} onChange={set('business_activity')} placeholder="e.g. Trading, Consulting, Real Estate" />
      </div>
      <div>
        <label className={labelCls}>Service Required</label>
        <select data-testid={`${testidPrefix}-select-service`} className={inputCls} value={form.service_required} onChange={set('service_required')}>
          <option value="">Select…</option>
          {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
          <option>Other / Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Estimated Investment / Business Size</label>
        <select data-testid={`${testidPrefix}-select-investment`} className={inputCls} value={form.investment_size} onChange={set('investment_size')}>
          <option value="">Select…</option>
          <option>Under USD 50k</option>
          <option>USD 50k – 250k</option>
          <option>USD 250k – 1M</option>
          <option>USD 1M+</option>
          <option>Prefer to discuss</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Message</label>
        <textarea rows={4} data-testid={`${testidPrefix}-input-message`} className={inputCls} value={form.message} onChange={set('message')} placeholder="Briefly describe your objectives…" />
      </div>
      <label className="sm:col-span-2 flex items-start gap-3 cursor-pointer">
        <input type="checkbox" data-testid={`${testidPrefix}-checkbox-consent`} checked={form.consent} onChange={set('consent')} className="mt-1 accent-[#00732F]" />
        <span className="text-xs text-slate-500 leading-relaxed">I agree to the Privacy Policy and consent to being contacted regarding my enquiry.</span>
      </label>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          data-testid={`${testidPrefix}-submit-button`}
          className="bg-navy text-cream text-sm font-medium tracking-wide px-8 py-4 hover:bg-uaegreen transition-colors duration-300 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Enquiry'}
        </button>
      </div>
    </form>
  );
}
