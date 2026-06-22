"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

interface Feedback {
  id: number;
  type: string;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, setTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadFeedbacks();
      } else {
        setError("密码错误");
      }
    } catch {
      setError("登录失败");
    }
  };

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/feedbacks");
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch {
      console.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id: number) => {
    if (!confirm("确定删除这条反馈？")) return;

    try {
      const response = await fetch(`/api/admin/feedbacks?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter((f) => f.id !== id));
      }
    } catch {
      console.error("Failed to delete feedback");
    }
  };

  const typeLabels: Record<string, string> = {
    bug: "报告问题",
    feature: "功能建议",
    other: "其他",
  };

  const typeColors: Record<string, string> = {
    bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    other: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">管理后台</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">请输入管理密码</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">反馈管理</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">共 {feedbacks.length} 条反馈</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={loadFeedbacks}
              className="px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              刷新
            </button>
            <button
              onClick={() => {
                document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setIsAuthenticated(false);
                setFeedbacks([]);
              }}
              className="px-4 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              退出
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto"></div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">加载中...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">暂无反馈</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    内容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      #{feedback.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[feedback.type] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                        {typeLabels[feedback.type] || feedback.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100 max-w-md truncate">
                      {feedback.content}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {feedback.created_at}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteFeedback(feedback.id)}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
