"use client"

import { useState } from 'react'
import UnifiedHeader from '../../components/UnifiedHeader'

interface LoanDetails {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  paymentSchedule: PaymentItem[]
}

interface PaymentItem {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('1000000')
  const [interestRate, setInterestRate] = useState<string>('4.5')
  const [loanTerm, setLoanTerm] = useState<string>('30')
  const [loanType, setLoanType] = useState<'mortgage' | 'car' | 'personal'>('mortgage')
  const [paymentType, setPaymentType] = useState<'equal-principal' | 'equal-payment'>('equal-payment')
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0
    const annualRate = parseFloat(interestRate) || 0
    const years = parseFloat(loanTerm) || 0

    if (principal <= 0 || annualRate <= 0 || years <= 0) {
      return
    }

    const monthlyRate = annualRate / 100 / 12
    const totalMonths = years * 12
    const paymentSchedule: PaymentItem[] = []

    let monthlyPayment: number
    let totalPayment: number
    let totalInterest: number

    if (paymentType === 'equal-payment') {
      // 等额本息
      monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1)
      totalPayment = monthlyPayment * totalMonths
      totalInterest = totalPayment - principal

      let balance = principal
      for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = balance * monthlyRate
        const principalPayment = monthlyPayment - interestPayment
        balance -= principalPayment

        if (i === 1 || i === totalMonths || i % 12 === 0 || i <= 12) {
          paymentSchedule.push({
            period: i,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, balance)
          })
        }
      }
    } else {
      // 等额本金
      const monthlyPrincipal = principal / totalMonths
      let balance = principal
      let totalPaymentTemp = 0

      for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = balance * monthlyRate
        const payment = monthlyPrincipal + interestPayment
        balance -= monthlyPrincipal
        totalPaymentTemp += payment

        if (i === 1 || i === totalMonths || i % 12 === 0 || i <= 12) {
          paymentSchedule.push({
            period: i,
            payment: payment,
            principal: monthlyPrincipal,
            interest: interestPayment,
            balance: Math.max(0, balance)
          })
        }
      }

      monthlyPayment = paymentSchedule[0]?.payment || 0
      totalPayment = totalPaymentTemp
      totalInterest = totalPayment - principal
    }

    setLoanDetails({
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentSchedule
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
    setLoanAmount('1000000')
    setInterestRate('4.5')
    setLoanTerm('30')
    setLoanDetails(null)
    setShowSchedule(false)
  }

  const loadPreset = (type: 'mortgage' | 'car' | 'personal') => {
    setLoanType(type)
    switch (type) {
      case 'mortgage':
        setLoanAmount('3000000')
        setInterestRate('4.2')
        setLoanTerm('30')
        break
      case 'car':
        setLoanAmount('200000')
        setInterestRate('5.5')
        setLoanTerm('3')
        break
      case 'personal':
        setLoanAmount('50000')
        setInterestRate('7.2')
        setLoanTerm('2')
        break
    }
    setLoanDetails(null)
    setShowSchedule(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            贷款计算器
          </h1>

          {/* 贷款类型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              贷款类型
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => loadPreset('mortgage')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  loanType === 'mortgage'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">房贷</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">30年期，低利率</p>
              </button>
              <button
                onClick={() => loadPreset('car')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  loanType === 'car'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">车贷</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">1-5年期，中等利率</p>
              </button>
              <button
                onClick={() => loadPreset('personal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  loanType === 'personal'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">个人贷款</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">短期，较高利率</p>
              </button>
            </div>
          </div>

          {/* 输入参数 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                贷款金额（元）
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="1000000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                年利率（%）
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="4.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                贷款期限（年）
              </label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          </div>

          {/* 还款方式 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              还款方式
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setPaymentType('equal-payment')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  paymentType === 'equal-payment'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                等额本息
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">每月还款额固定</p>
              </button>
              <button
                onClick={() => setPaymentType('equal-principal')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                  paymentType === 'equal-principal'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                等额本金
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">每月本金固定</p>
              </button>
            </div>
          </div>

          {/* 计算按钮 */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={calculateLoan}
              className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              计算贷款
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              重置
            </button>
          </div>

          {/* 计算结果 */}
          {loanDetails && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">月供金额</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(loanDetails.monthlyPayment)}
                  </p>
                  {paymentType === 'equal-principal' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      首月：{formatCurrency(loanDetails.paymentSchedule[0]?.payment || 0)}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">还款总额</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(loanDetails.totalPayment)}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">支付利息</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(loanDetails.totalInterest)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    占本金 {((loanDetails.totalInterest / parseFloat(loanAmount)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* 查看还款计划按钮 */}
              <div className="text-center mb-4">
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {showSchedule ? '隐藏' : '查看'}还款计划表
                </button>
              </div>

              {/* 还款计划表 */}
              {showSchedule && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          期数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          月供
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          本金
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          利息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
          剩余本金
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loanDetails.paymentSchedule.map((item) => (
                        <tr key={item.period}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {item.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.payment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.principal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.interest)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              功能说明
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">等额本息</h4>
                <ul className="space-y-1">
                  <li>• 每月还款金额固定</li>
                  <li>• 前期还息多，后期还本多</li>
                  <li>• 适合收入稳定的借款人</li>
                  <li>• 总利息支出较多</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">等额本金</h4>
                <ul className="space-y-1">
                  <li>• 每月偿还本金固定</li>
                  <li>• 月供逐月递减</li>
                  <li>• 适合收入较高的借款人</li>
                  <li>• 总利息支出较少</li>
                </ul>
              </div>
            </div>
          </div>
      </div>
      </main>
    </div>
  )
}