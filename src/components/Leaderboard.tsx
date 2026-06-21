"use client";

import { useState, useEffect } from "react";

interface Score {
  id: number;
  game_id: string;
  player_name: string;
  score: number;
  level: number | null;
  created_at: string;
}

interface LeaderboardProps {
  gameId: string;
  gameName: string;
  isOpen: boolean;
  onClose: () => void;
  scoreLabel?: string;
}

export function Leaderboard({ gameId, gameName, isOpen, onClose, scoreLabel = "得分" }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/scores?gameId=${gameId}&limit=10`)
        .then((response) => response.json())
        .then((data) => {
          setScores(data);
          setLoading(false);
        })
        .catch(() => {
          console.error("Failed to load scores");
          setLoading(false);
        });
    }
  }, [isOpen, gameId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            🏆 {gameName} 排行榜
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100 mx-auto"></div>
              <p className="mt-2 text-sm text-zinc-500">加载中...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 dark:text-zinc-400">暂无记录</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">快来创造第一个记录吧！</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3
                      ? "bg-zinc-50 dark:bg-zinc-800"
                      : ""
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    index === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    index === 1 ? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" :
                    index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    "text-zinc-500 dark:text-zinc-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {score.player_name}
                    </p>
                    {score.level && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        等级 {score.level}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      {score.score}
                    </p>
                    <p className="text-xs text-zinc-400">{scoreLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function saveScore(gameId: string, score: number, playerName?: string, level?: number) {
  try {
    await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, score, playerName: playerName || "匿名", level }),
    });
  } catch {
    console.error("Failed to save score");
  }
}
