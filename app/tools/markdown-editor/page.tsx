'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

// 自定义CSS样式
const customStyles = `
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: none;
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-preview h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-preview h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-preview h3 {
  font-size: 1.25em;
}

.markdown-preview p {
  margin-bottom: 16px;
}

.markdown-preview code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
}

.markdown-preview pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-preview pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-preview blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-preview li {
  margin-bottom: 0.25em;
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-preview th,
.markdown-preview td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-preview th {
  font-weight: 600;
  background-color: #f6f8fa;
}

.markdown-preview tr:nth-child(even) {
  background-color: #f6f8fa;
}

.markdown-preview hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.markdown-preview a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-preview a:hover {
  text-decoration: underline;
}

.dark .markdown-preview {
  color: #c9d1d9;
}

.dark .markdown-preview h1,
.dark .markdown-preview h2 {
  border-bottom-color: #30363d;
}

.dark .markdown-preview code {
  background-color: rgba(110, 118, 129, 0.4);
}

.dark .markdown-preview pre {
  background-color: #161b22;
}

.dark .markdown-preview blockquote {
  color: #8b949e;
  border-left-color: #30363d;
}

.dark .markdown-preview th,
.dark .markdown-preview td {
  border-color: #30363d;
}

.dark .markdown-preview th {
  background-color: #21262d;
}

.dark .markdown-preview tr:nth-child(even) {
  background-color: #0d1117;
}

.dark .markdown-preview hr {
  background-color: #30363d;
}

.dark .markdown-preview a {
  color: #58a6ff;
}
`;

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

  // 注入自定义CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // 改进的 Markdown 解析器
  const parseMarkdown = (text: string): string => {
    let html = text;
    const lines = html.split('\n');
    let result = [];
    let inCodeBlock = false;
    let inTable = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 代码块处理
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.push('</code></pre>');
          inCodeBlock = false;
        } else {
          const lang = line.substring(3).trim();
          result.push('<pre class="code-block"><code class="language-' + lang + '">');
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        result.push(line);
        continue;
      }

      // 表格处理
      if (line.includes('|')) {
        if (!inTable) {
          result.push('<table class="markdown-table"><thead>');
          inTable = true;
        }

        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);

        if (cells.some(cell => cell.includes('---'))) {
          // 表格头部结束
          result.push('</thead><tbody>');
          continue;
        }

        const cellTags = cells.map(cell => `<td>${cell}</td>`).join('');
        result.push(`<tr>${cellTags}</tr>`);
        continue;
      } else if (inTable) {
        result.push('</tbody></table>');
        inTable = false;
      }

      // 标题
      if (line.startsWith('### ')) {
        result.push('<h3>' + line.substring(4) + '</h3>');
        continue;
      }
      if (line.startsWith('## ')) {
        result.push('<h2>' + line.substring(3) + '</h2>');
        continue;
      }
      if (line.startsWith('# ')) {
        result.push('<h1>' + line.substring(2) + '</h1>');
        continue;
      }

      // 列表处理
      if (line.startsWith('* ') || line.startsWith('- ')) {
        listItems.push('<li>' + line.substring(2) + '</li>');
        continue;
      }

      if (line.match(/^\d+\. /)) {
        listItems.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
        continue;
      }

      // 如果有列表项，先输出列表
      if (listItems.length > 0) {
        result.push('<ul>' + listItems.join('') + '</ul>');
        listItems = [];
      }

      // 引用
      if (line.startsWith('> ')) {
        result.push('<blockquote>' + line.substring(2) + '</blockquote>');
        continue;
      }

      // 水平线
      if (line === '---') {
        result.push('<hr>');
        continue;
      }

      // 空行
      if (line.trim() === '') {
        result.push('<br>');
        continue;
      }

      // 普通段落处理
      let processedLine = line;

      // 粗体和斜体
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processedLine = processedLine.replace(/~~(.*?)~~/g, '<del>$1</del>');

      // 行内代码
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // 链接
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    if (processedLine.trim()) {
      result.push('<p>' + processedLine + '</p>');
    }
  }

  // 输出剩余的列表
  if (listItems.length > 0) {
    result.push('<ul>' + listItems.join('') + '</ul>');
  }

  return result.join('');
};

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
      const html = parseMarkdown(markdown);
      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown 导出</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        code.inline-code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; }
        pre.code-block { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        pre.code-block code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        ul, ol { padding-left: 20px; }
        hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
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

  const previewHtml = parseMarkdown(markdown);

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
                onClick={() => handleExport('html')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                导出 HTML
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
                <div
                  className="markdown-preview prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
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