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

  // 完整的 Markdown 解析器
  const parseMarkdown = (text: string): string => {
    let html = text;

    // 首先处理代码块，避免里面的内容被解析
    const codeBlocks: { lang: string; code: string }[] = [];

    // 使用更精确的代码块匹配正则
    console.log('开始匹配代码块...');
    html = html.replace(/```(\w*)\s*\n([\s\S]*?)\n```/g, (match, lang, code) => {
      console.log('匹配到代码块:', { lang, code: code.trim().substring(0, 50) + '...' });
      const index = codeBlocks.length;
      codeBlocks.push({ lang, code: code.trim() });
      const placeholder = `__CODE_BLOCK_${index}__`;
      console.log('创建占位符:', placeholder);
      return placeholder;
    });
    console.log('代码块匹配完成，HTML现在包含占位符:', html.includes('__CODE_BLOCK_'));
    console.log('匹配后的HTML片段:', html.substring(0, 300));

    // 处理表格
    html = html.replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, body) => {
      const headerCells = header.split('|').map(cell => cell.trim()).filter(cell => cell);
      const bodyRows = body.trim().split('\n').filter(row => row.trim());

      const headerHtml = headerCells.map(cell => `<th>${cell}</th>`).join('');
      const bodyHtml = bodyRows.map(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
        return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
      }).join('');

      return `<table class="markdown-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
    });

    // 处理标题
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // 处理引用块
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/^> > (.+)$/gm, '<blockquote><blockquote>$1</blockquote></blockquote>');

    // 处理有序列表
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\s*)+/gs, '<ol>$&</ol>');

    // 处理无序列表
    html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\s*)+/gs, (match) => {
      return match.includes('<ol>') ? match : `<ul>${match}</ul>`;
    });

    // 处理水平线
    html = html.replace(/^---+$/gm, '<hr>');
    html = html.replace(/^\*\*\*+$/gm, '<hr>');

    // 处理粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // 处理斜体
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // 处理删除线
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // 处理行内代码 - 先恢复代码块，再处理行内代码
    console.log('行内代码处理前，HTML包含占位符:', html.includes('__CODE_BLOCK_'));

    codeBlocks.forEach((block, index) => {
      const placeholder = `__CODE_BLOCK_${index}__`;
      const tempPlaceholder = `__TEMP_CODE_BLOCK_${index}__`;
      console.log(`替换占位符 ${placeholder} -> ${tempPlaceholder}`);
      const beforeCount = (html.match(new RegExp(placeholder, 'g')) || []).length;
      html = html.replace(placeholder, tempPlaceholder);
      const afterCount = (html.match(new RegExp(tempPlaceholder, 'g')) || []).length;
      console.log(`替换 ${placeholder}: ${beforeCount} 次 -> ${tempPlaceholder}: ${afterCount} 次`);
    });

    console.log('临时占位符替换后，HTML包含临时占位符:', html.includes('__TEMP_CODE_BLOCK_'));
    console.log('行内代码处理前，HTML片段:', html.substring(0, 300));

    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // 恢复临时占位符
    codeBlocks.forEach((block, index) => {
      const tempPlaceholder = `__TEMP_CODE_BLOCK_${index}__`;
      console.log(`恢复占位符 ${tempPlaceholder} -> __CODE_BLOCK_${index}__`);
      const beforeCount = (html.match(new RegExp(tempPlaceholder, 'g')) || []).length;
      html = html.replace(tempPlaceholder, `__CODE_BLOCK_${index}__`);
      const afterCount = (html.match(new RegExp(`__CODE_BLOCK_${index}__`, 'g')) || []).length;
      console.log(`恢复 ${tempPlaceholder}: ${beforeCount} 次 -> __CODE_BLOCK_${index}__: ${afterCount} 次`);
    });

    console.log('行内代码处理后，HTML包含占位符:', html.includes('__CODE_BLOCK_'));

    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 处理图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // 在段落处理之前，恢复代码块
    console.log('开始恢复代码块，当前HTML:', html.substring(0, 300));
    console.log('代码块数量:', codeBlocks.length);

    codeBlocks.forEach((block, index) => {
      const placeholder = `__CODE_BLOCK_${index}__`;
      const lang = block.lang ? ` class="language-${block.lang}"` : '';
      const codeHtml = `<pre class="code-block"><code${lang}>${escapeHtml(block.code)}</code></pre>`;

      console.log(`尝试替换占位符 ${index}:`, placeholder, '->', codeHtml.substring(0, 50) + '...');
      console.log(`占位符 ${index} 存在:`, html.includes(placeholder));

      if (html.includes(placeholder)) {
        html = html.replace(placeholder, codeHtml);
        console.log(`成功替换占位符 ${index}`);
      } else {
        console.error(`找不到占位符 ${index}: ${placeholder}`);
      }
    });

    console.log('代码块恢复完成，最终HTML包含代码块:', html.includes('<pre class="code-block">'));

    // 处理段落
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/^([^<\s][^<]*)$/gm, '<p>$1</p>');
    html = html.replace(/^(<h[1-6]>.*<\/h[1-6]>)$/gm, '$1');
    html = html.replace(/^(<blockquote>.*<\/blockquote>)$/gm, '$1');
    html = html.replace(/^(<ul>.*<\/ul>)$/gm, '$1');
    html = html.replace(/^(<ol>.*<\/ol>)$/gm, '$1');
    html = html.replace(/^(<table>.*<\/table>)$/gm, '$1');
    html = html.replace(/^(<hr>)$/gm, '$1');

    // 清理多余的段落标签
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ol>)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p>(<table>)/g, '$1');
    html = html.replace(/(<\/table>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
    html = html.replace(/<p>(<img)/g, '$1');
    html = html.replace(/(\/>)<\/p>/g, '$1');

    return html;
  };

  // HTML 转义函数
  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
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