"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

interface Favorite {
  id: number;
  item_id: string;
  item_type: string;
  created_at: string;
}

interface Score {
  id: number;
  game_id: string;
  score: number;
  level: number | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"favorites" | "scores">("favorites");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (!data.user) {
            router.push("/login");
            return;
          }
          setUser(data.user);
          
          // Fetch user data
          const [favRes, scoreRes] = await Promise.all([
            fetch("/api/favorites"),
            fetch("/api/scores?limit=20"),
          ]);
          
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavorites(favData);
          }
          
          if (scoreRes.ok) {
            const scoreData = await scoreRes.json();
            setScores(scoreData);
          }
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      console.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          个人中心
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-600 dark:text-zinc-300">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {user.name || "用户"}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">注册时间</span>
                <span className="text-zinc-900 dark:text-zinc-100">{user.created_at}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">收藏数</span>
                <span className="text-zinc-900 dark:text-zinc-100">{favorites.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500 dark:text-zinc-400">游戏记录</span>
                <span className="text-zinc-900 dark:text-zinc-100">{scores.length}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full mt-6 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "favorites"
                    ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                我的收藏
              </button>
              <button
                onClick={() => setActiveTab("scores")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "scores"
                    ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                游戏成绩
              </button>
            </div>

            <div className="p-6">
              {activeTab === "favorites" && (
                <div>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-zinc-500 dark:text-zinc-400 mb-4">暂无收藏</p>
                      <Link
                        href="/tools"
                        className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                      >
                        去收藏工具 &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((fav) => (
                        <div
                          key={fav.id}
                          className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              fav.item_type === "tool"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}>
                              {fav.item_type === "tool" ? "工具" : "游戏"}
                            </span>
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">
                              {fav.item_id}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400">{fav.created_at}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "scores" && (
                <div>
                  {scores.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-zinc-500 dark:text-zinc-400 mb-4">暂无游戏记录</p>
                      <Link
                        href="/games"
                        className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                      >
                        去玩游戏 &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scores.map((score) => (
                        <div
                          key={score.id}
                          className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {score.game_id}
                            </p>
                            {score.level && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                等级 {score.level}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                              {score.score}
                            </p>
                            <p className="text-xs text-zinc-400">{score.created_at}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
