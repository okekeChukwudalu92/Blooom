import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'blooom-media';

/**
 * Uploads a file buffer to Supabase Storage and returns its public URL.
 * @param {Buffer} buffer - file contents (from multer's req.file.buffer)
 * @param {string} originalName - original filename, used to keep the extension
 * @param {string} mimetype - e.g. 'image/png'
 */
export async function uploadImage(buffer, originalName, mimetype) {
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, { contentType: mimetype, upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}
