"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { games } from "@/lib/games-data";

interface SearchResult {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "tool" | "game";
  href: string;
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const toolResults: SearchResult[] = tools
      .filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        icon: t.icon,
        type: "tool" as const,
        href: t.downloadFile || `/tools/${t.id}`,
      }));

    const gameResults: SearchResult[] = games
      .filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
      .map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        icon: g.icon,
        type: "game" as const,
        href: g.link || "#",
      }));

    setResults([...toolResults, ...gameResults]);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // Parent should handle opening
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索工具或游戏..."
            className="flex-1 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {results.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
              未找到相关结果
            </div>
          )}

          {results.length === 0 && !query.trim() && (
            <div className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
              输入关键词搜索工具和游戏
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-2xl">{result.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {result.name}
                      </span>
                      <span className={`px-1.5 py-0.5 text-xs rounded ${
                        result.type === "tool"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}>
                        {result.type === "tool" ? "工具" : "游戏"}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      {result.description}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
