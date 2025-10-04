"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";

export type ImageDropzoneProps = {
  onFilesChange?: (files: File[]) => void;
  value?: File[];
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: Accept;
  disabled?: boolean;
  className?: string;
};

export function ImageDropzone({
  onFilesChange,
  value,
  maxFiles = 8,
  maxSize = 5 * 1024 * 1024,
  accept = { "image/*": [] },
  disabled = false,
  className,
}: ImageDropzoneProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const files = value ?? internalFiles;

  const setFiles = useCallback(
    (next: File[]) => {
      if (!value) setInternalFiles(next);
      onFilesChange?.(next);
    },
    [value, onFilesChange]
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (disabled) return;
      const merged = [...files, ...accepted].slice(0, maxFiles);
      setFiles(merged);
    },
    [files, maxFiles, disabled, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      multiple: true,
      maxFiles,
      maxSize,
      disabled,
    });

  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const removeAt = (index: number) => {
    if (disabled) return;
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
  };

  const clearAll = () => {
    if (disabled) return;
    setFiles([]);
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary" : "border-muted"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here…</p>
        ) : (
          <p>Drag & drop images here, or click to select</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Up to {maxFiles} files, max {(maxSize / (1024 * 1024)).toFixed(0)}MB
          each
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-2 text-xs text-red-600">
          Some files were rejected due to type, size, or count limits.
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">
              Selected images ({files.length})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={disabled}
            >
              Clear all
            </Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {previews.map((p, i) => (
              <div key={`${p.file.name}-${i}`} className="relative group">
                <Image
                  width={500}
                  height={500}
                  src={p.url}
                  alt={p.file.name}
                  className="h-24 w-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 rounded-md bg-black/60 text-white text-xs px-1 py-0.5 opacity-0 group-hover:opacity-100"
                  disabled={disabled}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageDropzone;
