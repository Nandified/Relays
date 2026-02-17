"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

interface DocumentUploadProps {
  /** Accepted MIME types */
  accept?: string;
  /** Max file size in bytes (default: 25MB) */
  maxSize?: number;
  /** Upload label */
  label?: string;
  /** Description text below label */
  description?: string;
  /** Compact mode: smaller drop zone */
  compact?: boolean;
  /** Called when a file is selected */
  onFileSelect?: (file: File) => void;
  /** Whether upload is in progress */
  uploading?: boolean;
  /** Upload progress 0-100 */
  progress?: number;
  /** Disabled state */
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/heic": "HEIC",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(type: string): React.ReactNode {
  if (type === "application/pdf") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-400">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 13h4M10 17h4M8 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (type.startsWith("image/")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-600 dark:text-slate-400">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DocumentUpload({
  accept,
  maxSize = 25 * 1024 * 1024,
  label = "Upload Document",
  description,
  compact = false,
  onFileSelect,
  uploading = false,
  progress = 0,
  disabled = false,
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dragCounter = React.useRef(0);

  const acceptString = accept || ACCEPTED_TYPES.join(",");

  const validateFile = React.useCallback(
    (file: File): boolean => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|webp|heic|docx?)$/i)) {
        setError("Unsupported file type. Upload PDF, images, or Word documents.");
        return false;
      }
      if (file.size > maxSize) {
        setError(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
        return false;
      }
      return true;
    },
    [maxSize]
  );

  const handleFile = React.useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect?.(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Simulated upload progress
  const [simProgress, setSimProgress] = React.useState(0);
  React.useEffect(() => {
    if (uploading) {
      setSimProgress(0);
      const interval = setInterval(() => {
        setSimProgress((p) => {
          if (p >= 90) {
            clearInterval(interval);
            return p;
          }
          return p + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setSimProgress(0);
    }
  }, [uploading]);

  const displayProgress = uploading ? (progress > 0 ? progress : simProgress) : 0;

  if (selectedFile && !error) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-sm p-4 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            {getFileIcon(selectedFile.type)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-600 dark:text-slate-500">
                {FILE_TYPE_LABELS[selectedFile.type] || selectedFile.type.split("/")[1]?.toUpperCase() || "FILE"}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-600 dark:text-slate-500">{formatFileSize(selectedFile.size)}</span>
            </div>
            {uploading && (
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(displayProgress, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-500">{Math.round(displayProgress)}% uploaded</p>
              </div>
            )}
          </div>
          {!uploading && (
            <button
              onClick={clearFile}
              className="flex-shrink-0 rounded-lg p-1.5 text-slate-600 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              aria-label="Remove file"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${compact ? "p-4" : "p-6 sm:p-8"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            isDragOver
              ? "border-blue-500/50 bg-blue-500/[0.06] shadow-[0_0_30px_rgba(59,130,246,0.12)]"
              : "border-[var(--border)] bg-[var(--bg-card)]/60 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card)]/80"
          }
        `}
      >
        {/* Drag-over glow effect */}
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptString}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Upload icon */}
          <div
            className={`
              flex items-center justify-center rounded-2xl border mb-3 transition-all duration-300
              ${compact ? "h-10 w-10" : "h-14 w-14"}
              ${
                isDragOver
                  ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                  : "border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] text-slate-600 dark:text-slate-500"
              }
            `}
          >
            <svg
              width={compact ? "18" : "24"}
              height={compact ? "18" : "24"}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Label */}
          <p className={`font-medium text-slate-700 dark:text-slate-300 ${compact ? "text-xs" : "text-sm"}`}>
            {isDragOver ? "Drop your file here" : label}
          </p>

          {description && !isDragOver && (
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">{description}</p>
          )}

          {!isDragOver && !compact && (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                or{" "}
                <span className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">browse files</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1.5">
                PDF, images, Word docs — up to {formatFileSize(maxSize)}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

/** Inline upload button for compact use in table rows */
export function DocumentUploadButton({
  onFileSelect,
  disabled = false,
}: {
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect?.(file);
        }}
        className="hidden"
        disabled={disabled}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
        </svg>
        Upload
      </Button>
    </>
  );
}

export { formatFileSize };
