'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function TimestampConverterPage() {
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [format, setFormat] = useState<'seconds' | 'milliseconds'>('seconds');
  const [timezone, setTimezone] = useState<'local' | 'utc'>('local');
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<Array<{original: string, converted: string}>>([]);

  useEffect(() => {
    const updateCurrentTimestamp = () => {
      const now = new Date();
      const timestamp = format === 'seconds'
        ? Math.floor(now.getTime() / 1000).toString()
        : now.getTime().toString();
      setCurrentTimestamp(timestamp);
    };

    updateCurrentTimestamp();
    const interval = setInterval(updateCurrentTimestamp, 1000);

    return () => clearInterval(interval);
  }, [format]);

  const timestampToDate = (timestamp: string, useSeconds: boolean = true): string => {
    try {
      const num = parseInt(timestamp);
      if (isNaN(num)) throw new Error('无效的时间戳');

      const date = new Date(useSeconds ? num * 1000 : num);

      if (timezone === 'utc') {
        return date.toUTCString();
      } else {
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      }
    } catch (error) {
      return '转换错误: 无效的时间戳';
    }
  };

  const dateToTimestamp = (dateString: string, outputSeconds: boolean = true): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('无效的日期');

      return outputSeconds
        ? Math.floor(date.getTime() / 1000).toString()
        : date.getTime().toString();
    } catch (error) {
      return '转换错误: 无效的日期格式';
    }
  };

  const handleTimestampChange = (value: string) => {
    setTimestampInput(value);
    if (value.trim()) {
      const date = timestampToDate(value, format === 'seconds');
      setDateInput(date === '转换错误: 无效的时间戳' ? '' : date);
    } else {
      setDateInput('');
    }
  };

  const handleDateChange = (value: string) => {
    setDateInput(value);
    if (value.trim()) {
      const timestamp = dateToTimestamp(value, format === 'seconds');
      setTimestampInput(timestamp.includes('错误') ? '' : timestamp);
    } else {
      setTimestampInput('');
    }
  };

  const setCurrentTime = () => {
    const now = new Date();
    if (timezone === 'utc') {
      setDateInput(now.toUTCString());
    } else {
      setDateInput(now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }

    setTimestampInput(currentTimestamp);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const processBatch = () => {
    const lines = batchInput.trim().split('\n');
    const results = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return { original: line, converted: '' };

      // 尝试识别是时间戳还是日期
      const isTimestamp = /^\d+$/.test(trimmed);

      if (isTimestamp) {
        const converted = timestampToDate(trimmed, format === 'seconds');
        return { original: trimmed, converted };
      } else {
        const converted = dateToTimestamp(trimmed, format === 'seconds');
        return { original: trimmed, converted };
      }
    });

    setBatchResults(results);
  };

  const clearBatch = () => {
    setBatchInput('');
    setBatchResults([]);
  };

  const presetTimestamps = [
    { name: 'Unix 纪元', timestamp: '0', description: '1970-01-01 00:00:00 UTC' },
    { name: 'Y2K', timestamp: '946684800', description: '2000-01-01 00:00:00 UTC' },
    { name: '今天 00:00', timestamp: '', description: '今天午夜' },
    { name: '明天 00:00', timestamp: '', description: '明天午夜' },
    { name: '下周一 00:00', timestamp: '', description: '下周一午夜' }
  ];

  const getPresetTimestamp = (preset: typeof presetTimestamps[0]): string => {
    if (preset.timestamp) return preset.timestamp;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset.name) {
      case '今天 00:00':
        return (format === 'seconds' ? Math.floor(today.getTime() / 1000) : today.getTime()).toString();
      case '明天 00:00':
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return (format === 'seconds' ? Math.floor(tomorrow.getTime() / 1000) : tomorrow.getTime()).toString();
      case '下周一 00:00':
        const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
        const nextMonday = new Date(today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
        return (format === 'seconds' ? Math.floor(nextMonday.getTime() / 1000) : nextMonday.getTime()).toString();
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Timestamp */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                当前时间戳
              </h3>
              <div className="text-2xl font-mono text-gray-900 dark:text-white">
                {currentTimestamp}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ({format === 'seconds' ? '秒' : '毫秒'})
              </div>
            </div>
            <button
              onClick={setCurrentTime}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              使用当前时间
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                时间戳格式
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFormat('seconds')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    format === 'seconds'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  秒 (10位)
                </button>
                <button
                  onClick={() => setFormat('milliseconds')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    format === 'milliseconds'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  毫秒 (13位)
                </button>
              </div>
            </div>

            {/* Timezone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                时区
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimezone('local')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    timezone === 'local'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  本地时间
                </button>
                <button
                  onClick={() => setTimezone('utc')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    timezone === 'utc'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  UTC时间
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Timestamp to Date */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                时间戳 → 日期
              </h3>
              {timestampInput && (
                <button
                  onClick={() => copyToClipboard(timestampInput)}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  复制
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  时间戳
                </label>
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => handleTimestampChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="输入时间戳..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  转换结果
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-gray-100 min-h-[42px]">
                  {dateInput || '转换结果将显示在这里...'}
                </div>
              </div>
            </div>
          </div>

          {/* Date to Timestamp */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                日期 → 时间戳
              </h3>
              {dateInput && (
                <button
                  onClick={() => copyToClipboard(dateInput)}
                  className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  复制
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  日期时间
                </label>
                <input
                  type="datetime-local"
                  value={dateInput ? new Date(dateInput).toISOString().slice(0, 16) : ''}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  转换结果
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-900 dark:text-gray-100 min-h-[42px] font-mono">
                  {timestampInput || '转换结果将显示在这里...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            快速预设
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetTimestamps.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setTimestampInput(getPresetTimestamp(preset))}
                className="text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {preset.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Batch Converter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              批量转换
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={processBatch}
                disabled={!batchInput.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                批量转换
              </button>
              <button
                onClick={clearBatch}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输入 (每行一个时间戳或日期)
              </label>
              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="输入时间戳或日期，每行一个..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                转换结果
              </label>
              <div className="h-64 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-y-auto">
                {batchResults.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">转换结果将显示在这里...</p>
                ) : (
                  <div className="space-y-2">
                    {batchResults.map((result, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {result.original}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {result.converted}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}