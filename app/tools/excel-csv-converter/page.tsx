"use client"

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

export default function ExcelCSVConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [conversionType, setConversionType] = useState<'excel-to-csv' | 'csv-to-excel'>('excel-to-csv')
  const [csvData, setCsvData] = useState('')
  const [preview, setPreview] = useState<string[][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.name.toLowerCase()
      const isValidFile = conversionType === 'excel-to-csv'
        ? (fileType.endsWith('.xlsx') || fileType.endsWith('.xls'))
        : fileType.endsWith('.csv')

      if (!isValidFile) {
        setError(conversionType === 'excel-to-csv'
          ? '请选择 Excel 文件 (.xlsx 或 .xls)'
          : '请选择 CSV 文件')
        return
      }

      setFile(selectedFile)
      setError('')
      processFile(selectedFile)
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    try {
      const data = await file.arrayBuffer()

      if (conversionType === 'excel-to-csv') {
        // Excel 转 CSV
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const csv = XLSX.utils.sheet_to_csv(worksheet)
        setCsvData(csv)

        // 预览前10行
        const lines = csv.split('\n').slice(0, 10)
        const previewData = lines.map(line =>
          line.split(',').map(cell => cell.replace(/^"|"$/g, ''))
        )
        setPreview(previewData)
      } else {
        // CSV 转 Excel
        const csv = await file.text()
        setCsvData(csv)

        // 预览前10行
        const lines = csv.split('\n').slice(0, 10)
        const previewData = lines.map(line =>
          line.split(',').map(cell => cell.replace(/^"|"$/g, ''))
        )
        setPreview(previewData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件处理失败')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadConvertedFile = () => {
    if (!file) return

    if (conversionType === 'excel-to-csv') {
      // 下载 CSV
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name.replace(/\.(xlsx|xls)$/, '.csv')
      link.click()
      URL.revokeObjectURL(url)
    } else {
      // 下载 Excel
      const workbook = XLSX.read(csvData, { type: 'string' })
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name.replace('.csv', '.xlsx')
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const clearAll = () => {
    setFile(null)
    setCsvData('')
    setPreview([])
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const loadSampleData = () => {
    const sampleCSV = `姓名,年龄,城市,职业
张三,28,北京,工程师
李四,32,上海,设计师
王五,25,广州,产品经理
赵六,30,深圳,数据分析师
钱七,27,杭州,市场营销`

    setCsvData(sampleCSV)
    const lines = sampleCSV.split('\n')
    const previewData = lines.map(line => line.split(','))
    setPreview(previewData)
    setConversionType('csv-to-excel')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Excel/CSV 转换器
          </h1>

          {/* 转换类型选择 */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => {
                  setConversionType('excel-to-csv')
                  clearAll()
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  conversionType === 'excel-to-csv'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Excel → CSV
              </button>
              <button
                onClick={() => {
                  setConversionType('csv-to-excel')
                  clearAll()
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  conversionType === 'csv-to-excel'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                CSV → Excel
              </button>
            </div>
          </div>

          {/* 文件上传区域 */}
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept={conversionType === 'excel-to-csv' ? '.xlsx,.xls' : '.csv'}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  点击或拖拽文件到此处上传
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {conversionType === 'excel-to-csv'
                    ? '支持格式: .xlsx, .xls'
                    : '支持格式: .csv'}
                </p>
              </label>
            </div>
          </div>

          {/* 加载示例按钮 */}
          {conversionType === 'csv-to-excel' && (
            <div className="mb-6 text-center">
              <button
                onClick={loadSampleData}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                加载示例数据
              </button>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* 文件信息 */}
          {file && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                已选择文件: <span className="font-semibold">{file.name}</span>
                <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
              </p>
            </div>
          )}

          {/* 预览区域 */}
          {preview.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                数据预览（前 10 行）
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {preview[0]?.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {preview.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          {csvData && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadConvertedFile}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                下载 {conversionType === 'excel-to-csv' ? 'CSV' : 'Excel'} 文件
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                清空
              </button>
            </div>
          )}

          {/* 加载状态 */}
          {isProcessing && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">正在处理文件...</p>
            </div>
          )}

          {/* 功能说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              功能说明
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Excel → CSV</h4>
                <ul className="space-y-1">
                  <li>• 支持 .xlsx 和 .xls 格式</li>
                  <li>• 读取第一个工作表</li>
                  <li>• 自动处理特殊字符</li>
                  <li>• 保留原始数据格式</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV → Excel</h4>
                <ul className="space-y-1">
                  <li>• 生成 .xlsx 格式文件</li>
                  <li>• 自动识别逗号分隔</li>
                  <li>• 支持引号包围的字段</li>
                  <li>• 保留换行符和特殊字符</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}