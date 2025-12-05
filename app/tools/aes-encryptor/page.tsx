"use client"

import { useState } from 'react'
import CryptoJS from 'crypto-js'
import UnifiedHeader from '../../components/UnifiedHeader'

export default function AESEncryptor() {
  const [inputText, setInputText] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [error, setError] = useState('')

  const encrypt = (text: string, key: string) => {
    return CryptoJS.AES.encrypt(text, key).toString()
  }

  const decrypt = (ciphertext: string, key: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    if (!decrypted) {
      throw new Error('解密失败：请检查密钥是否正确')
    }
    return decrypted
  }

  const handleProcess = () => {
    if (!inputText.trim()) {
      setError('请输入要处理的文本')
      return
    }
    if (!secretKey.trim()) {
      setError('请输入密钥')
      return
    }

    try {
      setError('')
      if (mode === 'encrypt') {
        const encrypted = encrypt(inputText, secretKey)
        setOutputText(encrypted)
      } else {
        const decrypted = decrypt(inputText, secretKey)
        setOutputText(decrypted)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败')
      setOutputText('')
    }
  }

  const clearAll = () => {
    setInputText('')
    setSecretKey('')
    setOutputText('')
    setError('')
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText)
  }

  const swapText = () => {
    setInputText(outputText)
    setOutputText('')
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')
  }

  const generateRandomKey = () => {
    const key = CryptoJS.lib.WordArray.random(256/8).toString()
    setSecretKey(key)
  }

  const loadExample = () => {
    setInputText('这是一段需要加密的机密信息')
    setSecretKey('MySecretKey123')
    setMode('encrypt')
    setOutputText('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            AES 加解密工具
          </h1>

          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMode('encrypt')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  mode === 'encrypt'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                加密
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  mode === 'decrypt'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                解密
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {mode === 'encrypt' ? '原始文本' : '密文'}
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的密文...'}
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 输出区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {mode === 'encrypt' ? '密文' : '原始文本'}
              </h2>
              <div className="relative">
                <textarea
                  value={outputText}
                  readOnly
                  placeholder={mode === 'encrypt' ? '加密后的密文将显示在这里...' : '解密后的文本将显示在这里...'}
                  className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm"
                />
                {outputText && (
                  <button
                    onClick={copyOutput}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    复制
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 密钥输入 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密钥
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="输入加密/解密密钥..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={generateRandomKey}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                生成随机密钥
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={handleProcess}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {mode === 'encrypt' ? '加密' : '解密'}
            </button>
            <button
              onClick={swapText}
              disabled={!outputText}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              交换文本
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              加载示例
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              清空所有
            </button>
          </div>

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              功能说明
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">加密</h4>
                <ul className="space-y-1">
                  <li>• 使用 AES-256 对称加密算法</li>
                  <li>• 支持任意长度的文本</li>
                  <li>• 使用密钥进行加密</li>
                  <li>• 加密结果为 Base64 编码</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">解密</h4>
                <ul className="space-y-1">
                  <li>• 必须使用相同的密钥</li>
                  <li>• 自动检测并处理错误</li>
                  <li>• 支持批量解密</li>
                  <li>• 解密失败会给出提示</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>安全提示：</strong>请妥善保管您的密钥，丢失密钥将无法恢复加密的数据！
              </p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  )
}