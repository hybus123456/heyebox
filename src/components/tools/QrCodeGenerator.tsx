"use client";

import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";

export function QrCodeGenerator() {
  const [input, setInput] = useState("https://example.com");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);

  const generate = async () => {
    if (!input.trim()) return;
    try {
      const url = await QRCode.toDataURL(input, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrDataUrl(url);
    } catch {
      setQrDataUrl("");
    }
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          输入内容（网址或文字）
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">前景色</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">背景色</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-1">尺寸</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full px-2 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          生成二维�?        </button>
        {qrDataUrl && (
          <button
            onClick={download}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            下载图片
          </button>
        )}
      </div>

      {qrDataUrl && (
        <div className="flex justify-center p-6 bg-white rounded-lg border border-zinc-200 dark:border-zinc-700">
          <Image src={qrDataUrl} alt="QR Code" width={size} height={size} unoptimized />
        </div>
      )}
    </div>
  );
}
