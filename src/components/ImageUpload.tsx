"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon, Link as LinkIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
  aspectRatio?: "square" | "wide";
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Afbeelding",
  placeholder = "Upload een afbeelding of plak een URL",
  aspectRatio = "wide",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.url);
      } else {
        setError(result.message || "Upload mislukt");
      }
    } catch (err) {
      setError("Er is een fout opgetreden bij het uploaden");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
      </label>

      {value ? (
        // Preview with remove option
        <div className="relative group">
          <div
            className={`relative overflow-hidden rounded-xl border border-gray-200 ${
              aspectRatio === "square" ? "aspect-square" : "aspect-video"
            }`}
          >
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload area
        <div className="space-y-3">
          <div
            className={`relative border-2 border-dashed border-gray-300 rounded-xl hover:border-teal transition-colors ${
              aspectRatio === "square" ? "aspect-square" : "aspect-video"
            } flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100`}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-teal animate-spin" />
                <span className="text-sm text-text-muted">Uploaden...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Klik om te uploaden
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    JPG, PNG, WebP of GIF (max 5MB)
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* URL input toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-text-muted hover:text-teal transition-colors flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              Of plak een URL
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-teal text-white rounded-xl hover:bg-teal/90 transition-colors"
              >
                Toevoegen
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
