"use client";

import { useState } from "react";

export function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<{ type: "same" | "added" | "removed"; text: string }[]>([]);

  const compare = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: { type: "same" | "added" | "removed"; text: string }[] = [];

    const maxLen = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      if (line1 === line2) {
        result.push({ type: "same", text: line1 });
      } else {
        if (line1) result.push({ type: "removed", text: line1 });
        if (line2) result.push({ type: "added", text: line2 });
      }
    }

    setDiffResult(result);
  };

  const stats = {
    same: diffResult.filter((r) => r.type === "same").length,
    added: diffResult.filter((r) => r.type === "added").length,
    removed: diffResult.filter((r) => r.type === "removed").length,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            原始文本
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            className="w-full h-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="输入原始文本..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            对比文本
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            className="w-full h-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder="输入对比文本..."
          />
        </div>
      </div>

      <button
        onClick={compare}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        对比文本
      </button>

      {diffResult.length > 0 && (
        <div>
          <div className="flex gap-4 mb-3 text-sm">
            <span className="text-zinc-500">相同: {stats.same}</span>
            <span className="text-green-600">新增: {stats.added}</span>
            <span className="text-red-600">删除: {stats.removed}</span>
          </div>
          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 font-mono text-sm max-h-64 overflow-auto">
            {diffResult.map((line, index) => (
              <div
                key={index}
                className={`px-2 py-0.5 ${
                  line.type === "added"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : line.type === "removed"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className="inline-block w-6 text-zinc-400">
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                </span>
                {line.text || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
