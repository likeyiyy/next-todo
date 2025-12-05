"use client"

import { useState } from 'react'

interface BMIResult {
  bmi: number
  category: string
  color: string
  idealWeight: {
    min: number
    max: number
  }
  healthRisk: string[]
}

export default function BMICalculator() {
  const [height, setHeight] = useState<string>('170')
  const [weight, setWeight] = useState<string>('65')
  const [age, setAge] = useState<string>('25')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null)

  const calculateBMI = () => {
    let h = parseFloat(height) || 0
    let w = parseFloat(weight) || 0

    if (unit === 'imperial') {
      // Convert imperial to metric
      h = h * 2.54 // inches to cm
      w = w * 0.453592 // lbs to kg
    }

    if (h <= 0 || w <= 0) return

    const heightInMeters = h / 100
    const bmi = w / (heightInMeters * heightInMeters)
    const roundedBMI = Math.round(bmi * 10) / 10

    let category = ''
    let color = ''
    let healthRisk: string[] = []

    if (roundedBMI < 18.5) {
      category = '偏瘦'
      color = 'text-blue-600'
      healthRisk = ['营养不良', '免疫力下降', '骨质疏松风险']
    } else if (roundedBMI < 24) {
      category = '正常'
      color = 'text-green-600'
      healthRisk = ['健康范围', '患病风险较低']
    } else if (roundedBMI < 28) {
      category = '偏胖'
      color = 'text-yellow-600'
      healthRisk = ['心血管病风险增加', '糖尿病风险增加', '高血压风险']
    } else {
      category = '肥胖'
      color = 'text-red-600'
      healthRisk = ['心脏病风险高', '糖尿病风险高', '高血压风险高', '关节负担加重']
    }

    // 计算理想体重（使用BMI范围18.5-24）
    const idealWeightMin = 18.5 * heightInMeters * heightInMeters
    const idealWeightMax = 24 * heightInMeters * heightInMeters

    setBmiResult({
      bmi: roundedBMI,
      category,
      color,
      idealWeight: {
        min: Math.round(idealWeightMin * 10) / 10,
        max: Math.round(idealWeightMax * 10) / 10
      },
      healthRisk
    })
  }

  const clearAll = () => {
    setHeight('170')
    setWeight('65')
    setAge('25')
    setGender('male')
    setUnit('metric')
    setBmiResult(null)
  }

  const getBMIValue = (category: string) => {
    const categories: Record<string, number> = {
      '偏瘦': 17,
      '正常': 22,
      '偏胖': 26,
      '肥胖': 30
    }
    return categories[category] || 20
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            BMI 计算器
          </h1>

          {/* 单位选择 */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => {
                  setUnit('metric')
                  if (unit === 'imperial') {
                    setHeight('170')
                    setWeight('65')
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  unit === 'metric'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                公制 (cm/kg)
              </button>
              <button
                onClick={() => {
                  setUnit('imperial')
                  if (unit === 'metric') {
                    setHeight('67')
                    setWeight('143')
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  unit === 'imperial'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                英制 (inch/lb)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 输入区域 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                输入信息
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    身高 ({unit === 'metric' ? '厘米' : '英寸'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder={unit === 'metric' ? '170' : '67'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    体重 ({unit === 'metric' ? '公斤' : '磅'})
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder={unit === 'metric' ? '65' : '143'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    年龄
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    性别
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        gender === 'male'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      男性
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                        gender === 'female'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      女性
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={calculateBMI}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    计算 BMI
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>

            {/* 结果显示区域 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                计算结果
              </h2>

              {bmiResult ? (
                <div className="space-y-6">
                  {/* BMI 值显示 */}
                  <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <p className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {bmiResult.bmi}
                    </p>
                    <p className={`text-2xl font-semibold ${bmiResult.color}`}>
                      {bmiResult.category}
                    </p>
                  </div>

                  {/* BMI 范围指示器 */}
                  <div className="relative">
                    <div className="h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full">
                      <div
                        className="absolute top-0 w-4 h-8 bg-gray-800 rounded-full transform -translate-x-1/2 shadow-lg"
                        style={{
                          left: `${Math.min(100, Math.max(0, ((bmiResult.bmi - 15) / 20) * 100))}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                      <span>15</span>
                      <span>20</span>
                      <span>25</span>
                      <span>30</span>
                      <span>35</span>
                    </div>
                  </div>

                  {/* 理想体重 */}
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">理想体重范围</p>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                      {unit === 'metric' ?
                        `${bmiResult.idealWeight.min} - ${bmiResult.idealWeight.max} kg` :
                        `${Math.round(bmiResult.idealWeight.min * 2.20462)} - ${Math.round(bmiResult.idealWeight.max * 2.20462)} lbs`
                      }
                    </p>
                  </div>

                  {/* 健康风险提示 */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">健康提示</p>
                    <ul className="space-y-1">
                      {bmiResult.healthRisk.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                          • {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-500 text-center">
                    输入您的身体数据，点击"计算 BMI"查看结果
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BMI 分类说明 */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              BMI 分类标准（中国标准）
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{'<'}</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">偏瘦</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{'< 18.5'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">正常</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">18.5 - 23.9</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">!</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">偏胖</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">24.0 - 27.9</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 font-semibold">⚠</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">肥胖</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">≥ 28.0</p>
              </div>
            </div>
          </div>

          {/* 健康建议 */}
          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              健康建议
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">体重管理</h4>
                <ul className="space-y-1">
                  <li>• 保持规律饮食，避免暴饮暴食</li>
                  <li>• 增加蔬菜水果摄入量</li>
                  <li>• 控制高热量食物</li>
                  <li>• 保持充足水分摄入</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">运动建议</h4>
                <ul className="space-y-1">
                  <li>• 每周至少150分钟中等强度运动</li>
                  <li>• 结合有氧和力量训练</li>
                  <li>• 保持日常活动量</li>
                  <li>• 定期体检，关注健康指标</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              注意：BMI仅供参考，不适用于儿童、孕妇、运动员等特殊人群。如有健康问题，请咨询专业医生。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}