'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ToolHeader from '../../components/ToolHeader';

// 动态导入 jsoneditor，避免 SSR 问题
let JSONEditor: any = null;

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
    <div className="min-h-screen bg-gray-50">
      <ToolHeader toolName="JSON 编辑器" toolIcon="🔧" />

      {/* Main Content */}
      <main className="h-[calc(100vh-3rem)]">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-b border-red-300 dark:border-red-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center text-red-800 dark:text-red-200 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* JSON Editor Container */}
        <div className="h-full">
          <div
            ref={editorRef}
            className="w-full h-full"
            style={{ minHeight: 'calc(100vh - 6rem)' }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">加载 JSON 编辑器...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
