"use client"

import { useState } from 'react'
import { format } from 'sql-formatter'

export default function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState('')
  const [formattedSql, setFormattedSql] = useState('')
  const [indentation, setIndentation] = useState('  ')
  const [uppercase, setUppercase] = useState(true)
  const [linesBetweenQueries, setLinesBetweenQueries] = useState(2)
  const [error, setError] = useState('')

  const formatSQL = () => {
    try {
      setError('')
      const formatted = format(sqlInput, {
        language: 'sql',
        indent: indentation,
        uppercase: uppercase,
        linesBetweenQueries: linesBetweenQueries,
        paramTypes: { positional: true, named: [':'] }
      })
      setFormattedSql(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SQL 格式化失败')
    }
  }

  const clearAll = () => {
    setSqlInput('')
    setFormattedSql('')
    setError('')
  }

  const copyFormatted = () => {
    navigator.clipboard.writeText(formattedSql)
  }

  const loadExample = () => {
    setSqlInput(`SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND (u.status = 'active' OR u.status = 'premium') GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC LIMIT 10`)
    setFormattedSql('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            SQL 格式化器
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                输入 SQL
              </h2>
              <textarea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="在此粘贴您的 SQL 代码..."
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
                <textarea
                  value={formattedSql}
                  readOnly
                  placeholder="格式化后的 SQL 将显示在这里..."
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
                {formattedSql && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  id="uppercase"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="uppercase" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  关键字大写
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  查询间空行
                </label>
                <select
                  value={linesBetweenQueries}
                  onChange={(e) => setLinesBetweenQueries(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>0 行</option>
                  <option value={1}>1 行</option>
                  <option value={2}>2 行</option>
                  <option value={3}>3 行</option>
                </select>
              </div>

              <button
                onClick={formatSQL}
                disabled={!sqlInput.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors h-10"
              >
                格式化 SQL
              </button>
            </div>
          </div>

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              功能说明
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• 支持标准 SQL 语法格式化</li>
              <li>• 自动缩进和对齐</li>
              <li>• 关键字大小写转换</li>
              <li>• 支持复杂的嵌套查询</li>
              <li>• 支持多种数据库方言</li>
              <li>• 可自定义格式化规则</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}