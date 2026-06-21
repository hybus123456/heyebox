"use client";

import { useState } from "react";

export function NumberBase() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState<{ base: number; name: string; value: string }[]>([]);

  const bases = [
    { base: 2, name: "二进制" },
    { base: 8, name: "八进制" },
    { base: 10, name: "十进制" },
    { base: 16, name: "十六进制" },
  ];

  const convert = () => {
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) {
        setResults([]);
        return;
      }

      const newResults = bases.map((b) => ({
        base: b.base,
        name: b.name,
        value: decimal.toString(b.base).toUpperCase(),
      }));
      setResults(newResults);
    } catch {
      setResults([]);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            输入数值
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="255"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            输入进制
          </label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            {bases.map((b) => (
              <option key={b.base} value={b.base}>
                {b.name} ({b.base})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={convert}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        转换
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.base}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              <div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{result.name}</span>
                <p className="font-mono text-lg text-zinc-900 dark:text-zinc-100">{result.value}</p>
              </div>
              <button
                onClick={() => copy(result.value)}
                className="px-3 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded"
              >
                复制
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
