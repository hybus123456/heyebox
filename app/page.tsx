import Link from "next/link";
import Image from "next/image";
import { ToolCard } from "@/components/ToolCard";
import { GameCard } from "@/components/GameCard";
import { tools } from "@/lib/tools-data";
import { games } from "@/lib/games-data";
import { FadeIn, StaggerChildren } from "@/components/Animations";

export default function Home() {
  const featuredTools = tools.filter((t) => !t.downloadFile).slice(0, 6);
  const featuredGames = games.filter((g) => g.category === "英语学习" || g.category === "数学训练").slice(0, 6);
  const toolCategories = [...new Set(tools.map((t) => t.category))].length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-green" />
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        {/* Soft glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-zinc-500 dark:text-zinc-400 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
                持续更新中
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={100}>
            <Image
              src="/logo-large.svg"
              alt="荷叶box"
              width={100}
              height={100}
              className="mx-auto mb-10"
              priority
            />
          </FadeIn>
          
          <FadeIn delay={200}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-5">
              荷叶box
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-lg mx-auto leading-relaxed">
              轻量 · 实用 · 本地优先
              <br />
              <span className="text-zinc-400 dark:text-zinc-500">你的专属工具箱</span>
            </p>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link
                href="/tools"
                className="btn-shine inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                浏览工具
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 glass rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                游戏合集
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { value: tools.length, label: "工具" },
                { value: games.length, label: "游戏" },
                { value: toolCategories, label: "分类" },
                { value: "∞", label: "可能" },
              ].map((stat, index) => (
                <div key={index} className="glass-card rounded-2xl py-4 px-3 text-center">
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
        
        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 flex justify-center pt-1">
            <div className="w-1 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                Featured Tools
              </p>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                热门工具
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              全部
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeIn>
        
        <StaggerChildren staggerDelay={60} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </StaggerChildren>
      </section>

      {/* Games Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
                  Learning Games
                </p>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  学习游戏
                </h2>
              </div>
              <Link
                href="/games"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
              >
                全部
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeIn>
          
          <StaggerChildren staggerDelay={60} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
              Why Us
            </p>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              为什么选择荷叶box
            </h2>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "本地优先",
              description: "所有工具纯客户端运行，数据不上传服务器",
              icon: "🔒",
            },
            {
              title: "轻量快速",
              description: "无需注册登录，打开即用，响应迅速",
              icon: "⚡",
            },
            {
              title: "持续更新",
              description: "不断添加新工具和游戏，满足更多需求",
              icon: "✨",
            },
          ].map((feature, index) => (
            <FadeIn key={index} delay={index * 100}>
              <div className="group p-8 rounded-2xl glass-card">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
