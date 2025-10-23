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

  // 计算差异统计
  const getDiffStats = () => {
    if (!diff) return { added: 0, removed: 0, unchanged: 0 };
    
    let added = 0, removed = 0, unchanged = 0;
    diff.forEach(part => {
      if (part.added) added++;
      else if (part.removed) removed++;
      else unchanged++;
    });
    
    return { added, removed, unchanged };
  };

  const stats = getDiffStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 绿色顶部横幅 */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-green-100 hover:text-white mr-4 transition-colors duration-200"
              >
                ← 返回
              </Link>
              <div className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <h1 className="text-xl font-bold">
                  文本对比工具
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-green-100 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 对比摘要区域 */}
        {showDiff && diff && (
          <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                对比摘要
              </h3>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                  <span className="text-gray-600">删除: {stats.removed} 行</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">新增: {stats.added} 行</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span className="text-gray-600">未变: {stats.unchanged} 行</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setShowDiff(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            编辑文本
          </button>
          <button
            onClick={swapTexts}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            交换文本
          </button>
          <button
            onClick={compareTexts}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
          >
            对比文本
          </button>
          <button
            onClick={clearTexts}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            清空全部
          </button>
        </div>

        {/* 文本输入区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 文本 A */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                文本 A
              </h3>
            </div>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="w-full h-64 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="在此输入第一段文本..."
            />
          </div>

          {/* 文本 B */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                文本 B
              </h3>
              <button
                onClick={copyText2}
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                复制
              </button>
            </div>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="w-full h-64 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="在此输入第二段文本..."
            />
          </div>
        </div>

        {/* 对比结果区域 */}
        {showDiff && diff && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  详细对比结果
                </h3>
                <button
                  onClick={() => setShowDiff(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  隐藏结果
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-auto">
              <div className="font-mono text-sm bg-gray-50 rounded-lg overflow-hidden">
                {diff.map((part, index) => {
                  const lines = part.value.split('\n');
                  return lines.map((line, lineIndex) => {
                    if (lineIndex === lines.length - 1 && line === '') return null;
                    
                    let className = 'flex items-center py-2 px-3 border-l-4';
                    let prefix = '';
                    let icon = '';
                    
                    if (part.added) {
                      className += ' bg-green-50 border-green-400';
                      prefix = '+';
                      icon = '➕';
                    } else if (part.removed) {
                      className += ' bg-red-50 border-red-400';
                      prefix = '-';
                      icon = '➖';
                    } else {
                      className += ' bg-gray-50 border-gray-300';
                      prefix = ' ';
                      icon = ' ';
                    }
                    
                    return (
                      <div key={`${index}-${lineIndex}`} className={className}>
                        <span className="text-gray-500 mr-3 w-6 text-center">
                          {icon}
                        </span>
                        <span className="text-gray-500 mr-3 w-8 text-center font-bold">
                          {prefix}
                        </span>
                        <span className="text-gray-900 flex-1">
                          {line || '\u00A0'}
                        </span>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}