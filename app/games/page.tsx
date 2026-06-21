"use client";

import { useState } from "react";
import { GameCard } from "@/components/GameCard";
import { games, gameCategories } from "@/lib/games-data";
import { FadeIn, StaggerChildren } from "@/components/Animations";

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredGames =
    selectedCategory === "全部"
      ? games
      : games.filter((game) => game.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            游戏合集
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            个人开发的小游戏项目，包含英语学习、数学训练和休闲游戏
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="flex flex-wrap gap-3 mb-12">
          {gameCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                  : "glass-card text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={50} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </StaggerChildren>

      {filteredGames.length === 0 && (
        <FadeIn>
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-zinc-500 dark:text-zinc-400">
              该分类下暂无游戏
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
