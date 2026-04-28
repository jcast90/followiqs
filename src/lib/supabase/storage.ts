import { createClient } from "./client";

export interface UploadResult {
  path: string;
  fullPath: string;
}

export interface FileObject {
  name: string;
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, unknown> | null;
}

/**
 * Upload a file to Supabase Storage.
 *
 * @param bucket  - Storage bucket name
 * @param path    - Destination path within the bucket (e.g. "user-id/avatar.png")
 * @param file    - File to upload
 * @param options - Optional upsert flag
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
): Promise<UploadResult> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: options?.upsert ?? false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return { path: data.path, fullPath: data.fullPath };
}

/**
 * Get a signed (temporary) download URL for a private file.
 *
 * @param bucket    - Storage bucket name
 * @param path      - File path within the bucket
 * @param expiresIn - Seconds until the URL expires (default 3600)
 */
export async function downloadFile(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Download URL failed: ${error.message}`);
  return data.signedUrl;
}

/**
 * List files in a bucket under a given prefix.
 *
 * @param bucket - Storage bucket name
 * @param prefix - Folder prefix to list (e.g. "user-id/documents")
 * @param options - Optional limit and offset for pagination
 */
export async function listFiles(
  bucket: string,
  prefix: string,
  options?: { limit?: number; offset?: number }
): Promise<FileObject[]> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix, {
      limit: options?.limit ?? 100,
      offset: options?.offset ?? 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw new Error(`List files failed: ${error.message}`);
  return (data ?? []) as FileObject[];
}

/**
 * Delete a file from Supabase Storage.
 *
 * @param bucket - Storage bucket name
 * @param path   - File path to delete
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * Get the public URL for a file in a public bucket.
 * This does NOT check if the file exists — it returns the URL pattern.
 *
 * @param bucket - Storage bucket name (must be public)
 * @param path   - File path within the bucket
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
