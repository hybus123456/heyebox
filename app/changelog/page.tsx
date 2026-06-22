import { FadeIn, StaggerChildren } from "@/components/Animations";

const changelog = [
  {
    version: "1.2.0",
    date: "2026-06-22",
    changes: [
      { type: "新增", description: "反馈管理后台（/admin）" },
      { type: "新增", description: "后台密码登录验证" },
      { type: "修复", description: "修复玻璃透明度调节功能" },
      { type: "改进", description: "用户端不再显示他人反馈" },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-06-21",
    changes: [
      { type: "新增", description: "液态玻璃效果（毛玻璃+光泽+模糊）" },
      { type: "新增", description: "用户可调节玻璃透明度（右下角设置按钮）" },
      { type: "改进", description: "工具和游戏分类间距加大" },
      { type: "改进", description: "所有卡片使用液态玻璃效果" },
    ],
  },
  {
    version: "1.0.3",
    date: "2026-06-21",
    changes: [
      { type: "修复", description: "修复打字测试页面乱码问题" },
      { type: "改进", description: "打字测试只保留英文文本，避免中英文混合输入问题" },
    ],
  },
  {
    version: "1.0.2",
    date: "2026-06-21",
    changes: [
      { type: "修复", description: "修复登录后状态不更新问题" },
      { type: "改进", description: "登录成功后自动刷新用户状态" },
    ],
  },
  {
    version: "1.0.1",
    date: "2026-06-21",
    changes: [
      { type: "修复", description: "2048游戏上下方向修复" },
      { type: "新增", description: "2048和昆虫记游戏支持WASD控制" },
      { type: "改进", description: "关于和反馈页面添加淡入动画" },
      { type: "安全", description: "验证码验证函数移至独立工具文件" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-06-21",
    changes: [
      { type: "新增", description: "重新设计极简风格Logo（线条描边）" },
      { type: "新增", description: "新增5个工具：CSS单位转换、颜色调色板、JSON可视化、词频统计、密码强度检测" },
      { type: "新增", description: "新增3个游戏：打字速度测试、2048、数独" },
      { type: "新增", description: "算术验证码防机器人（登录和反馈）" },
      { type: "改进", description: "首页改为高级灰白配色" },
      { type: "改进", description: "卡片悬停效果优化（上浮、渐变叠加）" },
      { type: "改进", description: "玻璃拟态导航栏" },
      { type: "改进", description: "页面淡入动画" },
      { type: "修复", description: "修复验证码发送失败问题" },
      { type: "安全", description: "反馈API添加输入验证和清理" },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-06-20",
    changes: [
      { type: "新增", description: "荷叶风格Logo设计" },
      { type: "新增", description: "B站视频下载器和转音频工具" },
      { type: "新增", description: "影音工具分类" },
      { type: "改进", description: "UI高级化：玻璃拟态、动画效果、卡片悬停" },
      { type: "改进", description: "加载骨架屏组件" },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "全局搜索功能，支持搜索工具和游戏（⌘K）" },
      { type: "新增", description: "游戏成绩保存和排行榜系统" },
      { type: "新增", description: "工具收藏功能" },
      { type: "新增", description: "邮箱验证码登录系统" },
      { type: "新增", description: "自定义404页面" },
      { type: "改进", description: "优化首页展示，添加统计信息和特性介绍" },
    ],
  },
  {
    version: "0.7.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "新增速算挑战游戏，锻炼计算能力" },
      { type: "新增", description: "新增数字记忆游戏，提升记忆力" },
      { type: "新增", description: "新增24点游戏，训练逻辑思维" },
      { type: "新增", description: "新增数学训练游戏分类" },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "新增单词配对记忆游戏，锻炼记忆力" },
      { type: "新增", description: "新增完形填空挑战游戏，提升阅读理解" },
      { type: "新增", description: "新增单词速记挑战游戏，快速记忆单词" },
      { type: "新增", description: "游戏页面添加分类筛选功能" },
      { type: "改进", description: "英语学习游戏达到4个" },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "新增B站视频下载器工具" },
      { type: "新增", description: "新增B站视频转音频工具" },
      { type: "新增", description: "新增影音工具分类" },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "新增6个实用工具：二维码生成器、文本对比、JSON转TS、进制转换、Cron生成器、Lorem生成器" },
      { type: "新增", description: "反馈系统使用 SQLite 数据库存储" },
      { type: "改进", description: "工具总数达到19个" },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "实现12个在线工具（JSON格式化、Base64、URL编解码等）" },
      { type: "新增", description: "集成反应力测试游戏" },
      { type: "新增", description: "集成昆虫记科普游戏" },
      { type: "新增", description: "新增单词拼写挑战游戏（5000+单词库）" },
      { type: "新增", description: "新增游戏合集页面" },
      { type: "新增", description: "新增Win10激活工具下载" },
      { type: "修复", description: "修复浅色模式样式问题" },
      { type: "改进", description: "反馈功能支持本地保存和查看" },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-06-19",
    changes: [
      { type: "新增", description: "实现工具详情页面路由" },
      { type: "新增", description: "添加工具分类筛选功能" },
      { type: "改进", description: "优化导航栏响应式布局" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-06-13",
    changes: [
      { type: "新增", description: "项目初始化，搭建基础框架" },
      { type: "新增", description: "实现顶部导航栏、页脚组件" },
      { type: "新增", description: "实现首页 Hero 区域" },
      { type: "新增", description: "实现工具卡片展示" },
      { type: "新增", description: "支持暗黑/浅色主题切换" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            更新日志
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            版本迭代记录
          </p>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={100} className="space-y-8">
        {changelog.map((release) => (
          <div
            key={release.version}
            className="relative pl-8 border-l-2 border-zinc-200 dark:border-zinc-800"
          >
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  v{release.version}
                </h2>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {release.date}
                </span>
              </div>
            </div>
            <ul className="space-y-2">
              {release.changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      change.type === "新增"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : change.type === "修复"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {change.type}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {change.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </StaggerChildren>
    </div>
  );
}
