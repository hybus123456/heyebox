"use client";

import { useState } from "react";

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = testString.match(regex);
      setMatches(found || []);
      setError("");
    } catch {
      setError("无效的正则表达式");
      setMatches([]);
    }
  };

  const highlightMatches = () => {
    if (!pattern || matches.length === 0) return testString;

    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `【${match}】`);
    } catch {
      return testString;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          正则表达式
        </label>
        <div className="flex gap-2">
          <span className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="[a-z]+"
          />
          <span className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="g"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          测试字符串
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="输入要测试的文本"
        />
      </div>

      <button
        onClick={testRegex}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        测试匹配
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              匹配结果 ({matches.length} 个)
            </p>
            <div className="space-y-1">
              {matches.map((match, index) => (
                <p key={index} className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                  {index}: {match}
                </p>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              高亮显示
            </p>
            <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
              {highlightMatches()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
