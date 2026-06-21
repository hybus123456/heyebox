"use client";

import { useState } from "react";

const unitCategories = {
  length: {
    name: "长度",
    units: {
      m: { name: "米", factor: 1 },
      km: { name: "千米", factor: 1000 },
      cm: { name: "厘米", factor: 0.01 },
      mm: { name: "毫米", factor: 0.001 },
      mi: { name: "英里", factor: 1609.344 },
      yd: { name: "码", factor: 0.9144 },
      ft: { name: "英尺", factor: 0.3048 },
      in: { name: "英寸", factor: 0.0254 },
    },
  },
  weight: {
    name: "重量",
    units: {
      kg: { name: "千克", factor: 1 },
      g: { name: "克", factor: 0.001 },
      mg: { name: "毫克", factor: 0.000001 },
      t: { name: "吨", factor: 1000 },
      lb: { name: "磅", factor: 0.453592 },
      oz: { name: "盎司", factor: 0.0283495 },
    },
  },
  temperature: {
    name: "温度",
    units: {
      c: { name: "摄氏度", factor: 1 },
      f: { name: "华氏度", factor: 1 },
      k: { name: "开尔文", factor: 1 },
    },
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof unitCategories>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [inputValue, setInputValue] = useState("1");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("请输入有效数字");
      return;
    }

    const cat = unitCategories[category];

    if (category === "temperature") {
      let celsius: number;
      if (fromUnit === "c") celsius = value;
      else if (fromUnit === "f") celsius = (value - 32) * 5 / 9;
      else celsius = value - 273.15;

      let output: number;
      if (toUnit === "c") output = celsius;
      else if (toUnit === "f") output = celsius * 9 / 5 + 32;
      else output = celsius + 273.15;

      setResult(output.toFixed(4));
    } else {
      const units = cat.units as Record<string, { name: string; factor: number }>;
      const fromFactor = units[fromUnit].factor;
      const toFactor = units[toUnit].factor;
      const output = value * fromFactor / toFactor;
      setResult(output.toFixed(4));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          单位类型
        </label>
        <div className="flex gap-2">
          {Object.entries(unitCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => {
                setCategory(key as keyof typeof unitCategories);
                const units = Object.keys(cat.units);
                setFromUnit(units[0]);
                setToUnit(units[1]);
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                category === key
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">从</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            {Object.entries(unitCategories[category].units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={convert}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            转换
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">到</label>
          <div className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm min-h-[42px]">
            {result || "---"}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          >
            {Object.entries(unitCategories[category].units).map(([key, unit]) => (
              <option key={key} value={key}>{unit.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
