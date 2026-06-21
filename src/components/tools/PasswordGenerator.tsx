"use client";

import { useState } from "react";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("请至少选择一种字符类型");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
  };

  const getStrength = () => {
    if (length < 8) return { label: "弱", color: "text-red-500" };
    if (length < 12) return { label: "中", color: "text-yellow-500" };
    if (length < 16) return { label: "强", color: "text-green-500" };
    return { label: "非常强", color: "text-emerald-500" };
  };

  const strength = getStrength();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          密码长度：{length}
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="rounded"
          />
          大写字母 (A-Z)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="rounded"
          />
          小写字母 (a-z)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded"
          />
          数字 (0-9)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded"
          />
          特殊符号 (!@#$)
        </label>
      </div>

      <button
        onClick={generate}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
      >
        生成密码
      </button>

      {password && (
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${strength.color}`}>
              强度：{strength.label}
            </span>
            <button
              onClick={copy}
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              复制
            </button>
          </div>
          <p className="font-mono text-lg text-zinc-900 dark:text-zinc-100 break-all">
            {password}
          </p>
        </div>
      )}
    </div>
  );
}
