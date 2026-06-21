"use client";

import { useState } from "react";

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const generateHash = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const newResults: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      newResults[algo] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    setResults(newResults);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          输入内容
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="输入要计算哈希的文本"
        />
      </div>

      <button
        onClick={generateHash}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        生成哈希
      </button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-3">
          {Object.entries(results).map(([algo, hash]) => (
            <div key={algo} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {algo}
                </span>
                <button
                  onClick={() => copy(hash)}
                  className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  复制
                </button>
              </div>
              <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 break-all">
                {hash}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
