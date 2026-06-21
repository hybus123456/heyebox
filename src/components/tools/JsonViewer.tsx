"use client";

import { useState } from "react";

function getType(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function JsonNode({ keyName, value, depth = 0 }: { keyName?: string; value: unknown; depth?: number }) {
  const type = getType(value);
  const [expanded, setExpanded] = useState(depth < 2);

  const typeColors: Record<string, string> = {
    string: "text-green-600 dark:text-green-400",
    number: "text-blue-600 dark:text-blue-400",
    boolean: "text-purple-600 dark:text-purple-400",
    null: "text-zinc-400",
    undefined: "text-zinc-400",
    object: "text-orange-600 dark:text-orange-400",
    array: "text-orange-600 dark:text-orange-400",
  };

  if (type === "object" || type === "array") {
    const entries = type === "array" 
      ? (value as unknown[]).map((v, i) => [i.toString(), v] as [string, unknown])
      : Object.entries(value as Record<string, unknown>);
    const bracket = type === "array" ? ["[", "]"] : ["{", "}"];

    return (
      <div style={{ paddingLeft: `${depth * 16}px` }}>
        <span
          className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-1 rounded"
          onClick={() => setExpanded(!expanded)}
        >
          {keyName !== undefined && <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;</span>}
          {keyName !== undefined && <span className="text-zinc-400">: </span>}
          <span className="text-zinc-400">{bracket[0]}</span>
          {!expanded && <span className="text-zinc-400"> {entries.length} items {bracket[1]}</span>}
          {!expanded && <span className="text-zinc-400">,</span>}
        </span>
        {expanded && (
          <>
            {entries.map(([k, v]) => (
              <JsonNode key={k} keyName={k} value={v} depth={depth + 1} />
            ))}
            <span style={{ paddingLeft: `${depth * 16}px` }} className="text-zinc-400">
              {bracket[1]},
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: `${depth * 16}px` }}>
      {keyName !== undefined && <span className="text-purple-600 dark:text-purple-400">&quot;{keyName}&quot;</span>}
      {keyName !== undefined && <span className="text-zinc-400">: </span>}
      <span className={typeColors[type]}>
        {type === "string" ? <>&quot;{value}&quot;</> : String(value)}
      </span>
      <span className="text-zinc-400">,</span>
    </div>
  );
}

export function JsonViewer() {
  const [input, setInput] = useState('{\n  "name": "荷叶box",\n  "version": "1.0",\n  "features": ["tools", "games"],\n  "config": {\n    "theme": "auto",\n    "language": "zh-CN"\n  }\n}');
  const [parsed, setParsed] = useState<unknown>(null);
  const [error, setError] = useState("");

  const parseJson = () => {
    try {
      const data = JSON.parse(input);
      setParsed(data);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setParsed(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输入 JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder='{"key": "value"}'
        />
      </div>

      <button
        onClick={parseJson}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        可视化
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {parsed !== null && (
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-auto">
          <pre className="font-mono text-sm">
            <JsonNode value={parsed} />
          </pre>
        </div>
      )}
    </div>
  );
}
