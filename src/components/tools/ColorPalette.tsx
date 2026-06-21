"use client";

import { useState } from "react";

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(baseHue: number, type: string) {
  const palettes: Record<string, number[]> = {
    "analogous": [0, 30, 60],
    "互补": [0, 180],
    "三色": [0, 120, 240],
    "类似": [0, 20, 40, 60],
    "分裂互补": [0, 150, 210],
  };
  
  const offsets = palettes[type] || palettes["analogous"];
  return offsets.map((offset) => {
    const h = (baseHue + offset) % 360;
    return {
      hex: hslToHex(h, 70, 55),
      hsl: `hsl(${h}, 70%, 55%)`,
    };
  });
}

export function ColorPalette() {
  const [hue, setHue] = useState(120);
  const [paletteType, setPaletteType] = useState("analogous");
  const palette = generatePalette(hue, paletteType);

  const types = ["analogous", "互补", "三色", "类似", "分裂互补"];

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          基础色相：{hue}°
        </label>
        <input
          type="range"
          min="0"
          max="359"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, 
              hsl(0, 70%, 55%), hsl(60, 70%, 55%), hsl(120, 70%, 55%), 
              hsl(180, 70%, 55%), hsl(240, 70%, 55%), hsl(300, 70%, 55%), hsl(360, 70%, 55%))`,
            height: "8px",
            borderRadius: "4px",
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">配色方案</label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setPaletteType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                paletteType === type
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 h-32">
        {palette.map((color, index) => (
          <div
            key={index}
            className="flex-1 rounded-xl cursor-pointer hover:scale-105 transition-transform relative group"
            style={{ backgroundColor: color.hex }}
            onClick={() => copy(color.hex)}
          >
            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/40 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white font-mono text-center">{color.hex}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {palette.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
            onClick={() => copy(color.hex)}
          >
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color.hex }} />
            <div>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100">{color.hex}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{color.hsl}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
