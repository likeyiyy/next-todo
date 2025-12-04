# 个人工具集

一个现代化的在线工具集合，使用 Next.js 和 Tailwind CSS 构建，可以轻松部署到 Vercel。包含了 14 个实用工具，涵盖了开发、文本处理、设计、安全等多个领域。

## 功能特性

### Todo 应用
- ✅ 添加、编辑、删除待办事项
- ✅ 标记任务为完成/未完成
- ✅ 过滤任务（全部/进行中/已完成）
- ✅ 清除已完成的任务
- ✅ 响应式设计，支持深色模式
- ✅ 现代化的 UI 界面
- ✅ 双击编辑功能
- ✅ 键盘快捷键支持
- ✅ 数据持久化存储

### 其他工具
- 📝 JSON 编辑器 - 在线 JSON 编辑器，支持格式化、验证和美化
- 📊 文本对比工具 - 快速对比两段文本的差异，高亮显示变化
- 🌍 全球时钟 - 实时显示全球主要城市的当前时间
- 🌐 HTML 预览 - 实时编辑和预览 HTML 代码，支持导入导出
- 📄 Markdown 编辑器 - 实时编辑和预览 Markdown，支持导出 HTML/PDF
- 🔍 正则表达式 - 测试和调试正则表达式，显示匹配结果
- 🔗 URL 编码器 - URL 编码、解码、Base64 编码等常用转换
- 🔐 密码生成器 - 生成安全的随机密码，可自定义长度和字符
- ⏰ 时间戳转换 - Unix 时间戳与日期时间相互转换
- 📈 字符计数器 - 统计字符数、单词数、段落数和阅读时间
- 📱 二维码生成 - 生成各种类型的二维码，支持 WiFi、联系人
- 🎨 颜色选择器 - 取色器、调色板生成、颜色格式转换
- 🖼️ 图片压缩 - 在线压缩图片，支持 JPG/PNG/WebP

## 本地开发

首先安装依赖：

```bash
npm install
```

然后启动开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到 Vercel

### 方法一：通过 Vercel CLI（推荐）

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 在项目根目录运行：
```bash
vercel
```

3. 按照提示完成配置，Vercel 会自动检测到这是一个 Next.js 项目。

### 方法二：通过 Vercel 网站

1. 将代码推送到 GitHub：
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. 访问 [vercel.com](https://vercel.com) 并登录
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. Vercel 会自动检测项目类型并配置部署设置
6. 点击 "Deploy" 开始部署

### 方法三：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/next-todo)

## 项目结构

```
next-todo/
├── app/
│   ├── api/                 # API 路由
│   │   ├── auth/            # 认证相关 API
│   │   └── todos/           # Todo 应用 API
│   ├── auth/                # 认证页面
│   ├── components/          # React 组件
│   ├── providers/           # React providers
│   ├── tools/               # 各工具页面
│   │   ├── todo/            # Todo 应用页面
│   │   ├── json-editor/     # JSON 编辑器页面
│   │   ├── text-compare/    # 文本对比工具页面
│   │   ├── global-clock/    # 全球时钟页面
│   │   ├── html-preview/    # HTML 预览页面
│   │   ├── markdown-editor/ # Markdown 编辑器页面
│   │   ├── regex-tester/    # 正则表达式页面
│   │   ├── url-encoder/     # URL 编码器页面
│   │   ├── password-generator/ # 密码生成器页面
│   │   ├── timestamp-converter/ # 时间戳转换页面
│   │   ├── character-counter/ # 字符计数器页面
│   │   ├── qr-generator/    # 二维码生成页面
│   │   ├── color-picker/    # 颜色选择器页面
│   │   └── image-compressor/ # 图片压缩页面
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── lib/                     # 共享工具库
│   └── todo-api.ts          # Todo API 客户端
├── public/                  # 静态资源
├── vercel.json             # Vercel 配置
└── package.json            # 项目依赖
```

## 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vercel Postgres** - 数据库（用于 Todo 应用）
- **NextAuth.js** - 认证系统
- **Vercel** - 部署平台

## 使用说明

### Todo 应用使用方法
1. **添加任务**：在输入框中输入任务内容，按回车或点击"添加"按钮
2. **编辑任务**：双击任务文本进入编辑模式
3. **完成任务**：点击任务前的复选框
4. **删除任务**：悬停在任务上，点击删除按钮
5. **过滤任务**：使用顶部的过滤器按钮
6. **清除已完成**：点击"清除已完成"按钮删除所有已完成的任务

### 其他工具使用方法
- 访问主页选择相应的工具
- 每个工具都有特定的功能和操作界面
- 所有工具都支持响应式设计，在移动设备上也能良好使用

## 自定义配置

你可以在 `vercel.json` 中自定义 Vercel 部署配置：

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## 许可证

MIT License
