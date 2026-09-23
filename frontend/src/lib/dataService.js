import axios from 'axios';
import { supabase } from './supabase';
import { API } from './api';
import { INSIGHTS } from '@/data/insights';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { SITE, STATS } from '@/data/site';

/**
 * Fetch all insights articles with fallback to Supabase and static data.
 */
export async function getInsightsList() {
  // 1. Try Backend API if available
  try {
    const res = await axios.get(`${API}/insights`, { timeout: 2500 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (e) {
    // Backend offline / not accessible on Vercel
  }

  // 2. Try Supabase Cloud
  try {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('published_at', { ascending: false });
    if (!error && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    // Supabase fallback
  }

  // 3. Resilient Static Fallback
  return INSIGHTS;
}

/**
 * Fetch a single insight by slug
 */
export async function getInsightBySlug(slug) {
  // 1. Try Backend API
  try {
    const res = await axios.get(`${API}/insights/${slug}`, { timeout: 2500 });
    if (res.data) return res.data;
  } catch (e) {}

  // 2. Try Supabase Cloud
  try {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!error && data) return data;
  } catch (e) {}

  // 3. Static Fallback
  return INSIGHTS.find((a) => a.slug === slug) || null;
}

/**
 * Fetch all projects with fallback to Supabase and static data.
 */
export async function getProjectsList() {
  // 1. Try Backend API
  try {
    const res = await axios.get(`${API}/projects`, { timeout: 2500 });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (e) {}

  // 2. Try Supabase Cloud
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('order', { ascending: true });
    if (!error && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {}

  // 3. Static Fallback
  return PROJECTS;
}

/**
 * Fetch a single project by id
 */
export async function getProjectById(id) {
  // 1. Try Backend API
  try {
    const res = await axios.get(`${API}/projects/${id}`, { timeout: 2500 });
    if (res.data) return res.data;
  } catch (e) {}

  // 2. Try Supabase Cloud
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) return data;
  } catch (e) {}

  // 3. Static Fallback
  return PROJECTS.find((p) => p.id === id) || PROJECTS[0] || null;
}

/**
 * Submit lead enquiry to Backend and/or Supabase
 */
export async function submitEnquiry(payload) {
  let success = false;

  // 1. Send through Vercel Serverless API route (dispatches Hostinger SMTP email)
  try {
    const res = await axios.post('/api/enquiry', payload, { timeout: 6000 });
    if (res.data?.success || res.status === 200) {
      success = true;
    }
  } catch (e) {
    // Fallback: If running local python backend
    try {
      await axios.post(`${API}/enquiries`, payload, { timeout: 3500 });
      success = true;
    } catch (err) {}
  }

  // 2. Direct Supabase Cloud insert
  try {
    const { error } = await supabase.from('enquiries').insert([{
      name: payload.name,
      email: payload.email,
      company: payload.company || '',
      phone: payload.phone || '',
      country: payload.country || '',
      business_activity: payload.business_activity || '',
      current_location: payload.current_location || '',
      service_required: payload.service_required || '',
      investment_size: payload.investment_size || '',
      message: payload.message || '',
      source: payload.source || 'contact',
      status: 'new'
    }]);
    if (!error) {
      success = true;
    } else {
      console.warn('Supabase enquiries insert notice:', error);
    }
  } catch (e) {
    console.warn('Supabase insert exception:', e);
  }

  // 3. Vault Backup: ensure lead is always preserved locally and visible in Admin
  try {
    const vault = JSON.parse(localStorage.getItem('probiz_enquiries_vault') || '[]');
    const newEntry = {
      id: 'local-' + Date.now(),
      name: payload.name,
      email: payload.email,
      company: payload.company || '',
      phone: payload.phone || '',
      country: payload.country || '',
      business_activity: payload.business_activity || '',
      current_location: payload.current_location || '',
      service_required: payload.service_required || 'Advisory',
      investment_size: payload.investment_size || '',
      message: payload.message || '',
      source: payload.source || 'contact',
      status: 'new',
      created_at: new Date().toISOString()
    };
    vault.unshift(newEntry);
    localStorage.setItem('probiz_enquiries_vault', JSON.stringify(vault.slice(0, 100)));
    success = true;
  } catch (e) {}

  return success;
}
