# Next.js Todo App

一个现代化的 Todo 应用，使用 Next.js 和 Tailwind CSS 构建，可以轻松部署到 Vercel。

## 功能特性

- ✅ 添加、编辑、删除待办事项
- ✅ 标记任务为完成/未完成
- ✅ 过滤任务（全部/进行中/已完成）
- ✅ 清除已完成的任务
- ✅ 响应式设计，支持深色模式
- ✅ 现代化的 UI 界面
- ✅ 双击编辑功能
- ✅ 键盘快捷键支持

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
│   ├── components/
│   │   ├── TodoApp.tsx      # 主应用组件
│   │   └── TodoItem.tsx     # 单个待办事项组件
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── public/                  # 静态资源
├── vercel.json             # Vercel 配置
└── package.json            # 项目依赖
```

## 技术栈

- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vercel** - 部署平台

## 使用说明

1. **添加任务**：在输入框中输入任务内容，按回车或点击"添加"按钮
2. **编辑任务**：双击任务文本进入编辑模式
3. **完成任务**：点击任务前的复选框
4. **删除任务**：悬停在任务上，点击删除按钮
5. **过滤任务**：使用顶部的过滤器按钮
6. **清除已完成**：点击"清除已完成"按钮删除所有已完成的任务

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
