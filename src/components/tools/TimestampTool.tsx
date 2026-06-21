"use client";

import { useState } from "react";

function getInitialTimestamp() {
  const now = new Date();
  return {
    timestamp: Math.floor(now.getTime() / 1000).toString(),
    date: now.toISOString().slice(0, 19),
  };
}

export function TimestampTool() {
  const initial = getInitialTimestamp();
  const [timestamp, setTimestamp] = useState(initial.timestamp);
  const [date, setDate] = useState(initial.date);

  const timestampToDate = (ts: string) => {
    const num = parseInt(ts);
    if (isNaN(num)) return;
    const d = new Date(num * 1000);
    setDate(d.toISOString().slice(0, 19));
  };

  const dateToTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  };

  const now = () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    setTimestamp(ts);
    timestampToDate(ts);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Unix 时间戳（秒）
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.value);
                timestampToDate(e.target.value);
              }}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
            <button
              onClick={() => copy(timestamp)}
              className="px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              复制
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            日期时间
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                dateToTimestamp(e.target.value);
              }}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
            <button
              onClick={() => copy(date)}
              className="px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              复制
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={now}
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        获取当前时间
      </button>

      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          当前服务器时间：{new Date().toLocaleString("zh-CN")}
        </p>
      </div>
    </div>
  );
}
