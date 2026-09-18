import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zgptqzwqfkvaikzocghq.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncHRxendxZmt2YWlrem9jZ2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MDM1NTIsImV4cCI6MjEwNTI3OTU1Mn0.g7FA6FHrJBclFeUnXXf2191Sh3SMxh9vNTMzjWv48CI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImageToSupabase(file, bucket = 'probiz-assets') {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = Date.now() + '-' + Math.random().toString(36).substring(2, 9) + '.' + fileExt;
  const filePath = 'uploads/' + fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
