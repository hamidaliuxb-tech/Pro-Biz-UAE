import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, Lock, User, KeyRound } from 'lucide-react';
import { API } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import InsightsManager from '@/pages/admin/InsightsManager';
import ContentManager from '@/pages/admin/ContentManager';
import PortfolioManager from '@/pages/admin/PortfolioManager';
import ServicesManager from '@/pages/admin/ServicesManager';
import TeamManager from '@/pages/admin/TeamManager';
import FaqManager from '@/pages/admin/FaqManager';

const STATUSES = ['new', 'in_review', 'scheduled', 'concluded'];
const STATUS_LABELS = { new: 'New', in_review: 'In Review', scheduled: 'Scheduled', concluded: 'Concluded' };

export default function Admin() {
  const [key, setKey] = useState(sessionStorage.getItem('mcp_admin_key') || '');
  const [input, setInput] = useState('');
  const [authMethod, setAuthMethod] = useState('supabase');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem('supabase_admin_user') || '');
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('enquiries');

  const load = useCallback(async (k) => {
    setLoading(true);
    try {
      let loadedData = null;

      // 1. Try Backend API first if reachable
      try {
        const res = await axios.get(`${API}/enquiries`, {
          headers: { 'X-Admin-Key': k },
          timeout: 2500,
        });
        if (Array.isArray(res.data)) {
          loadedData = res.data;
        }
      } catch (backendErr) {
        // Only trigger logout if server explicitly returned 401 or 403 unauthorized
        if (backendErr.response && (backendErr.response.status === 401 || backendErr.response.status === 403)) {
          sessionStorage.removeItem('mcp_admin_key');
          sessionStorage.removeItem('supabase_admin_user');
          setKey('');
          toast.error('Invalid admin key.');
          return;
        }
        // Network error / connection refused on Vercel: do NOT logout, fall through to Supabase
      }

      // 2. Fetch from Supabase Cloud
      if (!loadedData) {
        try {
          const { data, error } = await supabase
            .from('enquiries')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && Array.isArray(data)) {
            loadedData = data;
          }
        } catch (supabaseErr) {
          console.warn('Supabase enquiries fetch error:', supabaseErr);
        }
      }

      setEnquiries(loadedData || []);
    } catch (e) {
      console.error('Failed to load enquiries:', e);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key);
  }, [key, load]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        sessionStorage.setItem('mcp_admin_key', 'probizadminsecret123');
        sessionStorage.setItem('supabase_admin_user', session.user.email);
        setUserEmail(session.user.email);
        setKey('probizadminsecret123');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        sessionStorage.setItem('mcp_admin_key', 'probizadminsecret123');
        sessionStorage.setItem('supabase_admin_user', session.user.email);
        setUserEmail(session.user.email);
        setKey('probizadminsecret123');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed. Ensure Google provider is enabled in Supabase.');
      setAuthLoading(false);
    }
  };

  const loginWithSupabase = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      sessionStorage.setItem('mcp_admin_key', 'probizadminsecret123');
      sessionStorage.setItem('supabase_admin_user', data.user.email);
      setUserEmail(data.user.email);
      setKey('probizadminsecret123');
      toast.success(`Authenticated as ${data.user.email}`);
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your Supabase credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithKey = (e) => {
    e.preventDefault();
    const cleanKey = input.trim();
    if (!cleanKey) {
      toast.error('Please enter the admin key.');
      return;
    }
    if (cleanKey !== 'probizadminsecret123') {
      toast.error('Invalid admin key.');
      return;
    }
    sessionStorage.setItem('mcp_admin_key', cleanKey);
    setKey(cleanKey);
    toast.success('Admin access granted.');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut().catch(() => {});
    sessionStorage.removeItem('mcp_admin_key');
    sessionStorage.removeItem('supabase_admin_user');
    setUserEmail('');
    setKey('');
    toast.success('Signed out.');
  };

  const updateStatus = async (id, status) => {
    try {
      let updated = false;
      try {
        const res = await axios.patch(`${API}/enquiries/${id}`, { status }, {
          headers: { 'X-Admin-Key': key },
          timeout: 2500,
        });
        setEnquiries((list) => list.map((en) => (en.id === id ? res.data : en)));
        updated = true;
      } catch (backendErr) {
        // Backend offline, fallback to Supabase
      }

      if (!updated) {
        const { error } = await supabase
          .from('enquiries')
          .update({ status })
          .eq('id', id);

        if (!error) {
          setEnquiries((list) => list.map((en) => (en.id === id ? { ...en, status } : en)));
          updated = true;
        }
      }

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
    a.download = 'probizuae-enquiries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter);

  if (!key) {
    return (
      <main className="bg-navy min-h-screen flex items-center justify-center px-6" data-testid="admin-login">
        <div className="w-full max-w-sm border border-gold/25 bg-navy-800 p-8 sm:p-10">
          <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mb-6">
            <Lock size={18} className="text-gold" />
          </div>
          <h1 className="font-serif text-2xl text-cream mb-2">Admin Portal</h1>
          <p className="text-sm text-cream/50 mb-6">Restricted to authorised team members.</p>

          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-medium text-sm py-3 px-4 transition-colors mb-6 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>

          <div className="relative flex py-1 items-center mb-6">
            <div className="flex-grow border-t border-cream/15"></div>
            <span className="flex-shrink mx-4 text-xs font-mono uppercase tracking-widest text-cream/40">or continue with</span>
            <div className="flex-grow border-t border-cream/15"></div>
          </div>

          <div className="flex border-b border-cream/15 mb-6 text-xs font-mono uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setAuthMethod('supabase')}
              className={`pb-2 mr-6 transition-colors ${authMethod === 'supabase' ? 'border-b-2 border-gold text-gold font-bold' : 'text-cream/50 hover:text-cream'}`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('key')}
              className={`pb-2 transition-colors ${authMethod === 'key' ? 'border-b-2 border-gold text-gold font-bold' : 'text-cream/50 hover:text-cream'}`}
            >
              Admin Key
            </button>
          </div>

          {authMethod === 'supabase' ? (
            <form onSubmit={loginWithSupabase}>
              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-cream/60 mb-2">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@probizuae.com"
                  className="w-full bg-navy border border-cream/15 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-mono uppercase tracking-wider text-cream/60 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy border border-cream/15 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gold text-white text-sm font-medium py-3 hover:bg-gold-soft transition-colors disabled:opacity-50"
              >
                {authLoading ? 'Signing in…' : 'Sign In with Supabase'}
              </button>
            </form>
          ) : (
            <form onSubmit={loginWithKey}>
              <div className="mb-6">
                <label className="block text-xs font-mono uppercase tracking-wider text-cream/60 mb-2">Master Key</label>
                <input
                  type="password"
                  data-testid="admin-key-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter admin key"
                  className="w-full bg-navy border border-cream/15 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold"
                />
              </div>
              <button type="submit" data-testid="admin-login-btn" className="w-full bg-gold text-white text-sm font-medium py-3 hover:bg-gold-soft transition-colors">
                Access with Key
              </button>
            </form>
          )}
        </div>
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
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:inline-flex items-center text-xs font-mono text-slate-500 mr-2">
                Logged in as: <strong className="text-navy ml-1">{userEmail}</strong>
              </span>
            )}
            <button onClick={exportCsv} data-testid="admin-export-csv-btn" className="inline-flex items-center gap-2 border border-navy/20 px-5 py-2.5 text-sm text-navy hover:border-gold hover:text-gold transition-colors">
              <Download size={15} /> Export CSV
            </button>
            <button onClick={handleSignOut} data-testid="admin-logout-btn" className="border border-navy/20 px-5 py-2.5 text-sm text-navy/60 hover:text-navy transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b border-navy/10 pb-1 overflow-x-auto no-scrollbar">
          {[
            ['enquiries', 'Leads & Enquiries'],
            ['insights', 'Insights Articles'],
            ['portfolio', 'Client Portfolio'],
            ['services', '18 Services'],
            ['team', 'Leadership Team'],
            ['faqs', 'FAQs (Q&A)'],
            ['content', 'Site Content & Banner'],
          ].map(([id, label]) => (
            <button
              key={id}
              data-testid={`admin-tab-${id}`}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                tab === id ? 'bg-navy text-cream' : 'text-slate-500 hover:text-navy'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'insights' && <InsightsManager adminKey={key} />}
        {tab === 'portfolio' && <PortfolioManager adminKey={key} />}
        {tab === 'services' && <ServicesManager adminKey={key} />}
        {tab === 'team' && <TeamManager adminKey={key} />}
        {tab === 'faqs' && <FaqManager adminKey={key} />}
        {tab === 'content' && <ContentManager adminKey={key} />}

        {tab === 'enquiries' && (<>
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
        </>)}
      </div>
    </main>
  );
}
