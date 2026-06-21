"use client";

import { useState } from "react";

const units = {
  px: { name: "px (像素)", factor: 1 },
  rem: { name: "rem", factor: 16 },
  em: { name: "em", factor: 16 },
  vw: { name: "vw", factor: 19.2 },
  vh: { name: "vh", factor: 10.8 },
  pt: { name: "pt (磅)", factor: 1.333 },
  cm: { name: "cm (厘米)", factor: 37.8 },
  mm: { name: "mm (毫米)", factor: 3.78 },
  in: { name: "in (英寸)", factor: 96 },
  pc: { name: "pc (派卡)", factor: 16 },
};

export function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState("px");
  const [baseSize, setBaseSize] = useState("16");

  const convert = (toUnit: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "---";
    const base = parseFloat(baseSize) || 16;
    const fromFactor = fromUnit === "rem" || fromUnit === "em" ? base : units[fromUnit as keyof typeof units].factor;
    const toFactor = toUnit === "rem" || toUnit === "em" ? base : units[toUnit as keyof typeof units].factor;
    const pxValue = numValue * fromFactor;
    const result = pxValue / toFactor;
    return result.toFixed(4).replace(/\.?0+$/, "") || "0";
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">数值</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">源单位</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            {Object.entries(units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">基准字号 (px)</label>
          <input
            type="number"
            value={baseSize}
            onChange={(e) => setBaseSize(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {Object.entries(units).map(([key, unit]) => {
          const result = convert(key);
          return (
            <div
              key={key}
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
              onClick={() => copy(result)}
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{unit.name}</p>
              <p className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">{result}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">点击结果可复制</p>
    </div>
  );
}
