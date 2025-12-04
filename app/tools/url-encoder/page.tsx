'use client';

import { useState } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encoding, setEncoding] = useState<'url' | 'base64' | 'html'>('url');

  const urlEncode = (text: string): string => {
    return encodeURIComponent(text);
  };

  const urlDecode = (text: string): string => {
    try {
      return decodeURIComponent(text);
    } catch (error) {
      return '解码错误: 无效的URL编码';
    }
  };

  const base64Encode = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      return '编码错误';
    }
  };

  const base64Decode = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      return '解码错误: 无效的Base64编码';
    }
  };

  const htmlEncode = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const htmlDecode = (text: string): string => {
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  };

  const process = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = '';

    switch (encoding) {
      case 'url':
        result = mode === 'encode' ? urlEncode(input) : urlDecode(input);
        break;
      case 'base64':
        result = mode === 'encode' ? base64Encode(input) : base64Decode(input);
        break;
      case 'html':
        result = mode === 'encode' ? htmlEncode(input) : htmlDecode(input);
        break;
    }

    setOutput(result);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      // 实时处理
      setTimeout(() => {
        setInput(value);
        if (value.trim()) {
          let result = '';
          switch (encoding) {
            case 'url':
              result = mode === 'encode' ? urlEncode(value) : urlDecode(value);
              break;
            case 'base64':
              result = mode === 'encode' ? base64Encode(value) : base64Decode(value);
              break;
            case 'html':
              result = mode === 'encode' ? htmlEncode(value) : htmlDecode(value);
              break;
          }
          setOutput(result);
        } else {
          setOutput('');
        }
      }, 300);
    } else {
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      // 可以添加提示
    });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const testExamples = {
    url: {
      encode: 'https://example.com/search?q=hello world&lang=中文',
      decode: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3D%E4%B8%AD%E6%96%87'
    },
    base64: {
      encode: 'Hello World! 你好世界！',
      decode: 'SGVsbG8gV29ybGQhIOS4lueVjOWMl-S4g=='
    },
    html: {
      encode: '<div class="container">Hello & "World"!</div>',
      decode: '&lt;div class=&quot;container&quot;&gt;Hello &amp; &quot;World&quot;!&lt;/div&gt;'
    }
  };

  const loadExample = () => {
    const example = testExamples[encoding][mode];
    setInput(example);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="space-y-4">
            {/* Mode and Encoding Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  操作模式
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('encode')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      mode === 'encode'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    编码
                  </button>
                  <button
                    onClick={() => setMode('decode')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      mode === 'decode'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    解码
                  </button>
                </div>
              </div>

              {/* Encoding Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  编码类型
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setEncoding('url')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      encoding === 'url'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => setEncoding('base64')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      encoding === 'base64'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Base64
                  </button>
                  <button
                    onClick={() => setEncoding('html')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      encoding === 'html'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                加载示例
              </button>
              <button
                onClick={swapInputOutput}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                交换输入输出
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                复制结果
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                清空
              </button>
            </div>
          </div>
        </div>

        {/* Input and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? '原始文本' : '编码文本'}
              </h3>
            </div>
            <div className="h-[400px]">
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                placeholder={mode === 'encode' ? '在这里输入要编码的文本...' : '在这里输入要解码的文本...'}
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                字符数: {input.length}
              </p>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? '编码结果' : '解码结果'}
              </h3>
            </div>
            <div className="h-[400px]">
              <textarea
                value={output}
                readOnly
                className="w-full h-full p-4 resize-none focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="结果将显示在这里..."
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                字符数: {output.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 编码类型说明
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
            <div>
              <strong>URL 编码:</strong> 用于在 URL 中传输特殊字符，如空格、中文、符号等
            </div>
            <div>
              <strong>Base64 编码:</strong> 将二进制数据转换为文本格式，常用于数据传输
            </div>
            <div>
              <strong>HTML 编码:</strong> 转义 HTML 特殊字符，防止 XSS 攻击和显示问题
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}