"use client"

import { useState } from 'react'

export default function XMLFormatter() {
  const [xmlInput, setXmlInput] = useState('')
  const [formattedXml, setFormattedXml] = useState('')
  const [indentation, setIndentation] = useState('  ')
  const [error, setError] = useState('')
  const [lineNumbers, setLineNumbers] = useState(true)

  const formatXML = (xml: string, indent: string): string => {
    const PADDING = ' '.repeat(100)
    let reg = /(>)(<)(\/*)/g
    xml = xml.replace(reg, '$1\r\n$2$3')
    let pad = 0
    let formatted = ''

    xml.split('\r\n').forEach((node) => {
      let indentNum = 0
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indentNum = 0
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) {
          pad -= 1
        }
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indentNum = 1
      } else {
        indentNum = 0
      }

      let padding = ''
      for (let i = 0; i < pad; i++) {
        padding += indent
      }

      formatted += padding + node + '\r\n'
      pad += indentNum
    })

    return formatted.trim()
  }

  const minifyXML = (xml: string): string => {
    return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
  }

  const handleFormat = () => {
    try {
      setError('')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlInput, 'text/xml')

      const parseError = xmlDoc.getElementsByTagName('parsererror')
      if (parseError.length > 0) {
        throw new Error('XML 格式错误：无法解析 XML 文档')
      }

      const formatted = formatXML(xmlInput, indentation)
      setFormattedXml(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'XML 格式化失败')
      setFormattedXml('')
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlInput, 'text/xml')

      const parseError = xmlDoc.getElementsByTagName('parsererror')
      if (parseError.length > 0) {
        throw new Error('XML 格式错误：无法解析 XML 文档')
      }

      const minified = minifyXML(xmlInput)
      setFormattedXml(minified)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'XML 压缩失败')
      setFormattedXml('')
    }
  }

  const clearAll = () => {
    setXmlInput('')
    setFormattedXml('')
    setError('')
  }

  const copyFormatted = () => {
    navigator.clipboard.writeText(formattedXml)
  }

  const loadExample = () => {
    setXmlInput(`<?xml version="1.0" encoding="UTF-8"?><bookstore><book category="fiction"><title lang="en">The Great Gatsby</title><author>F. Scott Fitzgerald</author><year>1925</year><price>10.99</price></book><book category="children"><title lang="en">Harry Potter</title><author>J.K. Rowling</author><year>1997</year><price>15.99</price></book><book category="web"><title lang="en">Learning XML</title><author>Erik T. Ray</author><year>2003</year><price>39.95</price></book></bookstore>`)
    setFormattedXml('')
    setError('')
  }

  const addLineNumbers = (text: string): string => {
    if (!lineNumbers) return text
    const lines = text.split('\n')
    const numberedLines = lines.map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ')
      return `${lineNumber}  ${line}`
    })
    return numberedLines.join('\n')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            XML 格式化器
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                输入 XML
              </h2>
              <textarea
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder="在此粘贴您的 XML 代码..."
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={loadExample}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  加载示例
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>

            {/* 输出区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                格式化结果
              </h2>
              <div className="relative">
                <pre className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-auto">
                  {addLineNumbers(formattedXml || '格式化后的 XML 将显示在这里...')}
                </pre>
                {formattedXml && (
                  <button
                    onClick={copyFormatted}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    复制
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* 配置选项 */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              格式化选项
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  缩进字符
                </label>
                <select
                  value={indentation}
                  onChange={(e) => setIndentation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="  ">2 空格</option>
                  <option value="    ">4 空格</option>
                  <option value="\t">Tab</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="lineNumbers"
                  checked={lineNumbers}
                  onChange={(e) => setLineNumbers(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="lineNumbers" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  显示行号
                </label>
              </div>

              <button
                onClick={handleFormat}
                disabled={!xmlInput.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                格式化
              </button>

              <button
                onClick={handleMinify}
                disabled={!xmlInput.trim()}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                压缩
              </button>
            </div>
          </div>

          {/* 统计信息 */}
          {xmlInput && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">输入行数:</span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    {xmlInput.split('\n').length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">输入字符:</span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    {xmlInput.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">输出行数:</span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    {formattedXml ? formattedXml.split('\n').length : 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">输出字符:</span>
                  <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
                    {formattedXml ? formattedXml.length : 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              功能说明
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• 支持 XML 代码格式化和美化</li>
              <li>• 自动缩进和对齐</li>
              <li>• 支持自定义缩进样式（2空格/4空格/Tab）</li>
              <li>• 显示行号便于查看</li>
              <li>• XML 压缩功能，移除多余空格和换行</li>
              <li>• 自动检测 XML 语法错误</li>
              <li>• 支持处理 XML 声明和注释</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}