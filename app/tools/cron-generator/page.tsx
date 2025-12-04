'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CronGenerator() {
  const [cronExpression, setCronExpression] = useState('* * * * *')
  const [nextRuns, setNextRuns] = useState<string[]>([])

  const cronParts = {
    minute: cronExpression.split(' ')[0] || '*',
    hour: cronExpression.split(' ')[1] || '*',
    day: cronExpression.split(' ')[2] || '*',
    month: cronExpression.split(' ')[3] || '*',
    weekday: cronExpression.split(' ')[4] || '*'
  }

  const updateCron = (part: keyof typeof cronParts, value: string) => {
    const parts = cronExpression.split(' ')
    const partIndex = {
      minute: 0,
      hour: 1,
      day: 2,
      month: 3,
      weekday: 4
    }[part]

    parts[partIndex] = value
    setCronExpression(parts.join(' '))
  }

  const calculateNextRuns = () => {
    // 这里简化计算，实际应该使用专门的 cron 解析库
    const now = new Date()
    const runs = []

    for (let i = 0; i < 5; i++) {
      const nextRun = new Date(now.getTime() + (i + 1) * 60000)
      runs.push(nextRun.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }

    setNextRuns(runs)
  }

  const presetCrons = [
    { name: '每分钟', expression: '* * * * *' },
    { name: '每小时', expression: '0 * * * *' },
    { name: '每天午夜', expression: '0 0 * * *' },
    { name: '每天中午', expression: '0 12 * * *' },
    { name: '每周一', expression: '0 0 * * 1' },
    { name: '每月1号', expression: '0 0 1 * *' },
    { name: '工作日9点', expression: '0 9 * * 1-5' },
    { name: '每30分钟', expression: '*/30 * * * *' }
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cron 表达式生成器</h1>
        <p className="text-muted-foreground">
          可视化生成和测试 Cron 表达式
        </p>
      </div>

      <div className="space-y-6">
        {/* 当前表达式 */}
        <Card>
          <CardHeader>
            <CardTitle>当前 Cron 表达式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-center p-4 bg-muted rounded-lg">
              {cronExpression}
            </div>
          </CardContent>
        </Card>

        {/* 表达式构建器 */}
        <Card>
          <CardHeader>
            <CardTitle>表达式构建器</CardTitle>
            <CardDescription>设置每个时间单位的值</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">分钟 (0-59)</label>
              <input
                type="text"
                value={cronParts.minute}
                onChange={(e) => updateCron('minute', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="* 或 0-59"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">小时 (0-23)</label>
              <input
                type="text"
                value={cronParts.hour}
                onChange={(e) => updateCron('hour', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="* 或 0-23"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">日期 (1-31)</label>
              <input
                type="text"
                value={cronParts.day}
                onChange={(e) => updateCron('day', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="* 或 1-31"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">月份 (1-12)</label>
              <input
                type="text"
                value={cronParts.month}
                onChange={(e) => updateCron('month', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="* 或 1-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">星期 (0-7, 0和7都表示周日)</label>
              <input
                type="text"
                value={cronParts.weekday}
                onChange={(e) => updateCron('weekday', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="* 或 0-7"
              />
            </div>
          </CardContent>
        </Card>

        {/* 预设表达式 */}
        <Card>
          <CardHeader>
            <CardTitle>常用预设</CardTitle>
            <CardDescription>快速选择常用的 Cron 表达式</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetCrons.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setCronExpression(preset.expression)}
                  className="p-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {preset.expression}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 下次运行时间 */}
        <Card>
          <CardHeader>
            <CardTitle>下次运行时间</CardTitle>
            <CardDescription>基于当前表达式计算的下5次执行时间</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={calculateNextRuns}
              className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              计算运行时间
            </button>

            {nextRuns.length > 0 && (
              <ul className="space-y-2">
                {nextRuns.map((run, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-muted-foreground">第{index + 1}次:</span>
                    <span className="font-mono">{run}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">基本符号：</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li><code className="bg-muted px-1 rounded">*</code> - 任意值</li>
                  <li><code className="bg-muted px-1 rounded">,</code> - 多个值 (如: 1,3,5)</li>
                  <li><code className="bg-muted px-1 rounded">-</code> - 范围 (如: 1-5)</li>
                  <li><code className="bg-muted px-1 rounded">/</code> - 步长 (如: */5 表示每5个单位)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">表达式格式：</h4>
                <div className="font-mono bg-muted p-3 rounded text-center">
                  分钟 小时 日期 月份 星期
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">示例：</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li><code className="bg-muted px-1 rounded">0 9 * * 1-5</code> - 工作日上午9点</li>
                  <li><code className="bg-muted px-1 rounded">*/15 * * * *</code> - 每15分钟</li>
                  <li><code className="bg-muted px-1 rounded">0 0 1 * *</code> - 每月1号午夜</li>
                  <li><code className="bg-muted px-1 rounded">0 6 1 * 1</code> - 每周一和每月1号早上6点</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}