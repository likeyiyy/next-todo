'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UnifiedHeader from '../../components/UnifiedHeader'

export default function JWTParser() {
  const [jwtInput, setJwtInput] = useState('')
  const [header, setHeader] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  const [isValidJWT, setIsValidJWT] = useState(false)

  const parseJWT = (token: string) => {
    try {
      setError('')
      setHeader(null)
      setPayload(null)
      setSignature('')

      const parts = token.split('.')

      if (parts.length !== 3) {
        throw new Error('JWT 必须包含3个部分：header.payload.signature')
      }

      // 解析 header
      const headerDecoded = JSON.parse(atob(parts[0]))
      setHeader(headerDecoded)

      // 解析 payload
      const payloadDecoded = JSON.parse(atob(parts[1]))
      setPayload(payloadDecoded)

      // 获取 signature
      setSignature(parts[2])

      setIsValidJWT(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析 JWT 失败')
      setIsValidJWT(false)
    }
  }

  const handleInputChange = (value: string) => {
    setJwtInput(value)
    if (value) {
      parseJWT(value)
    } else {
      setHeader(null)
      setPayload(null)
      setSignature('')
      setError('')
      setIsValidJWT(false)
    }
  }

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  const exampleJWTs = [
    {
      name: 'HS256 示例',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    },
    {
      name: 'RS256 示例',
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKAtAHrL30f-woNHILN8qHMYgJ19wpiGz5QYQjQfPpdbntymvz4gEIv1BVUM-yJlf9Mlr3ATqpAzsWAu_9JfOnPVkYs1sL8bC_-2e1-owqV21EyGOa5VD3A5fg4dGtkdYQUq1JDS9vM-2AQpwG7g9Z6vVqB7adJ1w5ZdZrQ3fQqLlwBx1f_sDVQPklPdGeI2gd52I81SJz7zsTMj7GMRg6mSIiYUBjzPnAFa9QhE3Jj9RJa3cd5Hb-9pYSco6-TgqJ3qPZmw6n2A9wubFGdYCxOwLzIEC2NdRvh2x2r8Xc1lCkH81roGPRzkb8r5L2BSMLwUVmwGhGyPLxZp'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            JWT 解析器
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            解码和验证 JSON Web Token (JWT) 的内容
          </p>

      <div className="space-y-6">
        {/* JWT 输入 */}
        <Card>
          <CardHeader>
            <CardTitle>JWT Token</CardTitle>
            <CardDescription>输入要解析的 JWT Token</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={jwtInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              className="w-full h-32 px-3 py-2 border rounded-md font-mono text-sm"
            />

            {error && (
              <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 示例 Token */}
        <Card>
          <CardHeader>
            <CardTitle>示例 Token</CardTitle>
            <CardDescription>点击使用示例 Token 进行测试</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exampleJWTs.map((example) => (
                <button
                  key={example.name}
                  onClick={() => handleInputChange(example.token)}
                  className="w-full p-3 text-left bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <div className="font-medium">{example.name}</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {example.token}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {isValidJWT && (
          <>
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardDescription>JWT 的头部信息</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {formatJSON(header)}
                </pre>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader>
                <CardTitle>Payload</CardTitle>
                <CardDescription>JWT 的载荷数据</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  {formatJSON(payload)}
                </pre>

                {/* 常见字段说明 */}
                <div className="mt-4 space-y-2 text-sm">
                  <h4 className="font-medium">常见字段说明：</h4>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li><code className="bg-muted px-1 rounded">iss</code> - 签发者</li>
                    <li><code className="bg-muted px-1 rounded">sub</code> - 主题（用户ID）</li>
                    <li><code className="bg-muted px-1 rounded">aud</code> - 接收方</li>
                    <li><code className="bg-muted px-1 rounded">exp</code> - 过期时间</li>
                    <li><code className="bg-muted px-1 rounded">nbf</code> - 生效时间</li>
                    <li><code className="bg-muted px-1 rounded">iat</code> - 签发时间</li>
                    <li><code className="bg-muted px-1 rounded">jti</code> - JWT ID</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <CardTitle>Signature</CardTitle>
                <CardDescription>JWT 的签名部分</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <div className="font-mono text-sm break-all">
                    {signature}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  注意：签名用于验证 JWT 的完整性，需要使用密钥才能验证。本工具仅解码 JWT，不验证签名有效性。
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* 安全提示 */}
        <Card>
          <CardHeader>
            <CardTitle>⚠️ 安全提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 请不要在生产环境中使用本工具处理敏感的 JWT</li>
              <li>• JWT 中可能包含敏感信息，请谨慎处理</li>
              <li>• 本工具仅在客户端运行，不会将你的 JWT 发送到任何服务器</li>
              <li>• 对于验证 JWT 签名，请使用后端服务或专门的 JWT 验证工具</li>
            </ul>
          </CardContent>
        </Card>
      </div>
        </div>
      </main>
    </div>
  )
}