import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = parseInt(
  process.env.UPLOAD_MAX_FILE_SIZE || String(10 * 1024 * 1024),
  10
);

const ALLOWED_TYPES = (process.env.UPLOAD_ALLOWED_TYPES || "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const DEFAULT_BUCKET = process.env.UPLOAD_BUCKET || "uploads";

function isTypeAllowed(mimeType: string): boolean {
  if (ALLOWED_TYPES.length === 0) return true;
  return ALLOWED_TYPES.some((pattern) => {
    if (pattern.endsWith("/*")) {
      return mimeType.startsWith(pattern.replace("/*", "/"));
    }
    return mimeType === pattern;
  });
}

/**
 * Sanitize an optional client-supplied subfolder. Allows simple a-z0-9/-_
 * names with no path traversal. The user's own ID is always the prefix.
 */
function sanitizeSubfolder(input: string | null): string {
  if (!input) return "";
  // Reject any path traversal or absolute paths
  if (input.includes("..") || input.startsWith("/") || input.includes("\\")) {
    return "";
  }
  // Allow only safe chars, single forward slashes
  const cleaned = input.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\/+/g, "/");
  if (cleaned.startsWith("/") || cleaned.endsWith("/")) return "";
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    // --- Auth check via cookie-based session (not user-supplied header) ---
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Parse multipart form data ---
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || DEFAULT_BUCKET;
    // Subfolder is optional and sanitized; the user's id is ALWAYS the prefix
    const subfolder = sanitizeSubfolder(formData.get("subfolder") as string | null);
    const pathPrefix = subfolder ? `${user.id}/${subfolder}` : user.id;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Send a 'file' field in multipart form data." },
        { status: 400 }
      );
    }

    // --- Validate size ---
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.`,
          maxSize: MAX_FILE_SIZE,
          fileSize: file.size,
        },
        { status: 413 }
      );
    }

    // --- Validate type ---
    if (!isTypeAllowed(file.type)) {
      return NextResponse.json(
        {
          error: `File type "${file.type}" is not allowed.`,
          allowedTypes: ALLOWED_TYPES,
        },
        { status: 415 }
      );
    }

    // --- Upload to Supabase Storage as the authenticated user ---
    // Uses the user-scoped client so Storage RLS policies apply. Service
    // role key is NEVER used here — that would bypass RLS and let any
    // authenticated user write anywhere.
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${pathPrefix}/${timestamp}-${safeName}`;

    const { data: uploadData, error: uploadError } =
      await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // --- Build response URL (signed for private buckets, public otherwise) ---
    // Try a signed URL first (works for private buckets); fall back to
    // public URL if the bucket is public.
    let url: string;
    const { data: signedData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData.path, 60 * 60); // 1 hour
    if (signedData?.signedUrl) {
      url = signedData.signedUrl;
    } else {
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);
      url = publicData.publicUrl;
    }

    return NextResponse.json({
      url,
      path: uploadData.path,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
