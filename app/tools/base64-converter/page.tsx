'use client';

import { useState, useRef, ChangeEvent } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function Base64ConverterPage() {
  const [textInput, setTextInput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeText = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (err) {
      setError('编码失败: 文本包含无法编码的字符');
      return '';
    }
  };

  const decodeText = (base64: string): string => {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (err) {
      setError('解码失败: 无效的 Base64 编码');
      return '';
    }
  };

  const encodeFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('文件读取失败'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取错误'));
      reader.readAsDataURL(file);
    });
  };

  const decodeFile = async (base64: string, originalFileName: string): Promise<void> => {
    try {
      // 添加 data URL 前缀
      const dataUrl = `data:application/octet-stream;base64,${base64}`;

      // 尝试创建下载链接
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = originalFileName || 'decoded_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('解码失败: 无法解码文件');
    }
  };

  const handleTextChange = (value: string) => {
    setError('');
    setTextInput(value);

    if (mode === 'encode' && value.trim()) {
      setBase64Input(encodeText(value));
    } else if (mode === 'decode' && value.trim()) {
      setTextInput(decodeText(value));
    }
  };

  const handleBase64Change = (value: string) => {
    setError('');
    setBase64Input(value);

    if (mode === 'decode' && value.trim()) {
      setTextInput(decodeText(value));
    } else if (mode === 'encode' && value.trim()) {
      setBase64Input(encodeText(value));
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setError('');

    try {
      if (mode === 'encode') {
        const base64 = await encodeFile(file);
        setBase64Input(base64);
        setTextInput(`文件: ${file.name} (${file.size} 字节)`);
      } else {
        const text = await file.text();
        setTextInput(text);
        setBase64Input(encodeText(text));
      }
    } catch (err) {
      setError('文件处理失败');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setTextInput('');
    setBase64Input('');
    setFileName('');
    setFileSize(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const swapInputOutput = () => {
    const temp = textInput;
    setTextInput(base64Input);
    setBase64Input(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const downloadBase64 = () => {
    if (!base64Input) return;

    const blob = new Blob([base64Input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ? `${fileName}.base64` : 'base64_output.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const testExamples = {
    text: 'Hello World! 你好世界！',
    base64: 'SGVsbG8gV29ybGQhIOS4lueVjOWMl-S4g=='
  };

  const loadExample = () => {
    if (mode === 'encode') {
      setTextInput(testExamples.text);
      setBase64Input(testExamples.base64);
    } else {
      setBase64Input(testExamples.base64);
      setTextInput(testExamples.text);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="space-y-4">
            {/* Mode and Input Type Selection */}
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

              {/* Input Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  输入类型
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setInputType('text')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputType === 'text'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    文本
                  </button>
                  <button
                    onClick={() => setInputType('file')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      inputType === 'file'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    文件
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
                onClick={downloadBase64}
                disabled={!base64Input}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下载 Base64
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                清空
              </button>
            </div>

            {/* File Info */}
            {fileName && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                文件: {fileName} ({formatFileSize(fileSize)})
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Input and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {inputType === 'text'
                  ? (mode === 'encode' ? '原始文本' : 'Base64 编码')
                  : '文件上传'
                }
              </h3>
              {inputType === 'text' ? (
                <button
                  onClick={() => copyToClipboard(mode === 'encode' ? textInput : base64Input)}
                  disabled={!textInput && !base64Input}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  复制
                </button>
              ) : null}
            </div>
            <div className="h-[400px]">
              {inputType === 'text' ? (
                <textarea
                  value={mode === 'encode' ? textInput : base64Input}
                  onChange={(e) => handleTextChange(mode === 'encode' ? e.target.value : e.target.value)}
                  className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white font-mono text-sm"
                  placeholder={mode === 'encode' ? '在这里输入要编码的文本...' : '在这里输入 Base64 编码...'}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      选择文件
                    </label>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      或拖拽文件到这里
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {inputType === 'text'
                  ? `字符数: ${(mode === 'encode' ? textInput : base64Input).length}`
                  : '支持任何文件格式'
                }
              </p>
            </div>
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? 'Base64 编码' : '解码结果'}
              </h3>
              {inputType === 'text' && (
                <button
                  onClick={() => copyToClipboard(mode === 'encode' ? base64Input : textInput)}
                  disabled={!base64Input && !textInput}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  复制
                </button>
              )}
            </div>
            <div className="h-[400px] overflow-hidden">
              {inputType === 'text' ? (
                <textarea
                  value={mode === 'encode' ? base64Input : textInput}
                  readOnly
                  className="w-full h-full p-4 resize-none focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  placeholder="结果将显示在这里..."
                />
              ) : (
                <div className="h-full p-6 overflow-y-auto">
                  {base64Input ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                          Base64 编码已生成
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                          编码长度: {base64Input.length} 字符
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(base64Input)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            复制编码
                          </button>
                          <button
                            onClick={downloadBase64}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                          >
                            下载编码
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                          {base64Input.substring(0, 1000)}
                          {base64Input.length > 1000 && '\n... (已截断，点击"复制编码"获取完整内容)'}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <p>选择文件后将显示 Base64 编码</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {inputType === 'text'
                  ? `字符数: ${(mode === 'encode' ? base64Input : textInput).length}`
                  : base64Input ? `编码长度: ${base64Input.length} 字符` : '等待文件上传'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-2">
            💡 Base64 使用说明
          </h3>
          <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
            <li>• Base64 是一种基于64个可打印字符来表示二进制数据的编码方法</li>
            <li>• 常用于在文本协议中传输二进制数据，如邮件附件、图片嵌入等</li>
            <li>• 编码后的数据比原始数据大约 33%</li>
            <li>• 支持任何文件类型的编码和解码</li>
            <li>• 注意：Base64 不是加密算法，不要用于敏感数据保护</li>
          </ul>
        </div>
      </main>
    </div>
  );
}