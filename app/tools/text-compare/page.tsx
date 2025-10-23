'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Diff from 'diff';

export default function TextComparePage() {
  const [text1, setText1] = useState('这是第一段文本\n用于对比的示例内容\n包含多行文本');
  const [text2, setText2] = useState('这是第二段文本\n用于对比的示例内容\n包含修改后的文本');

  // 生成词语级差异
  const generateWordDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const result = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        // 完全相同
        result.push({
          type: 'unchanged',
          left: line1,
          right: line2,
          lineNumber: i + 1
        });
      } else if (line1 && !line2) {
        // 左侧有，右侧无
        result.push({
          type: 'deleted',
          left: line1,
          right: '',
          lineNumber: i + 1
        });
      } else if (!line1 && line2) {
        // 左侧无，右侧有
        result.push({
          type: 'added',
          left: '',
          right: line2,
          lineNumber: i + 1
        });
      } else {
        // 都有但不同 - 词语级差异
        const wordDiff = Diff.diffWordsWithSpace(line1, line2);
        result.push({
          type: 'modified',
          left: line1,
          right: line2,
          wordDiff,
          lineNumber: i + 1
        });
      }
    }
    
    return result;
  };

  const diffData = generateWordDiff();

  // 计算统计
  const getStats = () => {
    let added = 0, removed = 0, unchanged = 0;
    diffData.forEach(item => {
      if (item.type === 'added') added++;
      else if (item.type === 'deleted') removed++;
      else if (item.type === 'unchanged') unchanged++;
      else if (item.type === 'modified') {
        // 对于修改的行，计算词语级差异
        item.wordDiff?.forEach(part => {
          if (part.added) added++;
          else if (part.removed) removed++;
          else unchanged++;
        });
      }
    });
    return { added, removed, unchanged };
  };

  const stats = getStats();

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const clearTexts = () => {
    setText1('');
    setText2('');
  };

  const copyText2 = () => {
    navigator.clipboard.writeText(text2);
  };

  // 渲染词语级差异
  const renderWordDiff = (wordDiff: any[], isLeft: boolean) => {
    return wordDiff.map((part, index) => {
      if (part.added && isLeft) return null; // 左侧不显示新增
      if (part.removed && !isLeft) return null; // 右侧不显示删除
      
      let className = '';
      if (part.added) className = 'bg-green-200 text-green-800';
      else if (part.removed) className = 'bg-red-200 text-red-800';
      
      return (
        <span key={index} className={className}>
          {part.value}
        </span>
      );
    });
  };

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
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 对比摘要 */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                对比摘要
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={swapTexts}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors duration-200"
                >
                  交换文本
                </button>
                <button
                  onClick={clearTexts}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors duration-200"
                >
                  清空全部
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm mt-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span className="text-gray-600">删除: {stats.removed} 处</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span className="text-gray-600">新增: {stats.added} 处</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                <span className="text-gray-600">未变: {stats.unchanged} 处</span>
              </div>
            </div>
          </div>
        </div>

        {/* 分栏对比视图 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* 分栏头部 */}
          <div className="flex border-b border-gray-200">
            <div className="flex-1 p-4 border-r border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">文本 A</h3>
            </div>
            <div className="flex-1 p-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">文本 B</h3>
              <button
                onClick={copyText2}
                className="text-xs text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                复制
              </button>
            </div>
          </div>

          {/* 分栏内容 - 只读对比结果 */}
          <div className="flex max-h-96 overflow-auto">
            {/* 左侧文本 */}
            <div className="flex-1 border-r border-gray-200">
              <div className="font-mono text-sm">
                {diffData.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start py-2 px-3 border-l-4 ${
                      item.type === 'deleted' 
                        ? 'bg-red-50 border-red-400' 
                        : item.type === 'modified'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 mr-3 w-8 text-center text-xs">
                      {item.lineNumber}
                    </span>
                    <div className="text-gray-900 flex-1">
                      {item.type === 'modified' && item.wordDiff ? (
                        renderWordDiff(item.wordDiff, true)
                      ) : (
                        item.left || '\u00A0'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧文本 */}
            <div className="flex-1">
              <div className="font-mono text-sm">
                {diffData.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start py-2 px-3 border-l-4 ${
                      item.type === 'added' 
                        ? 'bg-green-50 border-green-400' 
                        : item.type === 'modified'
                        ? 'bg-yellow-50 border-yellow-400'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 mr-3 w-8 text-center text-xs">
                      {item.lineNumber}
                    </span>
                    <div className="text-gray-900 flex-1">
                      {item.type === 'modified' && item.wordDiff ? (
                        renderWordDiff(item.wordDiff, false)
                      ) : (
                        item.right || '\u00A0'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 文本编辑区域 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 文本 A */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                编辑文本 A
              </h3>
            </div>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="w-full h-48 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="在此输入第一段文本..."
            />
          </div>

          {/* 文本 B */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                编辑文本 B
              </h3>
            </div>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="w-full h-48 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="在此输入第二段文本..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}