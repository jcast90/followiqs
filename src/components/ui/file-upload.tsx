"use client";

import * as React from "react";
import { Upload, X, File as FileIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Types ---------- */

export interface FileUploadProps {
  /** Accepted MIME types (e.g. ["image/*", "application/pdf"]) */
  accept?: string[];
  /** Max file size in bytes (default 10 MB) */
  maxSize?: number;
  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Called when valid files are added */
  onFilesSelected?: (files: File[]) => void;
  /** Called when a file is removed from the list */
  onFileRemoved?: (file: File) => void;
  /** External upload progress by filename (0-100) */
  progress?: Record<string, number>;
  /** External upload status by filename */
  status?: Record<string, "uploading" | "success" | "error">;
  /** Additional class names for the root container */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
}

interface SelectedFile {
  file: File;
  preview: string | null;
  error: string | null;
}

/* ---------- Helpers ---------- */

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageType(type: string): boolean {
  return type.startsWith("image/");
}

function matchesMime(fileType: string, pattern: string): boolean {
  if (pattern === "*/*") return true;
  if (pattern.endsWith("/*")) {
    return fileType.startsWith(pattern.replace("/*", "/"));
  }
  return fileType === pattern;
}

/* ---------- Component ---------- */

function FileUpload({
  accept,
  maxSize = DEFAULT_MAX_SIZE,
  multiple = false,
  onFilesSelected,
  onFileRemoved,
  progress,
  status,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<SelectedFile[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dragCounter = React.useRef(0);

  const validateFile = React.useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File exceeds ${formatSize(maxSize)} limit (${formatSize(file.size)})`;
      }
      if (accept && accept.length > 0) {
        const valid = accept.some((pattern) => matchesMime(file.type, pattern));
        if (!valid) {
          return `File type "${file.type || "unknown"}" is not allowed`;
        }
      }
      return null;
    },
    [accept, maxSize]
  );

  const addFiles = React.useCallback(
    (incoming: File[]) => {
      const newEntries: SelectedFile[] = incoming.map((file) => {
        const error = validateFile(file);
        const preview = !error && isImageType(file.type) ? URL.createObjectURL(file) : null;
        return { file, preview, error };
      });

      const validFiles = newEntries.filter((e) => !e.error).map((e) => e.file);

      setFiles((prev) => {
        if (multiple) return [...prev, ...newEntries];
        // Single mode — revoke old previews
        prev.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
        return newEntries.slice(0, 1);
      });

      if (validFiles.length > 0) {
        onFilesSelected?.(validFiles);
      }
    },
    [multiple, validateFile, onFilesSelected]
  );

  const removeFile = React.useCallback(
    (index: number) => {
      setFiles((prev) => {
        const removed = prev[index];
        if (removed?.preview) URL.revokeObjectURL(removed.preview);
        if (removed && !removed.error) onFileRemoved?.(removed.file);
        return prev.filter((_, i) => i !== index);
      });
    },
    [onFileRemoved]
  );

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- Drag & Drop handlers --- */

  const handleDragEnter = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOver(false);
      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) addFiles(droppedFiles);
    },
    [disabled, addFiles]
  );

  /* --- Click handler --- */

  const handleClick = React.useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      if (selected.length > 0) addFiles(selected);
      // Reset input so re-selecting the same file works
      e.target.value = "";
    },
    [addFiles]
  );

  const acceptString = accept?.join(",");

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all duration-200 cursor-pointer",
          "border-white/[0.06] bg-brand-surface-light text-white/60",
          "hover:border-white/[0.15] hover:bg-brand-surface-light/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragOver && "border-primary/60 bg-primary/[0.06] text-white/80",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload
          className={cn(
            "size-8 transition-colors duration-200",
            isDragOver ? "text-primary" : "text-white/40"
          )}
        />
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/80">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-white/40">
            or click to browse
            {maxSize && ` (max ${formatSize(maxSize)})`}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptString}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((entry, index) => {
            const fileName = entry.file.name;
            const fileStatus = status?.[fileName];
            const fileProgress = progress?.[fileName] ?? 0;

            return (
              <li
                key={`${fileName}-${index}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                  entry.error
                    ? "border-red-500/30 bg-red-500/[0.06]"
                    : "border-white/[0.06] bg-brand-surface-light"
                )}
              >
                {/* Preview / icon */}
                {entry.preview ? (
                  <img
                    src={entry.preview}
                    alt={fileName}
                    className="size-9 shrink-0 rounded object-cover"
                  />
                ) : (
                  <FileIcon className="size-5 shrink-0 text-white/40" />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="truncate text-white/80">{fileName}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>{formatSize(entry.file.size)}</span>
                    {entry.error && (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="size-3" />
                        {entry.error}
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {fileStatus === "uploading" && (
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(fileProgress, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status icon */}
                {fileStatus === "uploading" && (
                  <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                )}
                {fileStatus === "success" && (
                  <CheckCircle2 className="size-4 shrink-0 text-green-400" />
                )}
                {fileStatus === "error" && (
                  <AlertCircle className="size-4 shrink-0 text-red-400" />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="shrink-0 rounded p-0.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                  aria-label={`Remove ${fileName}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { FileUpload };
