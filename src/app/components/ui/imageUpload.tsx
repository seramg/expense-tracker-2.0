"use client";

import * as React from "react";
import Image from "next/image";
import { X, User } from "lucide-react";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ImageUploadProps {
  label?: string;
  description?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dragCounterRef = React.useRef(0);

  // Create preview URL
  React.useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [value]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file validation and processing
  const processFile = (file: File) => {
    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Optional: Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    onChange?.(file);
  };

  // Handle remove image
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current++;

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="relative flex justify-center">
      <div className="relative h-24 w-24">
        <div
          className={cn(
            "relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-all",
            isDragging
              ? "border-primary bg-primary/10 scale-105"
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          )}
          onClick={handleAvatarClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {preview ? (
            // <div className="relative h-full w-full z-0">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          ) : (
            // </div>
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <User className="h-6 w-6" />
            </div>
          )}
        </div>
        {value && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="absolute right-0 top-0 h-6 w-6 rounded-full z-10 cursor-pointer"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (file) {
            processFile(file);
          }
        }}
      />
    </div>
  );
}
