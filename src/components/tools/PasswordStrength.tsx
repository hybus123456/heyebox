"use client";

import { useState, useMemo } from "react";

interface PasswordAnalysis {
  score: number;
  level: string;
  color: string;
  suggestions: string[];
  details: { label: string; passed: boolean }[];
}

export function PasswordStrength() {
  const [password, setPassword] = useState("");

  const analysis = useMemo((): PasswordAnalysis => {
    if (!password) {
      return { score: 0, level: "请输入密码", color: "text-zinc-400", suggestions: [], details: [] };
    }

    const details = [
      { label: "长度 >= 8", passed: password.length >= 8 },
      { label: "长度 >= 12", passed: password.length >= 12 },
      { label: "包含大写字母", passed: /[A-Z]/.test(password) },
      { label: "包含小写字母", passed: /[a-z]/.test(password) },
      { label: "包含数字", passed: /\d/.test(password) },
      { label: "包含特殊字符", passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
      { label: "无连续字符", passed: !/(.)\1{2,}/.test(password) },
      { label: "无常见模式", passed: !/123|abc|qwe|password|admin/i.test(password) },
    ];

    const passedCount = details.filter(d => d.passed).length;
    const score = Math.round((passedCount / details.length) * 100);

    let level: string;
    let color: string;
    if (score < 30) { level = "弱"; color = "text-red-500"; }
    else if (score < 50) { level = "较弱"; color = "text-orange-500"; }
    else if (score < 70) { level = "中等"; color = "text-yellow-500"; }
    else if (score < 90) { level = "强"; color = "text-green-500"; }
    else { level = "非常强"; color = "text-emerald-500"; }

    const suggestions: string[] = [];
    if (password.length < 12) suggestions.push("增加密码长度到12位以上");
    if (!/[A-Z]/.test(password)) suggestions.push("添加大写字母");
    if (!/[a-z]/.test(password)) suggestions.push("添加小写字母");
    if (!/\d/.test(password)) suggestions.push("添加数字");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) suggestions.push("添加特殊字符");

    return { score, level, color, suggestions, details };
  }, [password]);

  const crackTime = useMemo(() => {
    if (!password) return "";
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/\d/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
    
    const combinations = Math.pow(poolSize, password.length);
    const guessesPerSecond = 1e10;
    const seconds = combinations / guessesPerSecond;
    
    if (seconds < 1) return "瞬间破解";
    if (seconds < 60) return `约 ${Math.round(seconds)} 秒`;
    if (seconds < 3600) return `约 ${Math.round(seconds / 60)} 分钟`;
    if (seconds < 86400) return `约 ${Math.round(seconds / 3600)} 小时`;
    if (seconds < 86400 * 365) return `约 ${Math.round(seconds / 86400)} 天`;
    if (seconds < 86400 * 365 * 1000) return `约 ${Math.round(seconds / (86400 * 365))} 年`;
    return "数千年以上";
  }, [password]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">输入密码</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          placeholder="输入要检测的密码"
        />
      </div>

      {password && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    analysis.score < 30 ? "bg-red-500" :
                    analysis.score < 50 ? "bg-orange-500" :
                    analysis.score < 70 ? "bg-yellow-500" :
                    analysis.score < 90 ? "bg-green-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>
            <span className={`text-lg font-bold ${analysis.color}`}>{analysis.level}</span>
          </div>

          <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">暴力破解时间</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{crackTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">得分</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{analysis.score}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {analysis.details.map((detail) => (
              <div
                key={detail.label}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  detail.passed 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                <span>{detail.passed ? "✓" : "✗"}</span>
                <span>{detail.label}</span>
              </div>
            ))}
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">建议</p>
              <ul className="space-y-1">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-yellow-700 dark:text-yellow-400">• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
