"use client";

import { useState } from "react";

export function JsonToTs() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "isActive": true,\n  "tags": ["dev", "admin"]\n}');
  const [output, setOutput] = useState("");
  const [typeName, setTypeName] = useState("User");

  const convert = () => {
    try {
      const json = JSON.parse(input);
      const result = generateInterface(json, typeName);
      setOutput(result);
    } catch {
      setOutput("// 无效的 JSON 格式");
    }
  };

  const generateInterface = (obj: Record<string, unknown>, name: string): string => {
    const lines: string[] = [`interface ${name} {`];

    for (const [key, value] of Object.entries(obj)) {
      const type = getType(value);
      lines.push(`  ${key}: ${type};`);
    }

    lines.push("}");
    return lines.join("\n");
  };

  const getType = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      const elementType = getType(value[0]);
      return `${elementType}[]`;
    }
    if (typeof value === "object") return "Record<string, unknown>";
    return typeof value;
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          类型名称
        </label>
        <input
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="w-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            JSON 输入
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            placeholder='{"key": "value"}'
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            TypeScript 输出
          </label>
          <pre className="w-full h-48 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm overflow-auto">
            {output || "// 点击转换按钮生成 TypeScript 类型"}
          </pre>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={convert}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          转换
        </button>
        {output && (
          <button
            onClick={copy}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            复制
          </button>
        )}
      </div>
    </div>
  );
}
