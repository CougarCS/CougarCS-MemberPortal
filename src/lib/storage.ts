import { supabase } from './supabase';

const HEADSHOTS_BUCKET = 'headshots';
const RESUMES_BUCKET = 'resumes';

/**
 * Uploads a headshot to Supabase Storage and returns the storage path.
 * Uses upsert so re-uploading replaces the existing file.
 */
export async function uploadHeadshot(contactId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  // Timestamp suffix guarantees a unique path on every upload so we never
  // hit an existing-file conflict and always use a plain INSERT.
  const path = `${contactId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(HEADSHOTS_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error('Headshot upload failed:', error.message);
    return null;
  }

  return path;
}

/**
 * Returns the public URL for a headshot path.
 */
export function getHeadshotUrl(path: string): string {
  const { data } = supabase.storage.from(HEADSHOTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Uploads a resume to Supabase Storage and returns the storage path.
 * Uses upsert so re-uploading replaces the existing file.
 */
export async function uploadResume(contactId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `${contactId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(RESUMES_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error('Resume upload failed:', error.message);
    return null;
  }

  return path;
}

/**
 * Returns a short-lived signed URL for downloading a resume (1 hour).
 */
export async function getResumeSignedUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(RESUMES_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) return null;
  return data.signedUrl;
}
