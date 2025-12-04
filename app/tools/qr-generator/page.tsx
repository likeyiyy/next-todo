'use client';

import { useState, useRef } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function QrGeneratorPage() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [size, setSize] = useState(200);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 简单的 QR 码生成实现（使用 API）
  const generateQRCode = async () => {
    if (!text.trim()) {
      alert('请输入要生成二维码的内容');
      return;
    }

    setIsGenerating(true);

    try {
      // 使用免费的 QR 码 API
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&ecc=${errorCorrectionLevel}&color=${foregroundColor.slice(1)}&bgcolor=${backgroundColor.slice(1)}`;
      setQrCode(apiUrl);
    } catch (error) {
      console.error('QR码生成失败:', error);
      alert('QR码生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRCode = async () => {
    if (!qrCode) return;

    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('二维码已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请尝试下载');
    }
  };

  const clearAll = () => {
    setText('');
    setQrCode('');
  };

  const presets = [
    {
      name: '网址',
      content: 'https://github.com',
      icon: '🌐'
    },
    {
      name: 'WiFi',
      content: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;',
      icon: '📶'
    },
    {
      name: '邮件',
      content: 'mailto:example@email.com',
      icon: '📧'
    },
    {
      name: '电话',
      content: 'tel:+8613800138000',
      icon: '📱'
    },
    {
      name: '短信',
      content: 'sms:+8613800138000?body=Hello',
      icon: '💬'
    },
    {
      name: '位置',
      content: 'geo:39.9042,116.4074',
      icon: '📍'
    },
    {
      name: '联系人',
      content: 'BEGIN:VCARD\nVERSION:3.0\nFN:张三\nTEL:+8613800138000\nEMAIL:zhangsan@example.com\nEND:VCARD',
      icon: '👤'
    },
    {
      name: '纯文本',
      content: '你好，这是一个二维码示例！',
      icon: '📝'
    }
  ];

  const loadPreset = (preset: typeof presets[0]) => {
    setText(preset.content);
  };

  const errorCorrectionLevels = [
    { value: 'L', label: 'L - 低 (~7%)', description: '可纠正约7%的数据' },
    { value: 'M', label: 'M - 中 (~15%)', description: '可纠正约15%的数据' },
    { value: 'Q', label: 'Q - 四分位 (~25%)', description: '可纠正约25%的数据' },
    { value: 'H', label: 'H - 高 (~30%)', description: '可纠正约30%的数据' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input and Controls */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                二维码内容
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    输入内容
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="输入文本、网址、WiFi信息等..."
                  />
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    快速模板
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => loadPreset(preset)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                设置选项
              </h3>
              <div className="space-y-4">
                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    尺寸: {size}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="10"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>100px</span>
                    <span>500px</span>
                  </div>
                </div>

                {/* Error Correction Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    容错级别
                  </label>
                  <select
                    value={errorCorrectionLevel}
                    onChange={(e) => setErrorCorrectionLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {errorCorrectionLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {errorCorrectionLevels.find(l => l.value === errorCorrectionLevel)?.description}
                  </p>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      前景色
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="h-10 w-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      背景色
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={generateQRCode}
                    disabled={isGenerating || !text.trim()}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? '生成中...' : '生成二维码'}
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - QR Code Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              二维码预览
            </h3>

            <div className="flex flex-col items-center justify-center min-h-[400px]">
              {qrCode ? (
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white">
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="max-w-full h-auto"
                    />
                  </div>

                  {/* QR Code Info */}
                  <div className="text-center space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      尺寸: {size} × {size} 像素
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      容错级别: {errorCorrectionLevel}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadQRCode}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      下载
                    </button>
                    <button
                      onClick={copyQRCode}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2L5 6v2z" />
                  </svg>
                  <p>输入内容后点击"生成二维码"</p>
                </div>
              )}
            </div>

            {/* Hidden canvas for potential future use */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
            💡 二维码使用技巧
          </h3>
          <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
            <li>• <strong>WiFi二维码格式:</strong> WIFI:T:WPA;S:网络名;P:密码;;</li>
            <li>• <strong>地理位置格式:</strong> geo:纬度,经度</li>
            <li>• <strong>短信格式:</strong> sms:电话号码?body=短信内容</li>
            <li>• <strong>邮件格式:</strong> mailto:邮箱地址?subject=主题&body=内容</li>
            <li>• <strong>联系人格式:</strong> 使用 vCard 格式 (BEGIN:VCARD...)</li>
            <li>• <strong>容错级别越高:</strong> 二维码越复杂，但损坏后仍可扫描</li>
          </ul>
        </div>
      </main>
    </div>
  );
}