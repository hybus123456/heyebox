"use client";

import { useState } from "react";

export function UrlEncode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput("错误：无效的输入");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "encode"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === "decode"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}
        >
          解码
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          输入内容
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder={mode === "encode" ? "https://example.com/路径" : "https%3A%2F%2Fexample.com%2F%E8%B7%AF%E5%BE%84"}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={process}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          {mode === "encode" ? "编码" : "解码"}
        </button>
        {output && (
          <button
            onClick={copy}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            复制结果
          </button>
        )}
      </div>

      {output && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            输出结果
          </label>
          <pre className="w-full h-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm overflow-auto break-all">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
