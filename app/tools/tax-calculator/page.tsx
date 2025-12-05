"use client"

import { useState } from 'react'
import UnifiedHeader from '../../components/UnifiedHeader'

interface TaxBracket {
  min: number
  max: number | undefined
  rate: number
  quickDeduction: number
}

interface TaxResult {
  totalTax: number
  afterTaxIncome: number
  effectiveRate: number
  breakdown: TaxBreakdown[]
}

interface TaxBreakdown {
  range: string
  taxableAmount: number
  rate: number
  tax: number
}

export default function TaxCalculator() {
  const [income, setIncome] = useState<string>('20000')
  const [socialInsurance, setSocialInsurance] = useState<string>('3000')
  const [specialDeductions, setSpecialDeductions] = useState<string>('2000')
  const [otherDeductions, setOtherDeductions] = useState<string>('0')
  const [taxType, setTaxType] = useState<'income' | 'vat'>('income')
  const [vatAmount, setVatAmount] = useState<string>('10000')
  const [vatType, setVatType] = useState<'general' | 'small'>('general')
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null)

  // 个税税率表（2024年标准）
  const personalTaxBrackets: TaxBracket[] = [
    { min: 0, max: 36000, rate: 0.03, quickDeduction: 0 },
    { min: 36000, max: 144000, rate: 0.10, quickDeduction: 2520 },
    { min: 144000, max: 300000, rate: 0.20, quickDeduction: 16920 },
    { min: 300000, max: 420000, rate: 0.25, quickDeduction: 31920 },
    { min: 420000, max: 660000, rate: 0.30, quickDeduction: 52920 },
    { min: 660000, max: 960000, rate: 0.35, quickDeduction: 85920 },
    { min: 960000, max: undefined, rate: 0.45, quickDeduction: 181920 }
  ]

  // 增值税税率
  const vatRates: Record<string, number> = {
    'general': 0.13,  // 一般纳税人 13%
    'small': 0.01,    // 小规模纳税人 1%（2024年优惠税率）
    'transport': 0.09,
    'construction': 0.09,
    'services': 0.06,
    'financial': 0.06
  }

  const calculateIncomeTax = () => {
    const monthlyIncome = parseFloat(income) || 0
    const monthlySocial = parseFloat(socialInsurance) || 0
    const monthlySpecial = parseFloat(specialDeductions) || 0
    const monthlyOther = parseFloat(otherDeductions) || 0

    if (monthlyIncome <= 0) {
      return
    }

    // 计算应纳税所得额
    const taxableIncome = monthlyIncome - 5000 - monthlySocial - monthlySpecial - monthlyOther

    if (taxableIncome <= 0) {
      setTaxResult({
        totalTax: 0,
        afterTaxIncome: monthlyIncome,
        effectiveRate: 0,
        breakdown: []
      })
      return
    }

    // 年应纳税所得额
    const annualTaxableIncome = taxableIncome * 12
    const breakdown: TaxBreakdown[] = []
    let totalAnnualTax = 0

    // 计算各档税率
    let remainingIncome = annualTaxableIncome
    for (const bracket of personalTaxBrackets) {
      if (remainingIncome <= 0) break

      const rangeMax = bracket.max || Infinity
      const taxableInBracket = Math.min(remainingIncome, rangeMax - bracket.min)

      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate
        totalAnnualTax += taxInBracket

        breakdown.push({
          range: `${(bracket.min / 10000).toFixed(0)}万-${bracket.max ? (bracket.max / 10000).toFixed(0) + '万' : '以上'}`,
          taxableAmount: taxableInBracket,
          rate: bracket.rate * 100,
          tax: taxInBracket
        })
      }

      remainingIncome -= taxableInBracket
    }

    // 使用速算扣除数验证
    const annualTaxQuick = annualTaxableIncome * 0.25 - 31920 // 假设是25%档位
    const monthlyTax = totalAnnualTax / 12

    setTaxResult({
      totalTax: monthlyTax,
      afterTaxIncome: monthlyIncome - monthlySocial - monthlyTax,
      effectiveRate: (monthlyTax / taxableIncome) * 100,
      breakdown
    })
  }

  const calculateVAT = () => {
    const amount = parseFloat(vatAmount) || 0
    if (amount <= 0) return

    const rate = vatType === 'general' ? vatRates.general : vatRates.small
    const vat = amount * rate

    setTaxResult({
      totalTax: vat,
      afterTaxIncome: amount,
      effectiveRate: rate * 100,
      breakdown: []
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const clearAll = () => {
    setIncome('20000')
    setSocialInsurance('3000')
    setSpecialDeductions('2000')
    setOtherDeductions('0')
    setVatAmount('10000')
    setTaxResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            税率计算器
          </h1>

          {/* 税种选择 */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => {
                  setTaxType('income')
                  setTaxResult(null)
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  taxType === 'income'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                个人所得税
              </button>
              <button
                onClick={() => {
                  setTaxType('vat')
                  setTaxResult(null)
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  taxType === 'vat'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                增值税
              </button>
            </div>
          </div>

          {taxType === 'income' ? (
            <>
              {/* 个人所得税计算 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    税前月收入（元）
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="20000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    社保公积金（元）
                  </label>
                  <input
                    type="number"
                    value={socialInsurance}
                    onChange={(e) => setSocialInsurance(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    专项附加扣除（元）
                  </label>
                  <input
                    type="number"
                    value={specialDeductions}
                    onChange={(e) => setSpecialDeductions(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="2000"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    包括子女教育、房贷利息、租房等
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    其他扣除（元）
                  </label>
                  <input
                    type="number"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                onClick={calculateIncomeTax}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                计算个人所得税
              </button>
            </>
          ) : (
            <>
              {/* 增值税计算 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    含税金额（元）
                  </label>
                  <input
                    type="number"
                    value={vatAmount}
                    onChange={(e) => setVatAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    纳税人类型
                  </label>
                  <select
                    value={vatType}
                    onChange={(e) => setVatType(e.target.value as 'general' | 'small')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">一般纳税人 (13%)</option>
                    <option value="small">小规模纳税人 (1%)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateVAT}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                计算增值税
              </button>
            </>
          )}

          {/* 计算结果 */}
          {taxResult && (
            <div className="mt-6">
              {taxType === 'income' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">应缴个税</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(taxResult.totalTax)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        有效税率 {taxResult.effectiveRate.toFixed(2)}%
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">税后收入</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(taxResult.afterTaxIncome)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        扣除社保后
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">全年个税</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(taxResult.totalTax * 12)}
                      </p>
                    </div>
                  </div>

                  {/* 税率明细 */}
                  {taxResult.breakdown.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              年应纳税所得额
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              税率
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              应纳税额
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {taxResult.breakdown.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.range}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {item.rate.toFixed(0)}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatCurrency(item.tax / 12)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">增值税额</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(taxResult.totalTax)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      税率 {taxResult.effectiveRate.toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">不含税金额</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(vatType === 'general'
                        ? parseFloat(vatAmount) / (1 + 0.13)
                        : parseFloat(vatAmount) / (1 + 0.01)
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={clearAll}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              重置
            </button>
          </div>

          {/* 税率说明 */}
          {taxType === 'income' ? (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                个税税率表（2024年）
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-2 text-gray-700 dark:text-gray-300">级数</th>
                      <th className="text-left py-2 text-gray-700 dark:text-gray-300">全年应纳税所得额</th>
                      <th className="text-left py-2 text-gray-700 dark:text-gray-300">税率</th>
                      <th className="text-left py-2 text-gray-700 dark:text-gray-300">速算扣除数</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 dark:text-gray-400">
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">1</td>
                      <td className="py-2">不超过36,000元</td>
                      <td className="py-2">3%</td>
                      <td className="py-2">0</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">2</td>
                      <td className="py-2">36,000-144,000元</td>
                      <td className="py-2">10%</td>
                      <td className="py-2">2,520</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">3</td>
                      <td className="py-2">144,000-300,000元</td>
                      <td className="py-2">20%</td>
                      <td className="py-2">16,920</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">4</td>
                      <td className="py-2">300,000-420,000元</td>
                      <td className="py-2">25%</td>
                      <td className="py-2">31,920</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">5</td>
                      <td className="py-2">420,000-660,000元</td>
                      <td className="py-2">30%</td>
                      <td className="py-2">52,920</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-2">6</td>
                      <td className="py-2">660,000-960,000元</td>
                      <td className="py-2">35%</td>
                      <td className="py-2">85,920</td>
                    </tr>
                    <tr>
                      <td className="py-2">7</td>
                      <td className="py-2">超过960,000元</td>
                      <td className="py-2">45%</td>
                      <td className="py-2">181,920</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                增值税税率说明
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• <strong>一般纳税人：</strong>适用13%基本税率（部分货物9%，服务6%）</li>
                <li>• <strong>小规模纳税人：</strong>2024年暂按1%征收率（原3%）</li>
                <li>• 计算公式：增值税 = 含税金额 ÷ (1 + 税率) × 税率</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}