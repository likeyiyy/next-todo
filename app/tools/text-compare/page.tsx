'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Diff from 'diff';

export default function TextComparePage() {
  const [text1, setText1] = useState('这是第一段文本\n用于对比的示例内容\n包含多行文本');
  const [text2, setText2] = useState('这是第二段文本\n用于对比的示例内容\n包含修改后的文本');
  const [showDiff, setShowDiff] = useState(false);

  const compareTexts = () => {
    setShowDiff(true);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setShowDiff(false);
  };

  const clearTexts = () => {
    setText1('');
    setText2('');
    setShowDiff(false);
  };

  const copyText2 = () => {
    navigator.clipboard.writeText(text2);
  };

  // 使用 diff 库生成差异
  const generateDiff = () => {
    if (!showDiff) return null;
    
    const diff = Diff.diffLines(text1, text2);
    return diff;
  };

  const diff = generateDiff();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
              >
                ← 返回
              </Link>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📊</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  文本对比工具
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={compareTexts}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors duration-200"
              >
                对比
              </button>
              <button
                onClick={swapTexts}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors duration-200"
              >
                交换
              </button>
              <button
                onClick={clearTexts}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors duration-200"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        {!showDiff ? (
          // 输入模式
          <div className="h-full flex">
            {/* 文本 A */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  文本 A
                </h3>
              </div>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="flex-1 w-full p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-none resize-none focus:outline-none font-mono text-sm"
                placeholder="在此输入第一段文本..."
              />
            </div>

            {/* 分隔线 */}
            <div className="w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* 文本 B */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  文本 B
                </h3>
                <button
                  onClick={copyText2}
                  className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  复制
                </button>
              </div>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="flex-1 w-full p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-none resize-none focus:outline-none font-mono text-sm"
                placeholder="在此输入第二段文本..."
              />
            </div>
          </div>
        ) : (
          // 对比模式 - 美化版本
          <div className="h-full overflow-auto">
            <div className="max-w-7xl mx-auto p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    对比结果
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                      <span>删除的内容</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                      <span>新增的内容</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                      <span>未变化的内容</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                    {diff?.map((part, index) => {
                      const lines = part.value.split('\n');
                      return lines.map((line, lineIndex) => {
                        if (lineIndex === lines.length - 1 && line === '') return null;
                        
                        let className = 'flex items-center py-2 px-3 border-l-4';
                        let prefix = '';
                        let icon = '';
                        
                        if (part.added) {
                          className += ' bg-green-50 dark:bg-green-900/20 border-green-400';
                          prefix = '+';
                          icon = '➕';
                        } else if (part.removed) {
                          className += ' bg-red-50 dark:bg-red-900/20 border-red-400';
                          prefix = '-';
                          icon = '➖';
                        } else {
                          className += ' bg-gray-50 dark:bg-gray-800 border-gray-300';
                          prefix = ' ';
                          icon = ' ';
                        }
                        
                        return (
                          <div key={`${index}-${lineIndex}`} className={className}>
                            <span className="text-gray-500 dark:text-gray-400 mr-3 w-6 text-center">
                              {icon}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 mr-3 w-8 text-center font-bold">
                              {prefix}
                            </span>
                            <span className="text-gray-900 dark:text-white flex-1">
                              {line || '\u00A0'}
                            </span>
                          </div>
                        );
                      });
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}