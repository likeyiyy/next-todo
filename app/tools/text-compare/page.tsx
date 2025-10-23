'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Diff, Hunk, parseDiff, tokenize, markEdits } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function TextComparePage() {
  const [text1, setText1] = useState('这是第一段文本\n用于对比的示例内容\n包含多行文本\nHello World');
  const [text2, setText2] = useState('这是第二段文本\n用于对比的示例内容\n包含修改后的文本\nHello React');

  // 生成 Git diff 格式的文本
  const generateGitDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');

    let diffText = '--- a/text1.txt\n+++ b/text2.txt\n@@ -1,' + lines1.length + ' +1,' + lines2.length + ' @@\n';

    // 简单的行级差异生成
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        diffText += ' ' + line1 + '\n';
      } else if (line1 && !line2) {
        diffText += '-' + line1 + '\n';
      } else if (!line1 && line2) {
        diffText += '+' + line2 + '\n';
      } else {
        diffText += '-' + line1 + '\n';
        diffText += '+' + line2 + '\n';
      }
    }

    return diffText;
  };

  const diffText = generateGitDiff();
  const files = parseDiff(diffText);

  // 为每个文件生成字符级别的差异标记
  const renderFileWithCharDiff = (file: any) => {
    const options = {
      enhancers: [markEdits(file.hunks, { type: 'block' })],
    };

    const tokens = tokenize(file.hunks, options);

    return (
      <Diff
        key={`${file.oldRevision}-${file.newRevision}`}
        hunks={file.hunks}
        viewType="split"
        diffType={file.type}
        tokens={tokens}
      >
        {(hunks) =>
          hunks.map((hunk: any) => (
            <Hunk key={hunk.content} hunk={hunk} />
          ))
        }
      </Diff>
    );
  };

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

  // 计算统计信息
  const getStats = () => {
    let added = 0, removed = 0, unchanged = 0;
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        unchanged++;
      } else if (line1 && !line2) {
        removed++;
      } else if (!line1 && line2) {
        added++;
      } else {
        added++;
        removed++;
      }
    }

    return { added, removed, unchanged };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader toolName="文本对比工具" toolIcon="📊" />

      {/* 主内容区域 */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* react-diff-view 对比区域 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">差异对比</h3>
          </div>
          <div className="max-h-96 overflow-auto">
            {files.map((file, index) => renderFileWithCharDiff(file))}
          </div>
        </div>

        {/* 文本编辑区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              className="w-full h-64 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
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
              className="w-full h-64 p-4 text-gray-900 bg-white border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="在此输入第二段文本..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
