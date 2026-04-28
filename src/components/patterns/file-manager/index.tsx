"use client";

/**
 * FileManager — Grid/list file browser with upload, rename, delete actions.
 * Supports folders, file type icons, and selection.
 */

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  Folder,
  FolderOpen,
  Upload,
  Trash2,
  Edit2,
  Grid,
  List,
  ChevronRight,
  Search,
} from "lucide-react";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size?: number;
  updatedAt?: string;
  thumbnailUrl?: string;
}

export interface FileManagerProps {
  items: FileItem[];
  onUpload?: () => void;
  onDelete?: (ids: string[]) => void;
  onRename?: (id: string, name: string) => void;
  onNavigate?: (id: string) => void;
  breadcrumbs?: { id: string; label: string }[];
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ item, size = 16 }: { item: FileItem; size?: number }) {
  const cls = `shrink-0`;
  if (item.type === "folder") return <Folder className={cls} style={{ width: size, height: size, color: "var(--brand-primary)" }} />;
  const mime = item.mimeType ?? "";
  if (mime.startsWith("image/")) return <FileImage className={cls} style={{ width: size, height: size, color: "#22c55e" }} />;
  if (mime.startsWith("video/")) return <FileVideo className={cls} style={{ width: size, height: size, color: "#a855f7" }} />;
  if (mime.startsWith("audio/")) return <FileAudio className={cls} style={{ width: size, height: size, color: "#f97316" }} />;
  if (mime.includes("text/") || mime.includes("json") || mime.includes("javascript")) {
    return <FileCode className={cls} style={{ width: size, height: size, color: "#38bdf8" }} />;
  }
  if (mime.includes("pdf") || mime.includes("document")) {
    return <FileText className={cls} style={{ width: size, height: size, color: "#ef4444" }} />;
  }
  return <File className={cls} style={{ width: size, height: size, color: "rgba(255,255,255,0.4)" }} />;
}

export function FileManager({
  items,
  onUpload,
  onDelete,
  onRename,
  onNavigate,
  breadcrumbs = [],
  className,
}: FileManagerProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = useCallback((id: string, multi: boolean) => {
    setSelected((prev) => {
      if (!multi) {
        return prev.has(id) && prev.size === 1 ? new Set() : new Set([id]);
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const startRename = (item: FileItem) => {
    setRenamingId(item.id);
    setRenameValue(item.name);
  };

  const commitRename = (id: string) => {
    if (renameValue.trim()) onRename?.(id, renameValue.trim());
    setRenamingId(null);
  };

  const handleDelete = () => {
    onDelete?.(Array.from(selected));
    setSelected(new Set());
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-xs text-white/40 flex-1 min-w-0 overflow-hidden">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.id} className="flex items-center gap-1 shrink-0">
              {i > 0 && <ChevronRight className="size-3" />}
              <button
                className="hover:text-white transition-colors"
                onClick={() => onNavigate?.(crumb.id)}
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </div>

        <div className="relative min-w-[140px] w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files"
            className="pl-7 h-7 text-xs bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/30"
          />
        </div>

        <div
          className="flex rounded-md overflow-hidden border"
          style={{ borderColor: "var(--brand-border-color)" }}
        >
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              className={cn(
                "p-1.5 transition-colors",
                view === v
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white hover:bg-white/[0.04]"
              )}
              onClick={() => setView(v)}
            >
              {v === "grid" ? <Grid className="size-3.5" /> : <List className="size-3.5" />}
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleDelete}
          >
            <Trash2 className="size-3 mr-1" />
            Delete ({selected.size})
          </Button>
        )}

        {onUpload && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10"
            onClick={onUpload}
          >
            <Upload className="size-3 mr-1" />
            Upload
          </Button>
        )}
      </div>

      {/* File grid / list */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-lg p-3 cursor-pointer select-none transition-all",
                selected.has(item.id)
                  ? "ring-1"
                  : "hover:bg-white/[0.04]"
              )}
              style={
                selected.has(item.id)
                  ? ({
                      background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)",
                      ["--tw-ring-color" as string]: "var(--brand-primary)",
                    } as React.CSSProperties)
                  : {}
              }
              onClick={(e) => toggleSelect(item.id, e.shiftKey || e.metaKey || e.ctrlKey)}
              onDoubleClick={() => item.type === "folder" && onNavigate?.(item.id)}
            >
              <FileIcon item={item} size={32} />
              {renamingId === item.id ? (
                <input
                  autoFocus
                  className="w-full rounded px-1 text-center text-xs bg-black/40 text-white border border-white/20 outline-none"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(item.id);
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="w-full text-center text-[11px] text-white/70 truncate leading-tight">
                  {item.name}
                </p>
              )}

              {/* Hover actions */}
              {renamingId !== item.id && (
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                  {onRename && (
                    <button
                      className="rounded p-1 hover:bg-white/10 text-white/30 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(item);
                      }}
                    >
                      <Edit2 className="size-2.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-lg border divide-y overflow-hidden"
          style={{
            borderColor: "var(--brand-border-color)",
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer select-none transition-all group",
                selected.has(item.id)
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.03]"
              )}
              onClick={(e) => toggleSelect(item.id, e.shiftKey || e.metaKey || e.ctrlKey)}
              onDoubleClick={() => item.type === "folder" && onNavigate?.(item.id)}
            >
              <FileIcon item={item} size={16} />
              {renamingId === item.id ? (
                <input
                  autoFocus
                  className="flex-1 rounded px-1 text-sm bg-black/40 text-white border border-white/20 outline-none"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(item.id);
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 text-sm text-white/80 truncate">{item.name}</span>
              )}
              <span className="text-xs text-white/30 tabular-nums hidden sm:block">
                {item.size != null ? formatBytes(item.size) : "—"}
              </span>
              <span className="text-xs text-white/30 hidden md:block">
                {item.updatedAt ?? ""}
              </span>
              <div className="hidden group-hover:flex gap-1">
                {onRename && renamingId !== item.id && (
                  <button
                    className="rounded p-1 hover:bg-white/10 text-white/30 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(item);
                    }}
                  >
                    <Edit2 className="size-3" />
                  </button>
                )}
                {onDelete && (
                  <button
                    className="rounded p-1 hover:bg-red-500/10 text-white/30 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete([item.id]);
                    }}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-white/20">No files found</div>
          )}
        </div>
      )}
    </div>
  );
}
