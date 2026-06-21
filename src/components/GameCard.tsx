import Link from "next/link";
import { Game } from "@/lib/games-data";

interface GameCardProps {
  game: Game;
}

const statusColors: Record<string, string> = {
  可玩: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  开发中: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const categoryColors: Record<string, string> = {
  "英语学习": "from-blue-500/10 to-purple-500/10",
  "数学训练": "from-orange-500/10 to-red-500/10",
  "休闲游戏": "from-green-500/10 to-teal-500/10",
  "default": "from-zinc-500/5 to-transparent",
};

export function GameCard({ game }: GameCardProps) {
  const href = game.action === "download" ? game.downloadFile || "#" : game.link || "#";
  const isExternal = game.action === "link" && game.link?.startsWith("http");
  const gradientClass = game.category ? (categoryColors[game.category] || categoryColors["default"]) : categoryColors["default"];

  const content = (
    <div className="group relative flex flex-col p-5 rounded-2xl glass-card overflow-hidden">
      {/* Category gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-100/80 to-zinc-50/80 dark:from-zinc-800/80 dark:to-zinc-900/80 flex items-center justify-center text-2xl shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-sm">
          {game.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {game.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-2 mt-auto pt-3 border-t border-zinc-200/30 dark:border-zinc-700/30">
        <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
          {game.techStack}
        </span>
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm ${statusColors[game.status]}`}>
          {game.status}
        </span>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-xl bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 group-hover:bg-green-600/90 dark:group-hover:bg-green-400/90 transition-colors backdrop-blur-sm">
            {game.action === "download" ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载
              </>
            ) : (
              <>
                开始游戏
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
