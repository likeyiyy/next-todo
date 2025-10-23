'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function JsonEditorPage() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "示例",\n  "age": 25,\n  "hobbies": ["编程", "阅读"]\n}');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON 格式错误');
      setIsValid(false);
      setFormattedJson('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON 格式错误');
      setIsValid(false);
    }
  };

  const validateJson = useCallback(() => {
    try {
      JSON.parse(jsonInput);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON 格式错误');
      setIsValid(false);
    }
  }, [jsonInput]);

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    try {
      JSON.parse(value);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON 格式错误');
      setIsValid(false);
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
                <span className="text-2xl mr-2">🔧</span>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  JSON 编辑器
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                开发工具
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
              在线 JSON 编辑器
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              支持 JSON 格式化、验证、美化和压缩。输入您的 JSON 数据，我们将为您提供格式化和验证功能。
            </p>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={formatJson}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                格式化
              </button>
              <button
                onClick={minifyJson}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                压缩
              </button>
              <button
                onClick={validateJson}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                验证
              </button>
              <button
                onClick={clearJson}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                清空
              </button>
            </div>

            {/* Status */}
            <div className="mb-4">
              {isValid ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  JSON 格式正确
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {/* Input and Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    输入 JSON
                  </label>
                  <button
                    onClick={() => copyToClipboard(jsonInput)}
                    className="text-xs text-blue-500 hover:text-blue-600"
                  >
                    复制
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入 JSON 数据..."
                />
              </div>

              {/* Output */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    格式化结果
                  </label>
                  {formattedJson && (
                    <button
                      onClick={() => copyToClipboard(formattedJson)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      复制
                    </button>
                  )}
                </div>
                <div className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 overflow-auto">
                  {formattedJson ? (
                    <pre className="text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap">
                      {formattedJson}
                    </pre>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      点击"格式化"或"压缩"查看结果
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                功能特性
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-2">语法高亮</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">实时显示 JSON 语法结构</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-2">格式化</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">美化 JSON 格式，提高可读性</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-2">验证错误</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">检测并提示 JSON 语法错误</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-orange-600 dark:text-orange-400 font-medium mb-2">压缩优化</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">压缩 JSON 减少文件大小</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
