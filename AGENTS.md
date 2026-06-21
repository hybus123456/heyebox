# AGENTS.md

## 项目
荷叶box — 个人工具箱门户，不是博客、不是简历。
调性：极简、科技感、克制。禁止花哨动效。
本地优先，隐私保护，工具纯客户端运行。

## 技术栈
- Next.js（App Router，`app/` 目录）
- TypeScript（严格模式）
- Tailwind CSS v4（纯工具类，不用自定义 CSS）
- npm
- SQLite（sql.js）存储反馈、成绩、用户数据
- nodemailer 发送验证码邮件

## 开发命令
npm run dev          # 本地开发
npm run build        # 生产构建
npm run lint         # ESLint 检查
npx tsc --noEmit     # TypeScript 类型检查

## 架构
- 工具放在 `src/components/tools/`，每个工具独立组件
- 工具元数据在 `src/lib/tools-data.ts`
- 游戏放在 `app/games/<游戏名>/page.tsx`
- 游戏元数据在 `src/lib/games-data.ts`
- 共享组件放 `src/components/`
- 工具函数放 `src/lib/`
- 数据库操作放 `src/lib/db.ts`
- 邮件发送放 `src/lib/email.ts`
- 验证码工具放 `src/lib/captcha.ts`

## 样式规范
- 只用 Tailwind，不用自定义 CSS（除非必要）
- 配色：黑白灰为主，低饱和度
- 暗黑/浅色：用 `dark:` 类策略（next-themes）
- 卡片：统一尺寸、圆角，网格布局
- 导航：固定顶部栏 — Logo、导航链接、搜索、主题切换、登录
- 首屏 Hero：标题 + 标语 + 两个按钮，背景浅灰渐变

## 页面结构
/               # 首屏 Hero + 精选工具 + 游戏
/tools          # 全部工具网格，按分类筛选
/tools/[id]     # 工具详情页
/games          # 全部游戏，按分类筛选
/games/[name]   # 游戏页面
/changelog      # 更新日志，时间倒序
/about          # 关于、技术栈、隐私策略
/feedback       # 反馈入口（带验证码）
/login          # 邮箱验证码登录
/profile        # 用户中心

## API 路由
/api/feedback          # GET 获取反馈 / POST 提交反馈
/api/feedback/[id]     # DELETE 删除反馈
/api/scores            # GET 获取成绩 / POST 保存成绩
/api/favorites         # GET/POST/DELETE 收藏管理
/api/auth/send-code    # POST 发送验证码
/api/auth/verify       # POST 验证码登录
/api/auth/me           # GET 获取当前用户
/api/auth/logout       # POST 退出登录
/api/auth/check-email  # GET 检查邮箱是否已注册
/api/words             # GET 获取单词（拼写游戏用）

## 安全措施
- SQL 使用参数化查询防注入
- 输入验证和清理（去除HTML标签、限制长度）
- 算术验证码防机器人
- 验证码token有过期时间（5分钟）

## 页脚（必须包含）
- 版权信息
- 备案号（国内部署时）
- 隐私说明链接
- 作者 Bilibili：https://space.bilibili.com/2105587530

## 游戏控制
- 方向控制：同时支持 WASD 和方向键
- 2048/昆虫记等游戏都支持双套按键

## 命名规范
- 组件：PascalCase
- 工具函数/hooks：camelCase
- 工具目录：kebab-case
- 不加注释（除非被要求）
- 不调用外部 API 收集用户数据
- 每次更改需更新 `/changelog` 页面

## 环境变量（.env.local）
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=邮箱@qq.com
SMTP_PASS=授权码
```
