import Link from "next/link";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "stable" | "beta";
  icon: string;
  downloadFile?: string;
}

interface ToolCardProps {
  tool: Tool;
}

const categoryColors: Record<string, string> = {
  文本处理: "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  图片媒体: "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  影音工具: "bg-pink-100/80 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  加密校验: "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  计算换算: "bg-orange-100/80 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  开发辅助: "bg-cyan-100/80 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  系统工具: "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const statusColors: Record<string, string> = {
  stable: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  beta: "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.downloadFile || `/tools/${tool.id}`} className="block">
      <div className="group relative flex flex-col p-5 rounded-2xl glass-card overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-100/80 to-zinc-50/80 dark:from-zinc-800/80 dark:to-zinc-900/80 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
              {tool.icon}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                {tool.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-2 mt-auto pt-3 border-t border-zinc-200/30 dark:border-zinc-700/30">
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm ${categoryColors[tool.category] || "bg-zinc-100/80 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"}`}>
            {tool.category}
          </span>
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium backdrop-blur-sm ${statusColors[tool.status]}`}>
            {tool.status === "stable" ? "稳定" : "测试版"}
          </span>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {tool.downloadFile ? "下载" : "打开"}
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
