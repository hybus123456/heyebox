import { FadeIn, StaggerChildren } from "@/components/Animations";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            关于荷叶box
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            个人工具箱的初衷与理念
          </p>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={100} className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            初衷
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            荷叶box 是一个个人工具集门户，旨在提供轻量、实用的在线工具。
            不是博客，不是简历，而是一个纯粹的工具箱，专注于解决日常开发和工作中的实际问题。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            技术栈
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Next.js - React 框架
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              TypeScript - 类型安全
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Tailwind CSS - 样式方案
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            隐私策略
          </h2>
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              所有工具均在本地运行，不上传任何用户数据到服务器。
              我们重视您的隐私，不会收集、存储或分享任何个人信息。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            开源状态
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            荷叶box 是一个开源项目，欢迎贡献代码和提出建议。
          </p>
        </section>
      </StaggerChildren>
    </div>
  );
}
