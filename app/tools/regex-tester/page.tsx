'use client';

import { useState, useRef, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

interface TestResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false
  });
  const [testText, setTestText] = useState(`示例测试文本
这里有一些邮箱地址：user@example.com, admin@test.org
电话号码：138-0000-0000, 159-1234-5678
网址：https://example.com, http://test.org
试试输入正则表达式来匹配这些内容！`);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const commonPatterns = [
    { name: '邮箱地址', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' },
    { name: '手机号（中国）', pattern: '1[3-9]\\d{9}' },
    { name: 'URL', pattern: 'https?:\\/\\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)' },
    { name: 'IP地址', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
    { name: '数字', pattern: '\\d+' },
    { name: '空白字符', pattern: '\\s+' }
  ];

  const testRegex = () => {
    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(pattern, flagString);
      const matches: TestResult[] = [];
      let match;

      if (flags.g) {
        while ((match = regex.exec(testText)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setResults(matches);
      setError('');

      // 高亮显示匹配的文本
      let highlighted = testText;
      if (matches.length > 0) {
        const sortedMatches = [...matches].sort((a, b) => b.index - a.index);
        sortedMatches.forEach(({ match, index }) => {
          const before = highlighted.substring(0, index);
          const after = highlighted.substring(index + match.length);
          highlighted = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800">${match}</mark>${after}`;
        });
      }
      setHighlightedText(highlighted);

    } catch (err) {
      setError(err instanceof Error ? err.message : '正则表达式错误');
      setResults([]);
      setHighlightedText(testText);
    }
  };

  const debounceRegex = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      testRegex();
    }, 300);
  };

  const handlePatternChange = (value: string) => {
    setPattern(value);
    if (value && testText) {
      debounceRegex();
    }
  };

  const handleTextChange = (value: string) => {
    setTestText(value);
    if (pattern) {
      debounceRegex();
    }
  };

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags(prev => {
      const newFlags = { ...prev, [flag]: !prev[flag] };
      return newFlags;
    });
    if (pattern) {
      debounceRegex();
    }
  };

  const applyCommonPattern = (commonPattern: typeof commonPatterns[0]) => {
    setPattern(commonPattern.pattern);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(testRegex, 100);
  };

  const exportResults = () => {
    const data = {
      pattern,
      flags: Object.entries(flags).filter(([_, enabled]) => enabled).map(([flag]) => flag),
      testText,
      results,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex-test-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pattern Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                正则表达式模式
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入正则表达式，例如: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
                <button
                  onClick={testRegex}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  测试
                </button>
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  错误: {error}
                </p>
              )}
            </div>

            {/* Common Patterns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                常用模式
              </label>
              <div className="flex flex-wrap gap-2">
                {commonPatterns.map((common) => (
                  <button
                    key={common.name}
                    onClick={() => applyCommonPattern(common)}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {common.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标志位
              </label>
              <div className="flex flex-wrap gap-4">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleFlagChange(flag as keyof typeof flags)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {flag} ({getFlagDescription(flag)})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Test Text and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test Text Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                测试文本
              </h3>
            </div>
            <div className="h-[400px]">
              <textarea
                value={testText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder="在这里输入要测试的文本..."
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                匹配结果 ({results.length})
              </h3>
              {results.length > 0 && (
                <button
                  onClick={exportResults}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  导出结果
                </button>
              )}
            </div>
            <div className="h-[400px] overflow-y-auto p-4">
              {results.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  没有匹配结果
                </p>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          匹配 #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          位置: {result.index}
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded font-mono text-sm break-all">
                        {result.match}
                      </div>
                      {result.groups.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">捕获组:</p>
                          <div className="space-y-1">
                            {result.groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="text-xs bg-blue-50 dark:bg-blue-900/20 p-1 rounded">
                                组 {groupIndex + 1}: {group || '(空)'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlighted Text */}
        {highlightedText && pattern && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              高亮显示匹配结果
            </h3>
            <div
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function getFlagDescription(flag: string): string {
  const descriptions: Record<string, string> = {
    g: '全局匹配',
    i: '忽略大小写',
    m: '多行模式',
    s: '点号匹配所有字符',
    u: 'Unicode 模式',
    y: '粘性匹配'
  };
  return descriptions[flag] || flag;
}