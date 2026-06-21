import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          页面未找到
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/tools"
            className="px-6 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            浏览工具
          </Link>
        </div>
      </div>
    </div>
  );
}
