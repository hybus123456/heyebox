"use client";

import { useState } from "react";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generateUuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUuid());
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  const copyOne = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          生成数量
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-32 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          生成 UUID
        </button>
        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            复制全部
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <code className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
                {uuid}
              </code>
              <button
                onClick={() => copyOne(uuid)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
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
