"use client";

import { useState } from "react";

export function CronGenerator() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const presets = [
    { label: "每分钟", value: "* * * * *" },
    { label: "每小时", value: "0 * * * *" },
    { label: "每天零点", value: "0 0 * * *" },
    { label: "每天上午8点", value: "0 8 * * *" },
    { label: "每周一零点", value: "0 0 * * 1" },
    { label: "每月1号零点", value: "0 0 1 * *" },
    { label: "每5分钟", value: "*/5 * * * *" },
    { label: "工作日9点", value: "0 9 * * 1-5" },
  ];

  const getDescription = () => {
    const parts = [];
    if (minute === "*") parts.push("每分钟");
    else if (minute.startsWith("*/")) parts.push(`每${minute.slice(2)}分钟`);
    else parts.push(`第${minute}分钟`);

    if (hour === "*") parts.push("每小时");
    else if (hour.startsWith("*/")) parts.push(`每${hour.slice(2)}小时`);
    else parts.push(`${hour}点`);

    if (dayOfMonth !== "*") parts.push(`${dayOfMonth}号`);
    if (month !== "*") parts.push(`${month}月`);
    if (dayOfWeek !== "*") {
      const days = ["日", "一", "二", "三", "四", "五", "六"];
      parts.push(`周${days[parseInt(dayOfWeek)] || dayOfWeek}`);
    }

    return parts.join(" ");
  };

  const copy = () => {
    navigator.clipboard.writeText(cronExpression);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">分钟</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full px-2 py-2 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">小时</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full px-2 py-2 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">日</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full px-2 py-2 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">月</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-2 py-2 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">星期</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full px-2 py-2 text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Cron 表达式</span>
          <button
            onClick={copy}
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            复制
          </button>
        </div>
        <p className="font-mono text-lg text-zinc-900 dark:text-zinc-100">{cronExpression}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{getDescription()}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          常用预设
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                const parts = preset.value.split(" ");
                setMinute(parts[0]);
                setHour(parts[1]);
                setDayOfMonth(parts[2]);
                setMonth(parts[3]);
                setDayOfWeek(parts[4]);
              }}
              className="px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
