'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// 动态导入 jsoneditor，避免 SSR 问题
let JSONEditor: any = null;
let JSONEditorMode: any = null;

export default function JsonEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const jsonEditorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initEditor = async () => {
      if (typeof window === 'undefined') return;

      try {
        // 动态导入 jsoneditor
        const jsoneditorModule = await import('jsoneditor');
        JSONEditor = jsoneditorModule.default;

        if (editorRef.current && !jsonEditorRef.current) {
          const options = {
            mode: 'code',
            modes: ['code', 'tree', 'form', 'text', 'view'],
            onError: (err: Error) => {
              setError(err.message);
            },
            onModeChange: (newMode: string) => {
              console.log('Mode changed to:', newMode);
            },
            onChange: () => {
              setError('');
            }
          };

          jsonEditorRef.current = new JSONEditor(editorRef.current, options);

          // 设置初始 JSON 数据
          const initialData = {
            name: "示例",
            age: 25,
            hobbies: ["编程", "阅读"],
            address: {
              city: "北京",
              country: "中国"
            }
          };

          jsonEditorRef.current.set(initialData);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load JSONEditor:', err);
        setError('加载 JSON 编辑器失败');
      }
    };

    initEditor();

    return () => {
      if (jsonEditorRef.current) {
        jsonEditorRef.current.destroy();
        jsonEditorRef.current = null;
      }
    };
  }, []);

  const formatJson = () => {
    if (jsonEditorRef.current) {
      try {
        const data = jsonEditorRef.current.get();
        jsonEditorRef.current.set(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : '格式化失败');
      }
    }
  };

  const validateJson = () => {
    if (jsonEditorRef.current) {
      try {
        jsonEditorRef.current.get();
        setError('');
        alert('JSON 格式正确！');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'JSON 格式错误');
        alert('JSON 格式错误！');
      }
    }
  };

  const clearJson = () => {
    if (jsonEditorRef.current) {
      jsonEditorRef.current.set({});
      setError('');
    }
  };

  const copyJson = () => {
    if (jsonEditorRef.current) {
      try {
        const data = jsonEditorRef.current.get();
        const jsonString = JSON.stringify(data, null, 2);
        navigator.clipboard.writeText(jsonString);
        alert('JSON 已复制到剪贴板！');
      } catch {
        setError('复制失败');
      }
    }
  };

  const downloadJson = () => {
    if (jsonEditorRef.current) {
      try {
        const data = jsonEditorRef.current.get();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        alert('下载失败');
      }
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
              专业 JSON 编辑器
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              使用专业的 JSONEditor 库，支持多种编辑模式、语法高亮、实时验证和丰富的编辑功能。
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
                onClick={validateJson}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                验证
              </button>
              <button
                onClick={copyJson}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                复制
              </button>
              <button
                onClick={downloadJson}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                下载
              </button>
              <button
                onClick={clearJson}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                清空
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <div className="flex items-center text-red-800 dark:text-red-200">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* JSON Editor Container */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  JSON 编辑器
                </label>
                {isLoaded && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    编辑器已加载
                  </div>
                )}
              </div>
              <div
                ref={editorRef}
                className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                style={{ minHeight: '400px' }}
              />
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">加载 JSON 编辑器...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                功能特性
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-2">多种模式</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">代码、树形、表单、文本、查看模式</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-green-600 dark:text-green-400 font-medium mb-2">语法高亮</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">专业的 JSON 语法高亮显示</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-2">实时验证</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">实时检测 JSON 语法错误</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-orange-600 dark:text-orange-400 font-medium mb-2">丰富功能</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">搜索、折叠、复制、下载等</div>
                </div>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">使用说明</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>代码模式</strong>：直接编辑 JSON 文本，支持语法高亮</li>
                <li>• <strong>树形模式</strong>：以树形结构编辑 JSON 对象</li>
                <li>• <strong>表单模式</strong>：以表单形式编辑 JSON 数据</li>
                <li>• <strong>文本模式</strong>：纯文本编辑模式</li>
                <li>• <strong>查看模式</strong>：只读模式，用于查看 JSON 数据</li>
                <li>• 使用工具栏按钮进行格式化、验证、复制和下载操作</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
