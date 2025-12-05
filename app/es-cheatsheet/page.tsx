"use client"

import { useState } from 'react'
import UnifiedHeader from '../components/UnifiedHeader'

interface CheatItem {
  title: string
  description: string
  code: string
  category: string
}

const esCheatData: CheatItem[] = [
  // Array Methods
  {
    title: 'Array.map()',
    description: '创建一个新数组，包含对每个元素调用函数的结果',
    code: `const numbers = [1, 2, 3, 4]
const doubled = numbers.map(num => num * 2)
// 结果: [2, 4, 6, 8]`,
    category: 'Array Methods'
  },
  {
    title: 'Array.filter()',
    description: '创建包含所有通过测试元素的新数组',
    code: `const numbers = [1, 2, 3, 4, 5]
const evens = numbers.filter(num => num % 2 === 0)
// 结果: [2, 4]`,
    category: 'Array Methods'
  },
  {
    title: 'Array.reduce()',
    description: '将数组缩减为单个值',
    code: `const numbers = [1, 2, 3, 4]
const sum = numbers.reduce((acc, num) => acc + num, 0)
// 结果: 10`,
    category: 'Array Methods'
  },
  {
    title: 'Array.findIndex()',
    description: '返回第一个满足条件的元素的索引',
    code: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]
const index = users.findIndex(user => user.id === 2)
// 结果: 1`,
    category: 'Array Methods'
  },
  {
    title: 'Array.includes()',
    description: '检查数组是否包含特定值',
    code: `const fruits = ['apple', 'banana', 'orange']
const hasApple = fruits.includes('apple')
// 结果: true`,
    category: 'Array Methods'
  },
  {
    title: 'Array.flat()',
    description: '将嵌套数组扁平化',
    code: `const nested = [1, [2, [3, 4]], 5]
const flattened = nested.flat(2)
// 结果: [1, 2, 3, 4, 5]`,
    category: 'Array Methods'
  },
  {
    title: 'Array.flatMap()',
    description: '映射后扁平化',
    code: `const sentences = ['Hello world', 'How are you']
const words = sentences.flatMap(sentence => sentence.split(' '))
// 结果: ['Hello', 'world', 'How', 'are', 'you']`,
    category: 'Array Methods'
  },

  // Object Methods
  {
    title: 'Object.keys()',
    description: '返回对象所有键的数组',
    code: `const user = { name: 'John', age: 30, city: 'NY' }
const keys = Object.keys(user)
// 结果: ['name', 'age', 'city']`,
    category: 'Object Methods'
  },
  {
    title: 'Object.values()',
    description: '返回对象所有值的数组',
    code: `const user = { name: 'John', age: 30, city: 'NY' }
const values = Object.values(user)
// 结果: ['John', 30, 'NY']`,
    category: 'Object Methods'
  },
  {
    title: 'Object.entries()',
    description: '返回对象键值对的数组',
    code: `const user = { name: 'John', age: 30 }
const entries = Object.entries(user)
// 结果: [['name', 'John'], ['age', 30]]`,
    category: 'Object Methods'
  },
  {
    title: 'Object.fromEntries()',
    description: '将键值对数组转换为对象',
    code: `const entries = [['name', 'John'], ['age', 30]]
const obj = Object.fromEntries(entries)
// 结果: { name: 'John', age: 30 }`,
    category: 'Object Methods'
  },
  {
    title: 'Object.assign()',
    description: '复制所有可枚举属性到目标对象',
    code: `const target = { a: 1 }
const source = { b: 2, c: 3 }
Object.assign(target, source)
// 结果: { a: 1, b: 2, c: 3 }`,
    category: 'Object Methods'
  },
  {
    title: '可选链操作符 (?.)',
    description: '安全访问嵌套对象属性',
    code: `const user = { profile: { name: 'John' } }
const city = user?.profile?.address?.city
// 结果: undefined (不会报错)`,
    category: 'Object Methods'
  },
  {
    title: '空值合并操作符 (??)',
    description: '当左侧为 null 或 undefined 时返回右侧',
    code: `const name = null ?? 'Default Name'
// 结果: 'Default Name'

const count = 0 ?? 10
// 结果: 0 (0 不是 null 或 undefined)`,
    category: 'Object Methods'
  },

  // String Methods
  {
    title: 'String.includes()',
    description: '检查字符串是否包含指定值',
    code: `const str = 'Hello world'
const hasWorld = str.includes('world')
// 结果: true`,
    category: 'String Methods'
  },
  {
    title: 'String.startsWith()',
    description: '检查字符串是否以指定值开头',
    code: `const str = 'Hello world'
const startsWithHello = str.startsWith('Hello')
// 结果: true`,
    category: 'String Methods'
  },
  {
    title: 'String.endsWith()',
    description: '检查字符串是否以指定值结尾',
    code: `const str = 'Hello world'
const endsWithWorld = str.endsWith('world')
// 结果: true`,
    category: 'String Methods'
  },
  {
    title: 'String.padStart()',
    description: '在开头填充字符串',
    code: `const str = '5'
const padded = str.padStart(3, '0')
// 结果: '005'`,
    category: 'String Methods'
  },
  {
    title: 'String.trim()',
    description: '移除字符串两端的空白字符',
    code: `const str = '  Hello world  '
const trimmed = str.trim()
// 结果: 'Hello world'`,
    category: 'String Methods'
  },
  {
    title: '模板字符串',
    description: '使用反引号创建字符串，支持变量插值',
    code: `const name = 'John'
const age = 30
const message = \`My name is \${name} and I'm \${age}\`
// 结果: "My name is John and I'm 30"`,
    category: 'String Methods'
  },

  // Function Features
  {
    title: '箭头函数',
    description: '更简洁的函数语法',
    code: `// 传统函数
function add(a, b) {
  return a + b
}

// 箭头函数
const add = (a, b) => a + b

// 单参数可省略括号
const double = x => x * 2`,
    category: 'Function Features'
  },
  {
    title: '默认参数',
    description: '为函数参数设置默认值',
    code: `function greet(name = 'Guest') {
  return \`Hello, \${name}!\`
}

greet() // "Hello, Guest!"
greet('John') // "Hello, John!"`,
    category: 'Function Features'
  },
  {
    title: '解构赋值',
    description: '从数组或对象中提取值',
    code: `// 数组解构
const [a, b, c] = [1, 2, 3]

// 对象解构
const {name, age} = {name: 'John', age: 30}

// 函数参数解构
function printUser({name, age}) {
  console.log(\`\${name} is \${age}\`)
}`,
    category: 'Function Features'
  },
  {
    title: '展开运算符 (...)',
    description: '展开数组或对象',
    code: `// 数组展开
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5] // [1, 2, 3, 4, 5]

// 对象展开
const obj1 = {a: 1, b: 2}
const obj2 = {...obj1, c: 3} // {a: 1, b: 2, c: 3}`,
    category: 'Function Features'
  },
  {
    title: '剩余参数',
    description: '将多个参数收集为数组',
    code: `function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3, 4) // 10`,
    category: 'Function Features'
  },

  // Async/Await
  {
    title: 'async/await 基础',
    description: '使用同步方式编写异步代码',
    code: `async function fetchData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}`,
    category: 'Async/Await'
  },
  {
    title: 'Promise.all()',
    description: '并行执行多个 Promise',
    code: `async function fetchMultiple() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ])
  return { users, posts, comments }
}`,
    category: 'Async/Await'
  },
  {
    title: 'Promise.race()',
    description: '返回最先完成的 Promise',
    code: `const result = await Promise.race([
  fetch('/api/fast'),
  fetch('/api/slow')
])
// 返回最先完成的请求`,
    category: 'Async/Await'
  },

  // ES6+ Features
  {
    title: 'let 和 const',
    description: '块级作用域变量声明',
    code: `// const - 不可重新赋值
const PI = 3.14159
// PI = 3 // 错误!

// let - 可重新赋值
let count = 0
count = 1 // 正确`,
    category: 'ES6+ Features'
  },
  {
    title: '解构赋值 - 默认值',
    description: '解构时设置默认值',
    code: `const {name = 'Guest', age = 0} = {}
// name: 'Guest', age: 0

const [first, second = 'default'] = ['only one']
// first: 'only one', second: 'default'`,
    category: 'ES6+ Features'
  },
  {
    title: 'Set 数据结构',
    description: '唯一值的集合',
    code: `const set = new Set([1, 2, 3, 3, 4])
set.add(5)
set.has(2) // true
set.delete(1)
set.size // 4`,
    category: 'ES6+ Features'
  },
  {
    title: 'Map 数据结构',
    description: '键值对集合',
    code: `const map = new Map()
map.set('name', 'John')
map.set('age', 30)
map.get('name') // 'John'
map.has('age') // true
map.delete('age')`,
    category: 'ES6+ Features'
  },
  {
    title: '生成器函数',
    description: '可以暂停和恢复执行的函数',
    code: `function* numberGenerator() {
  yield 1
  yield 2
  yield 3
}

const gen = numberGenerator()
gen.next().value // 1
gen.next().value // 2
gen.next().value // 3`,
    category: 'ES6+ Features'
  },

  // Useful Patterns
  {
    title: '数组去重',
    description: '使用 Set 快速去除重复项',
    code: `const numbers = [1, 2, 2, 3, 3, 4, 4, 5]
const unique = [...new Set(numbers)]
// 结果: [1, 2, 3, 4, 5]`,
    category: 'Useful Patterns'
  },
  {
    title: '深拷贝对象',
    description: '使用展开运算符深拷贝',
    code: `const deepCopy = obj => JSON.parse(JSON.stringify(obj))

// 或使用结构化克隆（更安全）
const deepCopy = structuredClone(obj)`,
    category: 'Useful Patterns'
  },
  {
    title: '对象属性动态赋值',
    description: '动态属性名和简写',
    code: `const name = 'John'
const age = 30

// 简写
const user = { name, age }
// 等同于 { name: name, age: age }

// 动态属性名
const prop = 'dynamic'
const obj = { [prop]: 'value' }
// 结果: { dynamic: 'value' }`,
    category: 'Useful Patterns'
  },
  {
    title: '条件渲染',
    description: '使用 && 和 || 简化条件',
    code: `// && - 当为真时渲染
const showHeader = true
{showHeader && <Header />}

// || - 提供默认值
const name = userName || 'Guest'

// ?? - 只在 null/undefined 时使用默认值
const count = quantity ?? 0`,
    category: 'Useful Patterns'
  }
]

const categories = [
  'Array Methods',
  'Object Methods',
  'String Methods',
  'Function Features',
  'Async/Await',
  'ES6+ Features',
  'Useful Patterns'
]

export default function ESCheatSheet() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const filteredItems = esCheatData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            JavaScript/ES 速查手册
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            常用的 JavaScript 和 ES6+ 语法快速参考
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="搜索速查内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">所有分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 速查内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{item.code}</code>
                </pre>
                <button
                  onClick={() => copyCode(item.code, index)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                >
                  {copiedIndex === index ? '已复制!' : '复制代码'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              没有找到匹配的速查内容
            </p>
          </div>
        )}

        {/* 快速参考 */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            快速参考
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">数组操作</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">map()</code> - 转换每个元素</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">filter()</code> - 过滤元素</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">reduce()</code> - 累计计算</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">find()</code> - 查找元素</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">对象操作</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Object.keys()</code> - 获取键</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Object.values()</code> - 获取值</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Object.entries()</code> - 获取键值对</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">obj?.prop</code> - 可选链</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">函数技巧</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">() =&gt; &#123;&#125;</code> - 箭头函数</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">...args</code> - 剩余参数</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">[...arr]</code> - 展开数组</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">&#123;...obj&#125;</code> - 展开对象</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 更多资源 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            需要更详细的文档？访问{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              MDN Web Docs
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}