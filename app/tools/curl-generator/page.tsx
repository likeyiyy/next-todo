"use client"

import { useState } from 'react'
import UnifiedHeader from '../../components/UnifiedHeader'

interface CurlOption {
  key: string
  value: string
  enabled: boolean
}

export default function CurlGenerator() {
  const [url, setUrl] = useState<string>('https://api.example.com/users')
  const [method, setMethod] = useState<string>('GET')
  const [headers, setHeaders] = useState<CurlOption[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [data, setData] = useState<string>('')
  const [auth, setAuth] = useState<{ type: 'none' | 'basic' | 'bearer'; username: string; password: string; token: string }>({
    type: 'none',
    username: '',
    password: '',
    token: ''
  })
  const [options, setOptions] = useState({
    verbose: false,
    insecure: false,
    followRedirects: false,
    silent: false,
    include: false,
    compressed: false
  })
  const [curlCommand, setCurlCommand] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  const generateCurl = () => {
    let command = 'curl'

    // 方法
    if (method !== 'GET') {
      command += ` -X ${method}`
    }

    // URL
    command += ` \\\n  '${url}'`

    // Headers
    headers
      .filter(h => h.enabled)
      .forEach(header => {
        command += ` \\\n  -H '${header.key}: ${header.value}'`
      })

    // 认证
    if (auth.type === 'basic' && auth.username && auth.password) {
      command += ` \\\n  -u '${auth.username}:${auth.password}'`
    } else if (auth.type === 'bearer' && auth.token) {
      command += ` \\\n  -H 'Authorization: Bearer ${auth.token}'`
    }

    // 数据
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      // 转义单引号
      const escapedData = data.replace(/'/g, "'\"'\"'")
      command += ` \\\n  -d '${escapedData}'`
    }

    // 选项
    if (options.verbose) command += ' \\\n  -v'
    if (options.insecure) command += ' \\\n  -k'
    if (options.followRedirects) command += ' \\\n  -L'
    if (options.silent) command += ' \\\n  -s'
    if (options.include) command += ' \\\n  -i'
    if (options.compressed) command += ' \\\n  --compressed'

    setCurlCommand(command)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: keyof CurlOption, value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  const loadExample = (type: 'get' | 'post' | 'auth') => {
    switch (type) {
      case 'get':
        setUrl('https://jsonplaceholder.typicode.com/posts/1')
        setMethod('GET')
        setHeaders([{ key: 'Accept', value: 'application/json', enabled: true }])
        setData('')
        setAuth({ type: 'none', username: '', password: '', token: '' })
        break
      case 'post':
        setUrl('https://jsonplaceholder.typicode.com/posts')
        setMethod('POST')
        setHeaders([
          { key: 'Content-Type', value: 'application/json', enabled: true },
          { key: 'Accept', value: 'application/json', enabled: true }
        ])
        setData(JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1
        }, null, 2))
        setAuth({ type: 'none', username: '', password: '', token: '' })
        break
      case 'auth':
        setUrl('https://api.github.com/user')
        setMethod('GET')
        setHeaders([{ key: 'Accept', value: 'application/vnd.github.v3+json', enabled: true }])
        setData('')
        setAuth({ type: 'bearer', username: '', password: '', token: 'your_token_here' })
        break
    }
    setOptions({
      verbose: false,
      insecure: false,
      followRedirects: false,
      silent: false,
      include: false,
      compressed: false
    })
    setCurlCommand('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            CURL 命令生成器
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 配置区域 */}
            <div className="space-y-6">
              {/* URL 和方法 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  请求方法
                </label>
                <div className="flex gap-2 mb-3">
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        method === m
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  请求 URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Headers */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Headers
                  </label>
                  <button
                    onClick={addHeader}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    添加 Header
                  </button>
                </div>
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                        className="mt-2"
                      />
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header Name"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header Value"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm"
                      />
                      {headers.length > 1 && (
                        <button
                          onClick={() => removeHeader(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 认证 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  认证方式
                </label>
                <select
                  value={auth.type}
                  onChange={(e) => setAuth({ ...auth, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                >
                  <option value="none">无认证</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                </select>

                {auth.type === 'basic' && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={auth.username}
                      onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                      placeholder="用户名"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                    <input
                      type="password"
                      value={auth.password}
                      onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                      placeholder="密码"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                )}

                {auth.type === 'bearer' && (
                  <input
                    type="text"
                    value={auth.token}
                    onChange={(e) => setAuth({ ...auth, token: e.target.value })}
                    placeholder="Bearer Token"
                    className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                )}
              </div>

              {/* 请求体 */}
              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    请求体 (JSON)
                  </label>
                  <textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  />
                </div>
              )}

              {/* 选项 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  附加选项
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'verbose', label: '详细输出 (-v)' },
                    { key: 'insecure', label: '忽略 SSL 证书 (-k)' },
                    { key: 'followRedirects', label: '跟随重定向 (-L)' },
                    { key: 'silent', label: '静默模式 (-s)' },
                    { key: 'include', label: '包含响应头 (-i)' },
                    { key: 'compressed', label: '请求压缩传输 (--compressed)' }
                  ].map(option => (
                    <label key={option.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options[option.key as keyof typeof options]}
                        onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 示例按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={() => loadExample('get')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  GET 示例
                </button>
                <button
                  onClick={() => loadExample('post')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  POST 示例
                </button>
                <button
                  onClick={() => loadExample('auth')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  认证示例
                </button>
              </div>

              {/* 生成按钮 */}
              <button
                onClick={generateCurl}
                disabled={!url}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                生成 CURL 命令
              </button>
            </div>

            {/* 结果区域 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  CURL 命令
                </h2>
                {curlCommand && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    {copied ? '已复制!' : '复制命令'}
                  </button>
                )}
              </div>

              <div className="relative">
                <pre className="w-full h-96 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-auto">
                  {curlCommand || 'CURL 命令将显示在这里...'}
                </pre>
              </div>

              {/* 常用命令参考 */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  常用 CURL 参数
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-X, --request</span>
                    <span className="text-gray-700 dark:text-gray-200">指定请求方法</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-H, --header</span>
                    <span className="text-gray-700 dark:text-gray-200">添加请求头</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-d, --data</span>
                    <span className="text-gray-700 dark:text-gray-200">发送请求体</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-u, --user</span>
                    <span className="text-gray-700 dark:text-gray-200">基本认证</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-L, --location</span>
                    <span className="text-gray-700 dark:text-gray-200">跟随重定向</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-v, --verbose</span>
                    <span className="text-gray-700 dark:text-gray-200">显示详细通信过程</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-mono text-gray-600 dark:text-gray-300">-o, --output</span>
                    <span className="text-gray-700 dark:text-gray-200">输出到文件</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}