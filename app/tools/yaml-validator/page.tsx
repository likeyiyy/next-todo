"use client"

import { useState } from 'react'

interface YamlError {
  line: number
  column: number
  message: string
}

export default function YAMLValidator() {
  const [yamlInput, setYamlInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<YamlError | null>(null)

  const parseYAML = (yaml: string): any => {
    // 简单的 YAML 解析器（基础实现）
    const lines = yaml.split('\n')
    const result: any = {}
    const stack: any[] = [result]
    let currentIndent = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // 跳过空行和注释
      if (!trimmed || trimmed.startsWith('#')) continue

      // 计算缩进
      const indent = line.length - line.trimStart().length

      // 处理列表项
      if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2)
        const list = stack[stack.length - 1]

        if (!Array.isArray(list)) {
          throw new Error(`Expected list at line ${i + 1}`)
        }

        // 处理嵌套对象
        if (value.includes(':')) {
          const [key, val] = value.split(':').map(s => s.trim())
          const obj = {}
          obj[key] = val || ''
          list.push(obj)
          stack.push(obj)
        } else {
          list.push(parseValue(value))
        }
      }
      // 处理键值对
      else if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':').map(s => s.trim())

        // 调整堆栈深度
        while (stack.length > 1 && indent <= currentIndent) {
          stack.pop()
          currentIndent -= 2
        }

        const current = stack[stack.length - 1]

        if (!value) {
          // 嵌套对象
          current[key] = {}
          stack.push(current[key])
          currentIndent = indent
        } else {
          current[key] = parseValue(value)
        }
      }
    }

    return result
  }

  const parseValue = (value: string): any => {
    // 移除引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1)
    }

    // 数字
    if (!isNaN(Number(value))) {
      return Number(value)
    }

    // 布尔值
    if (value === 'true' || value === 'false') {
      return value === 'true'
    }

    // null
    if (value === 'null' || value === '~') {
      return null
    }

    return value
  }

  const convertToJSON = (yaml: string) => {
    try {
      setError(null)
      const parsed = parseYAML(yaml)
      const json = JSON.stringify(parsed, null, 2)
      setJsonOutput(json)
      setIsValid(true)
    } catch (err) {
      setError({
        line: 0,
        column: 0,
        message: err instanceof Error ? err.message : 'YAML 解析失败'
      })
      setJsonOutput('')
      setIsValid(false)
    }
  }

  const clearAll = () => {
    setYamlInput('')
    setJsonOutput('')
    setIsValid(null)
    setError(null)
  }

  const copyJSON = () => {
    navigator.clipboard.writeText(jsonOutput)
  }

  const loadExample = () => {
    setYamlInput(`# 应用配置示例
app:
  name: "My App"
  version: 1.0.0
  production: false
  features:
    - authentication
    - analytics
    - notifications

database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret123

servers:
  - name: "Web Server 1"
    ip: "192.168.1.10"
    role: "web"
  - name: "DB Server"
    ip: "192.168.1.20"
    role: "database"

settings:
  cache_enabled: true
  timeout: 30
  retries: 3
  log_level: "info"`)
    setJsonOutput('')
    setIsValid(null)
    setError(null)
  }

  const loadInvalidExample = () => {
    setYamlInput(`# 错误的 YAML 示例
app:
  name: "Invalid YAML"
  version: 1.0
  - invalid_list_item
    nested_key: value
  key_without_value:
    key2: value2
  another_key: value
    bad_indent: true`)
    setJsonOutput('')
    setIsValid(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            YAML 验证器
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* YAML 输入区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                YAML 输入
              </h2>
              <textarea
                value={yamlInput}
                onChange={(e) => {
                  setYamlInput(e.target.value)
                  setIsValid(null)
                  setError(null)
                  setJsonOutput('')
                }}
                placeholder="在此粘贴您的 YAML 代码..."
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
                  onClick={loadInvalidExample}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  加载错误示例
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>

            {/* JSON 输出区域 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                JSON 输出
              </h2>
              <div className="relative">
                <textarea
                  value={jsonOutput}
                  readOnly
                  placeholder="转换后的 JSON 将显示在这里..."
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
                {jsonOutput && (
                  <button
                    onClick={copyJSON}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    复制
                  </button>
                )}
              </div>

              {/* 验证状态 */}
              {isValid !== null && (
                <div className={`mt-2 p-3 rounded-lg ${
                  isValid
                    ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700'
                    : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'
                }`}>
                  {isValid ? (
                    <p className="text-green-700 dark:text-green-300 text-sm font-semibold">
                      ✓ YAML 格式有效
                    </p>
                  ) : error && (
                    <div>
                      <p className="text-red-700 dark:text-red-300 text-sm font-semibold">
                        ✗ YAML 格式错误
                      </p>
                      <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                        {error.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 验证按钮 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => convertToJSON(yamlInput)}
              disabled={!yamlInput.trim()}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
            >
              验证并转换为 JSON
            </button>
          </div>

          {/* YAML 语法提示 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              YAML 语法规则
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">基本语法</h4>
                <ul className="space-y-1">
                  <li>• 使用空格缩进，不使用 Tab</li>
                  <li>• 缩进必须一致（建议 2 空格）</li>
                  <li>• 键值对使用冒号分隔</li>
                  <li>• 列表项使用连字符开头</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">数据类型</h4>
                <ul className="space-y-1">
                  <li>• 字符串：可加引号或不加</li>
                  <li>• 数字：直接写数字</li>
                  <li>• 布尔值：true/false</li>
                  <li>• 空值：null 或 ~</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 常见错误示例 */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              常见错误
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <strong>缩进不一致：</strong>混用空格和 Tab，或缩进空格数不同</li>
              <li>• <strong>冒号后缺少空格：</strong>应该使用 <code>key: value</code> 而不是 <code>key:value</code></li>
              <li>• <strong>列表项格式错误：</strong>确保连字符后有空格</li>
              <li>• <strong>特殊字符：</strong>包含特殊字符的字符串需要加引号</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}