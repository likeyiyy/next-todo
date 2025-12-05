"use client"

import { useState } from 'react'
import UnifiedHeader from '../../components/UnifiedHeader'

interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  time: number
  size: number
}

interface RequestHistory {
  id: string
  method: string
  url: string
  status: number
  time: number
  timestamp: Date
}

export default function ApiTester() {
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1')
  const [method, setMethod] = useState<string>('GET')
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}')
  const [body, setBody] = useState<string>('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [history, setHistory] = useState<RequestHistory[]>([])

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const sendRequest = async () => {
    setLoading(true)
    setError('')
    setResponse(null)

    const startTime = Date.now()

    try {
      let parsedHeaders = {}
      try {
        parsedHeaders = JSON.parse(headers)
      } catch (e) {
        // 如果 headers 不是有效的 JSON，使用空对象
      }

      const fetchOptions: RequestInit = {
        method,
        headers: parsedHeaders,
      }

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        fetchOptions.body = body
      }

      // 由于 CORS 限制，我们需要使用代理或只支持 CORS-enabled API
      // 这里使用示例 API，实际应用中可能需要后端代理
      const res = await fetch(url, fetchOptions)

      const endTime = Date.now()
      const responseTime = endTime - startTime

      const responseHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseData
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json()
      } else {
        responseData = await res.text()
      }

      const apiResponse: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data: responseData,
        time: responseTime,
        size: JSON.stringify(responseData).length
      }

      setResponse(apiResponse)

      // 添加到历史记录
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        status: res.status,
        time: responseTime,
        timestamp: new Date()
      }
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // 保留最近10条
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (type: 'json' | 'post' | 'error') => {
    switch (type) {
      case 'json':
        setUrl('https://jsonplaceholder.typicode.com/posts/1')
        setMethod('GET')
        setBody('')
        break
      case 'post':
        setUrl('https://jsonplaceholder.typicode.com/posts')
        setMethod('POST')
        setBody(JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1
        }, null, 2))
        break
      case 'error':
        setUrl('https://jsonplaceholder.typicode.com/posts/999999')
        setMethod('GET')
        setBody('')
        break
    }
    setResponse(null)
    setError('')
  }

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return data
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 300 && status < 400) return 'text-yellow-600'
    if (status >= 400 && status < 500) return 'text-orange-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            API 测试工具
          </h1>

          {/* 请求配置 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* URL 和方法 */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                请求 URL
              </label>
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 示例按钮 */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => loadExample('json')}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  GET 示例
                </button>
                <button
                  onClick={() => loadExample('post')}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  POST 示例
                </button>
                <button
                  onClick={() => loadExample('error')}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  404 示例
                </button>
              </div>
            </div>

            {/* 发送按钮 */}
            <div className="flex items-end">
              <button
                onClick={sendRequest}
                disabled={loading || !url}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? '发送中...' : '发送请求'}
              </button>
            </div>
          </div>

          {/* Headers 和 Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Headers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Headers (JSON)
              </label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>

            {/* Body */}
            {['POST', 'PUT', 'PATCH'].includes(method) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
          </div>

          {/* 响应结果 */}
          {response && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                响应结果
              </h2>

              {/* 响应状态 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">状态码</p>
                  <p className={`text-lg font-semibold ${getStatusColor(response.status)}`}>
                    {response.status}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">状态文本</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {response.statusText}
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">响应时间</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {response.time}ms
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">响应大小</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {(response.size / 1024).toFixed(2)}KB
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Content-Type</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {response.headers['content-type'] || 'N/A'}
                  </p>
                </div>
              </div>

              {/* 响应 Headers */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response Headers
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-600 dark:text-gray-400">
                    {formatJson(response.headers)}
                  </pre>
                </div>
              </div>

              {/* 响应 Body */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response Body
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto max-h-96">
                  <pre className="text-sm text-gray-600 dark:text-gray-400">
                    {formatJson(response.data)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">
                <strong>错误：</strong> {error}
              </p>
            </div>
          )}

          {/* 请求历史 */}
          {history.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                请求历史
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        方法
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        耗时
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.timestamp.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                            {item.method}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
                          {item.url}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {item.time}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              使用说明
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• 支持 GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS 方法</li>
              <li>• 由于浏览器 CORS 限制，只能测试支持 CORS 的 API</li>
              <li>• Headers 和 Body 支持 JSON 格式</li>
              <li>• 自动保存最近 10 条请求历史</li>
              <li>• 响应支持 JSON 和纯文本格式</li>
              <li>• 提供常用 API 示例，快速测试</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}