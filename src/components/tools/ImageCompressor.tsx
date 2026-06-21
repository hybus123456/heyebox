"use client";

import { useState, useRef, useEffect } from "react";

export function ImageCompressor() {
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        compressImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCompressedSize(blob.size);
          setPreview(URL.createObjectURL(blob));
        }
      },
      "image/jpeg",
      quality / 100
    );
  };

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "compressed.jpg";
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const compressionRatio = originalSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          压缩质量：{quality}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <svg className="w-12 h-12 mx-auto mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-zinc-600 dark:text-zinc-400">
          点击选择图片
        </p>
      </div>

      {originalSize > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">原始大小</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatSize(originalSize)}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">压缩后</p>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{formatSize(compressedSize)}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">压缩率</p>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">{compressionRatio}%</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="flex justify-end">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            下载压缩图片
          </button>
        </div>
      )}
    </div>
  );
}
