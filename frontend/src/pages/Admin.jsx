import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, Lock } from 'lucide-react';
import { API } from '@/lib/api';

const STATUSES = ['new', 'in_review', 'scheduled', 'concluded'];
const STATUS_LABELS = { new: 'New', in_review: 'In Review', scheduled: 'Scheduled', concluded: 'Concluded' };

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem('mcp_admin_key') || '');
  const [input, setInput] = useState('');
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (k) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/enquiries`, { headers: { 'X-Admin-Key': k } });
      setEnquiries(res.data);
    } catch (e) {
      sessionStorage.removeItem('mcp_admin_key');
      setKey('');
      toast.error('Invalid admin key.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key);
  }, [key, load]);

  const login = (e) => {
    e.preventDefault();
    sessionStorage.setItem('mcp_admin_key', input);
    setKey(input);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API}/enquiries/${id}`, { status }, { headers: { 'X-Admin-Key': key } });
      setEnquiries((list) => list.map((en) => (en.id === id ? res.data : en)));
      toast.success('Status updated.');
    } catch (e) {
      toast.error('Update failed.');
    }
  };

  const exportCsv = () => {
    const rows = [['Date', 'Name', 'Company', 'Email', 'Phone', 'Country', 'Service', 'Source', 'Status', 'Message']];
    filtered.forEach((e) => rows.push([
      new Date(e.created_at).toLocaleDateString(), e.name, e.company || '', e.email, e.phone || '',
      e.country || '', e.service_required || '', e.source, e.status, (e.message || '').replace(/\n/g, ' '),
    ]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meridian-enquiries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter);

  if (!key) {
    return (
      <main className="bg-navy min-h-screen flex items-center justify-center px-6" data-testid="admin-login">
        <form onSubmit={login} className="w-full max-w-sm border border-gold/25 bg-navy-800 p-10">
          <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mb-6">
            <Lock size={18} className="text-gold" />
          </div>
          <h1 className="font-serif text-2xl text-cream mb-2">Enquiries Portal</h1>
          <p className="text-sm text-cream/50 mb-8">Restricted to authorised team members.</p>
          <input
            type="password"
            data-testid="admin-key-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Admin key"
            className="w-full bg-navy border border-cream/15 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold mb-4"
          />
          <button type="submit" data-testid="admin-login-btn" className="w-full bg-gold text-navy text-sm font-medium py-3 hover:bg-gold-soft transition-colors">
            Access Portal
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen pt-28 pb-20" data-testid="admin-portal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold mb-2">Administration</p>
            <h1 className="font-serif text-3xl text-navy">Enquiries</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCsv} data-testid="admin-export-csv-btn" className="inline-flex items-center gap-2 border border-navy/20 px-5 py-2.5 text-sm text-navy hover:border-gold hover:text-gold transition-colors">
              <Download size={15} /> Export CSV
            </button>
            <button onClick={() => { sessionStorage.removeItem('mcp_admin_key'); setKey(''); }} data-testid="admin-logout-btn" className="border border-navy/20 px-5 py-2.5 text-sm text-navy/60 hover:text-navy transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              data-testid={`admin-filter-${s.replace('_', '-')}`}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.15em] border transition-colors ${
                filter === s ? 'bg-navy text-cream border-navy' : 'border-navy/15 text-slate-500 hover:border-gold'
              }`}
            >
              {s === 'all' ? `All (${enquiries.length})` : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="bg-white border border-navy/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]" data-testid="admin-enquiries-table">
            <thead>
              <tr className="bg-navy text-cream text-left">
                {['Date', 'Name', 'Contact', 'Service', 'Source', 'Message', 'Status'].map((h) => (
                  <th key={h} className="p-4 text-xs font-mono uppercase tracking-[0.15em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-mono text-xs">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400">No enquiries yet.</td></tr>}
              {filtered.map((e) => (
                <tr key={e.id} className="border-t border-navy/10 align-top hover:bg-cream/60" data-testid={`admin-enquiry-row-${e.id}`}>
                  <td className="p-4 font-mono text-xs text-slate-500 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="font-medium text-navy">{e.name}</p>
                    {e.company && <p className="text-xs text-slate-400">{e.company}</p>}
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <p>{e.email}</p>
                    {e.phone && <p>{e.phone}</p>}
                    {e.country && <p className="text-slate-400">{e.country}</p>}
                  </td>
                  <td className="p-4 text-xs text-slate-600">{e.service_required || '—'}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-1 ${e.source === 'consultation' ? 'bg-gold/15 text-gold' : 'bg-navy/5 text-navy/60'}`}>
                      {e.source}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-600 max-w-xs">
                    <p className="line-clamp-3">{e.message || '—'}</p>
                    {e.questionnaire?.objective && <p className="mt-1 text-slate-400">Objective: {e.questionnaire.objective}</p>}
                  </td>
                  <td className="p-4">
                    <select
                      value={e.status}
                      data-testid={`admin-status-select-${e.id}`}
                      onChange={(ev) => updateStatus(e.id, ev.target.value)}
                      className="text-xs border border-navy/15 px-2 py-1.5 bg-white focus:outline-none focus:border-gold"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
