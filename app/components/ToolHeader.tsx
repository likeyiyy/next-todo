'use client';

import Link from 'next/link';

interface ToolHeaderProps {
  toolName: string;
  toolIcon: string;
}

export default function ToolHeader({ toolName, toolIcon }: ToolHeaderProps) {
  return (
    <div className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-green-100 hover:text-white mr-4 transition-colors duration-200"
            >
              <h1 className="text-xl font-bold">
                🛠️ 个人工具集
              </h1>
            </Link>
          </div>
          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具..."
                className="w-full px-4 py-2 pl-10 text-gray-900 bg-green-700 border border-green-500 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent placeholder-green-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-100">
              {toolIcon} {toolName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
