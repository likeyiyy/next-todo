'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
}

export default function TextComparePage() {
  const [text1, setText1] = useState('这是第一段文本\n用于对比的示例内容\n包含多行文本');
  const [text2, setText2] = useState('这是第二段文本\n用于对比的示例内容\n包含修改后的文本');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const compareTexts = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    const result: DiffResult[] = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        result.push({ type: 'unchanged', content: line1 });
      } else if (line1 && !line2) {
        result.push({ type: 'removed', content: line1 });
      } else if (!line1 && line2) {
        result.push({ type: 'added', content: line2 });
      } else {
        // 行内容不同，进行字符级对比
        const charDiff = compareCharacters(line1, line2);
        result.push(...charDiff);
      }
    }

    setDiffResult(result);
    setShowDiff(true);
  };

  const compareCharacters = (str1: string, str2: string): DiffResult[] => {
    const result: DiffResult[] = [];
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
      const char1 = str1[i] || '';
      const char2 = str2[i] || '';

      if (char1 === char2) {
        result.push({ type: 'unchanged', content: char1 });
      } else if (char1 && !char2) {
        result.push({ type: 'removed', content: char1 });
      } else if (!char1 && char2) {
        result.push({ type: 'added', content: char2 });
      } else {
        result.push({ type: 'removed', content: char1 });
        result.push({ type: 'added', content: char2 });
      }
    }

    return result;
  };

  const clearTexts = () => {
    setText1('');
    setText2('');
    setDiffResult([]);
    setShowDiff(false);
  };

  const swapTexts = () => {
    setText1(text2);
    setText2(text1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDiffStyle = (type: DiffResult['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'removed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'unchanged':
        return 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ← 返回工具集
              </Link>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📊</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  文本对比工具
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                文本工具
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              在线文本对比工具
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              快速对比两段文本的差异，高亮显示添加、删除和修改的内容。支持行级和字符级对比。
            </p>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={compareTexts}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                对比文本
              </button>
              <button
                onClick={swapTexts}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                交换文本
              </button>
              <button
                onClick={clearTexts}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                清空
              </button>
            </div>

            {/* Input Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Text 1 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    文本 A
                  </label>
                  <button
                    onClick={() => copyToClipboard(text1)}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    复制
                  </button>
                </div>
                <textarea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入第一段文本..."
                />
              </div>

              {/* Text 2 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    文本 B
                  </label>
                  <button
                    onClick={() => copyToClipboard(text2)}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    复制
                  </button>
                </div>
                <textarea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入第二段文本..."
                />
              </div>
            </div>

            {/* Diff Result */}
            {showDiff && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    对比结果
                  </label>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">添加</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">删除</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-50 dark:bg-gray-800 mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">未变化</span>
                    </div>
                  </div>
                </div>
                <div className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 overflow-auto">
                  <div className="font-mono text-sm">
                    {diffResult.map((diff, index) => (
                      <span
                        key={index}
                        className={`px-1 ${getDiffStyle(diff.type)}`}
                      >
                        {diff.content}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                功能特性
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-2">差异高亮</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">高亮显示文本差异</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-2">行级对比</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">逐行对比文本内容</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-2">字符级对比</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">精确到字符的差异检测</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-orange-600 dark:text-orange-400 font-medium mb-2">导出结果</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">复制对比结果</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
