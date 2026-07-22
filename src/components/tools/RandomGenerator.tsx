"use client";

import { useState } from "react";

export function RandomGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [isInteger, setIsInteger] = useState(true);
  const [noDuplicates, setNoDuplicates] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [delimiter, setDelimiter] = useState("\n");

  const generate = () => {
    const nums: number[] = [];
    const maxAttempts = count * 100;
    let attempts = 0;

    while (nums.length < count && attempts < maxAttempts) {
      attempts++;
      let num: number;
      if (isInteger) {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        num = Math.random() * (max - min) + min;
        num = Math.round(num * 100) / 100;
      }

      if (noDuplicates && nums.includes(num)) continue;
      nums.push(num);
    }

    setResults(nums);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join(delimiter));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">最小值</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">最大值</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">数量</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">分隔符</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          >
            <option value="\n">换行</option>
            <option value=",">逗号</option>
            <option value=" ">空格</option>
            <option value="|">竖线</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={isInteger}
            onChange={(e) => setIsInteger(e.target.checked)}
            className="rounded"
          />
          整数
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={noDuplicates}
            onChange={(e) => setNoDuplicates(e.target.checked)}
            className="rounded"
          />
          不重复
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generate}
          className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          生成随机数
        </button>
        {results.length > 0 && (
          <button
            onClick={copyResults}
            className="px-6 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700"
          >
            复制结果
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">生成结果（{results.length}个）</span>
            <span className="text-xs text-zinc-400">
              最小：{Math.min(...results)} | 最大：{Math.max(...results)} | 
              平均：{(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
            </span>
          </div>
          <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100 max-h-48 overflow-auto">
            {results.join(delimiter === "\n" ? "\n" : delimiter === "," ? ", " : delimiter === " " ? " " : " | ")}
          </div>
        </div>
      )}
    </div>
  );
}
