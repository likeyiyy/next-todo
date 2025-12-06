'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UnifiedHeader from '../../components/UnifiedHeader'

interface IPInfo {
  ip: string
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
  org: string
  as: string
  isVPN?: boolean
  isProxy?: boolean
}

export default function IPLookup() {
  const [inputIP, setInputIP] = useState('')
  const [currentIP, setCurrentIP] = useState('')
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 获取当前用户的公网 IP
    fetchCurrentIP()
  }, [])

  const fetchCurrentIP = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setCurrentIP(data.ip)
      setInputIP(data.ip)
      await lookupIP(data.ip)
    } catch (err) {
      setError('无法获取当前 IP 地址')
    } finally {
      setLoading(false)
    }
  }

  const lookupIP = async (ip: string) => {
    if (!ip) return

    try {
      setLoading(true)
      setError('')

      // 使用 ip-api.com 的免费 API
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,timezone,isp,org,as,proxy,hosting,query`)
      const data = await response.json()

      if (data.status === 'success') {
        setIpInfo({
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as,
          isVPN: data.proxy || data.hosting
        })
      } else {
        setError(data.message || '查询失败')
        setIpInfo(null)
      }
    } catch (err) {
      setError('查询 IP 信息时出错')
      setIpInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLookup = () => {
    if (inputIP) {
      lookupIP(inputIP)
    }
  }

  const isValidIP = (ip: string) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  const exampleIPs = [
    { ip: '8.8.8.8', description: 'Google DNS' },
    { ip: '1.1.1.1', description: 'Cloudflare DNS' },
    { ip: '208.67.222.222', description: 'OpenDNS' },
    { ip: '114.114.114.114', description: '114 DNS (中国)' },
    { ip: '223.5.5.5', description: '阿里 DNS (中国)' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            IP 地址查询
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            查询 IP 地址的地理位置、ISP 等信息
          </p>

      <div className="space-y-6">
        {/* 当前 IP */}
        {currentIP && (
          <Card>
            <CardHeader>
              <CardTitle>您的公网 IP</CardTitle>
              <CardDescription>您当前的公网 IP 地址</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-mono font-bold">{currentIP}</div>
                <button
                  onClick={() => lookupIP(currentIP)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  disabled={loading}
                >
                  查询详情
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* IP 查询输入 */}
        <Card>
          <CardHeader>
            <CardTitle>查询 IP 地址</CardTitle>
            <CardDescription>输入要查询的 IP 地址</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputIP}
                onChange={(e) => setInputIP(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                placeholder="输入 IP 地址 (例如: 8.8.8.8)"
                className="flex-1 px-3 py-2 border rounded-md font-mono"
              />
              <button
                onClick={handleLookup}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                disabled={!inputIP || loading || !isValidIP(inputIP)}
              >
                {loading ? '查询中...' : '查询'}
              </button>
            </div>

            {inputIP && !isValidIP(inputIP) && (
              <p className="mt-2 text-sm text-destructive">
                请输入有效的 IP 地址
              </p>
            )}

            {error && (
              <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 示例 IP */}
        <Card>
          <CardHeader>
            <CardTitle>示例 IP</CardTitle>
            <CardDescription>点击快速查询常用 IP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {exampleIPs.map((example) => (
                <button
                  key={example.ip}
                  onClick={() => {
                    setInputIP(example.ip)
                    lookupIP(example.ip)
                  }}
                  className="p-3 text-left bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <div className="font-mono font-medium">{example.ip}</div>
                  <div className="text-xs text-muted-foreground">{example.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 查询结果 */}
        {ipInfo && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">IP 地址：</span>
                    <div className="font-mono font-medium">{ipInfo.ip}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">国家：</span>
                    <div className="font-medium">{ipInfo.country || '未知'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">地区：</span>
                    <div className="font-medium">{ipInfo.region || '未知'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">城市：</span>
                    <div className="font-medium">{ipInfo.city || '未知'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* 网络信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>网络信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">ISP：</span>
                    <div className="font-medium">{ipInfo.isp || '未知'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">组织：</span>
                    <div className="font-medium">{ipInfo.org || '未知'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">AS 号：</span>
                    <div className="font-medium text-sm">{ipInfo.as || '未知'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">时区：</span>
                    <div className="font-medium">{ipInfo.timezone || '未知'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* 地理位置 */}
              <Card>
                <CardHeader>
                  <CardTitle>地理位置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">经度：</span>
                      <div className="font-medium">{ipInfo.longitude || '未知'}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">纬度：</span>
                      <div className="font-medium">{ipInfo.latitude || '未知'}</div>
                    </div>
                    {ipInfo.latitude && ipInfo.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        在 Google Maps 中查看
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 安全信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>安全信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">代理/VPN：</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        ipInfo.isVPN
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {ipInfo.isVPN ? '可能是' : '未检测到'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* JSON 数据 */}
            <Card>
              <CardHeader>
                <CardTitle>JSON 数据</CardTitle>
                <CardDescription>完整的查询结果（JSON 格式）</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(ipInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}

        {/* 说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • 支持查询 IPv4 地址的部分信息
            </p>
            <p>
              • 地理位置信息基于 IP 地址数据库，可能存在误差
            </p>
            <p>
              • 本工具使用免费的 IP 查询服务，可能有查询频率限制
            </p>
            <p>
              • IP 地址的精确位置信息通常不会公开，查询结果仅供参考
            </p>
          </CardContent>
        </Card>
      </div>
        </div>
      </main>
    </div>
  )
}