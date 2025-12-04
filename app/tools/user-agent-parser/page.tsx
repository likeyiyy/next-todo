'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ParsedUA {
  browser: {
    name: string
    version: string
  }
  os: {
    name: string
    version: string
  }
  device: {
    type: string
    vendor?: string
    model?: string
  }
  engine: {
    name: string
    version: string
  }
}

export default function UserAgentParser() {
  const [userAgent, setUserAgent] = useState('')
  const [parsedInfo, setParsedInfo] = useState<ParsedUA | null>(null)
  const [currentUA, setCurrentUA] = useState('')

  useEffect(() => {
    // 获取当前浏览器的 User-Agent
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent
      setCurrentUA(ua)
      setUserAgent(ua)
      parseUserAgent(ua)
    }
  }, [])

  const parseUserAgent = (ua: string) => {
    if (!ua) {
      setParsedInfo(null)
      return
    }

    const info: ParsedUA = {
      browser: { name: 'Unknown', version: 'Unknown' },
      os: { name: 'Unknown', version: 'Unknown' },
      device: { type: 'Unknown' },
      engine: { name: 'Unknown', version: 'Unknown' }
    }

    // 解析浏览器
    if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
      info.browser.name = 'Chrome'
      const match = ua.match(/Chrome\/(\d+\.\d+)/)
      if (match) info.browser.version = match[1]
    } else if (ua.includes('Firefox/')) {
      info.browser.name = 'Firefox'
      const match = ua.match(/Firefox\/(\d+\.\d+)/)
      if (match) info.browser.version = match[1]
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
      info.browser.name = 'Safari'
      const match = ua.match(/Version\/(\d+\.\d+)/)
      if (match) info.browser.version = match[1]
    } else if (ua.includes('Edg/')) {
      info.browser.name = 'Edge'
      const match = ua.match(/Edg\/(\d+\.\d+)/)
      if (match) info.browser.version = match[1]
    }

    // 解析操作系统
    if (ua.includes('Windows')) {
      info.os.name = 'Windows'
      if (ua.includes('Windows NT 10.0')) info.os.version = '10/11'
      else if (ua.includes('Windows NT 6.3')) info.os.version = '8.1'
      else if (ua.includes('Windows NT 6.2')) info.os.version = '8'
      else if (ua.includes('Windows NT 6.1')) info.os.version = '7'
    } else if (ua.includes('Mac OS X')) {
      info.os.name = 'macOS'
      const match = ua.match(/Mac OS X (\d+[._]\d+)/)
      if (match) info.os.version = match[1].replace('_', '.')
    } else if (ua.includes('Linux')) {
      info.os.name = 'Linux'
      if (ua.includes('Ubuntu')) {
        info.os.name = 'Ubuntu'
      }
    } else if (ua.includes('Android')) {
      info.os.name = 'Android'
      const match = ua.match(/Android (\d+\.\d+)/)
      if (match) info.os.version = match[1]
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      info.os.name = 'iOS'
      const match = ua.match(/OS (\d+[._]\d+)/)
      if (match) info.os.version = match[1].replace('_', '.')
    }

    // 解析设备类型
    if (ua.includes('Mobile') || ua.includes('iPhone') || ua.includes('Android')) {
      info.device.type = 'Mobile'
    } else if (ua.includes('Tablet') || ua.includes('iPad')) {
      info.device.type = 'Tablet'
    } else {
      info.device.type = 'Desktop'
    }

    // 解析设备厂商和型号（部分）
    if (ua.includes('iPhone')) {
      info.device.vendor = 'Apple'
      info.device.model = 'iPhone'
    } else if (ua.includes('iPad')) {
      info.device.vendor = 'Apple'
      info.device.model = 'iPad'
    } else if (ua.includes('Samsung')) {
      info.device.vendor = 'Samsung'
    } else if (ua.includes('Huawei')) {
      info.device.vendor = 'Huawei'
    }

    // 解析渲染引擎
    if (ua.includes('AppleWebKit/')) {
      info.engine.name = 'WebKit'
      const match = ua.match(/AppleWebKit\/(\d+\.\d+)/)
      if (match) info.engine.version = match[1]
    } else if (ua.includes('Gecko/')) {
      info.engine.name = 'Gecko'
      const match = ua.match(/Gecko\/(\d+)/)
      if (match) info.engine.version = match[1]
    }

    setParsedInfo(info)
  }

  const handleInputChange = (value: string) => {
    setUserAgent(value)
    parseUserAgent(value)
  }

  const exampleUAs = [
    {
      name: 'Chrome on Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: 'Safari on macOS',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    },
    {
      name: 'Firefox on Linux',
      ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0'
    },
    {
      name: 'Chrome on Android',
      ua: 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    },
    {
      name: 'Safari on iPhone',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
    },
    {
      name: 'Edge on Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    }
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User-Agent 解析器</h1>
        <p className="text-muted-foreground">
          解析浏览器 User-Agent 字符串，提取浏览器、操作系统、设备等信息
        </p>
      </div>

      <div className="space-y-6">
        {/* 当前浏览器 User-Agent */}
        {currentUA && (
          <Card>
            <CardHeader>
              <CardTitle>当前浏览器 User-Agent</CardTitle>
              <CardDescription>您当前使用的浏览器的 User-Agent 字符串</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md">
                <code className="text-sm break-all">{currentUA}</code>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User-Agent 输入 */}
        <Card>
          <CardHeader>
            <CardTitle>输入 User-Agent</CardTitle>
            <CardDescription>粘贴或输入要解析的 User-Agent 字符串</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={userAgent}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
              className="w-full h-32 px-3 py-2 border rounded-md font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* 示例 User-Agents */}
        <Card>
          <CardHeader>
            <CardTitle>示例 User-Agents</CardTitle>
            <CardDescription>点击使用示例进行测试</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleUAs.map((example) => (
                <button
                  key={example.name}
                  onClick={() => handleInputChange(example.ua)}
                  className="p-3 text-left bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <div className="font-medium mb-1">{example.name}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {example.ua}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 解析结果 */}
        {parsedInfo && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 浏览器信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>浏览器信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">名称：</span>
                      <span className="font-medium">{parsedInfo.browser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">版本：</span>
                      <span className="font-medium">{parsedInfo.browser.version}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作系统信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>操作系统</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">名称：</span>
                      <span className="font-medium">{parsedInfo.os.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">版本：</span>
                      <span className="font-medium">{parsedInfo.os.version}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 设备信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>设备信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">类型：</span>
                      <span className="font-medium">{parsedInfo.device.type}</span>
                    </div>
                    {parsedInfo.device.vendor && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">厂商：</span>
                        <span className="font-medium">{parsedInfo.device.vendor}</span>
                      </div>
                    )}
                    {parsedInfo.device.model && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">型号：</span>
                        <span className="font-medium">{parsedInfo.device.model}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 渲染引擎 */}
              <Card>
                <CardHeader>
                  <CardTitle>渲染引擎</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">名称：</span>
                      <span className="font-medium">{parsedInfo.engine.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">版本：</span>
                      <span className="font-medium">{parsedInfo.engine.version}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* JSON 格式 */}
            <Card>
              <CardHeader>
                <CardTitle>解析结果 (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(parsedInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}

        {/* 说明 */}
        <Card>
          <CardHeader>
            <CardTitle>关于 User-Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              User-Agent 是一个包含客户端信息的字符串，服务器可以通过它来识别：
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>浏览器类型和版本</li>
              <li>操作系统信息</li>
              <li>设备类型（桌面、移动设备、平板等）</li>
              <li>渲染引擎信息</li>
            </ul>
            <p className="mt-3">
              注意：由于用户可以修改 User-Agent 字符串，因此不能完全依赖它来判断客户端信息。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}