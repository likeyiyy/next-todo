'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import '../../../styles/markdown.css';

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState(`# 欢迎使用 Markdown 编辑器

这是一个示例 Markdown 文档，展示了基本的语法功能。

## 文本格式

**粗体文本** 和 *斜体文本*，以及 ~~删除线~~

## 列表

### 无序列表
- 项目 1
- 项目 2
- 项目 3

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 代码

行内代码 \`console.log('Hello')\`

\`\`\`javascript
// 代码块
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## 链接和图片

[GitHub](https://github.com)

## 引用

> 这是一段引用文本
> 可以有多行

## 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

---

开始编辑你的 Markdown 文档吧！`);
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');

  const handleExport = (format: 'markdown' | 'html') => {
    if (format === 'markdown') {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // 使用浏览器内置的转换功能
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClear = () => {
    setMarkdown('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('split')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'split'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                分屏视图
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                仅编辑
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                仅预览
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-sm font-medium">
                导入 MD
                <input
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => handleExport('markdown')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                导出 MD
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                清空
              </button>
            </div>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-280px)]">
          {/* Markdown Editor */}
          {(activeTab === 'split' || activeTab === 'edit') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Markdown 编辑器
                </h3>
              </div>
              <div className="h-full">
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="在这里输入您的 Markdown 代码..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {(activeTab === 'split' || activeTab === 'preview') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  预览效果
                </h3>
              </div>
              <div className="h-full p-6 overflow-y-auto bg-white dark:bg-gray-900">
                <div className="markdown-body prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 Markdown 语法提示
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 使用 # ## ### 创建标题</li>
            <li>• 使用 **粗体** 和 *斜体* 格式化文本</li>
            <li>• 使用 [文本](链接) 创建链接</li>
            <li>• 使用 \`代码\` 表示行内代码，使用 \`\`\` 代码块 \`\`\` 表示代码块</li>
            <li>• 使用 &gt; 创建引用，使用 --- 创建水平线</li>
          </ul>
        </div>
      </main>
    </div>
  );
}