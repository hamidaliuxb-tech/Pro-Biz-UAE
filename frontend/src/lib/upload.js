import axios from 'axios';
import { API } from './api';
import { uploadImageToSupabase } from './supabase';

/**
 * Upload an image using Cloudinary (via backend /api/upload) with fallback to Supabase Storage.
 *
 * @param {File} file - File to upload
 * @param {string} [adminKey] - Admin secret key for authorization
 * @returns {Promise<string>} Public image URL
 */
export async function uploadImage(file, adminKey) {
  if (!file) return null;

  const effectiveKey = adminKey || sessionStorage.getItem('mcp_admin_key') || 'probizadminsecret123';

  // 1. Try Cloudinary via Backend /api/upload
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post(`${API}/upload`, formData, {
      headers: {
        'X-Admin-Key': effectiveKey,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    if (res.data?.url) {
      return res.data.url;
    }
  } catch (err) {
    console.warn('Backend Cloudinary upload failed, falling back to Supabase:', err.response?.data || err.message);
  }

  // 2. Fallback to Supabase Storage
  return await uploadImageToSupabase(file);
}