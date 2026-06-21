import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-200/80 dark:border-zinc-800/80">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="荷叶box" width={32} height={32} />
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">荷叶box</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
              轻量、无冗余、本地优先的实用工具集合。所有工具纯客户端运行，保护您的隐私安全。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">快速链接</h3>
            <ul className="space-y-3">
              {[
                { href: "/tools", label: "工具列表" },
                { href: "/games", label: "游戏合集" },
                { href: "/changelog", label: "更新日志" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">更多</h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "关于" },
                { href: "/feedback", label: "反馈" },
                { href: "https://space.bilibili.com/2105587530", label: "作者B站", external: true },
              ].map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                &copy; {new Date().getFullYear()} 荷叶box
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                本地运行
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              保护您的隐私
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
