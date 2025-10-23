import Link from 'next/link';

const tools = [
  {
    id: 'todo',
    title: 'Todo 应用',
    description: '现代化的待办事项管理工具，支持数据持久化',
    icon: '📝',
    category: '生产力',
    href: '/tools/todo',
    color: 'bg-blue-500',
    features: ['数据持久化', '实时同步', '时间统计']
  },
  {
    id: 'json-editor',
    title: 'JSON 编辑器',
    description: '在线 JSON 编辑器，支持格式化、验证和美化',
    icon: '🔧',
    category: '开发工具',
    href: '/tools/json-editor',
    color: 'bg-green-500',
    features: ['语法高亮', '格式化', '验证错误']
  },
  {
    id: 'text-compare',
    title: '文本对比工具',
    description: '快速对比两段文本的差异，高亮显示变化',
    icon: '📊',
    category: '文本工具',
    href: '/tools/text-compare',
    color: 'bg-purple-500',
    features: ['差异高亮', '行级对比', '导出结果']
  }
];

const categories = ['全部', '生产力', '开发工具', '文本工具'];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🛠️ 个人工具集
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                69 个工具
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                2026
              </span>
              <button className="text-blue-500 hover:text-blue-600">
                💬
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索其实很简单"
                  className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-2 space-x-2">
                <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  正则
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  字帖
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  抠图
                </button>
                <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                  搜索
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              我的
            </button>
            <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium">
              工具
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              文库
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              码库
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              软件
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              网址
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              话题
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600">
              小摊
            </button>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-3 px-1 border-b-2 ${
                  category === '全部'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Tool Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-3xl">{tool.icon}</span>
                </div>

                {/* Tool Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {tool.title}
                </h3>

                {/* Category Tag */}
                <div className="flex justify-center mb-3">
                  <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                    [{tool.category}]
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center line-clamp-2">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tool.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                    进入
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            更多工具即将上线
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            我们正在开发更多实用的在线工具，敬请期待！
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>© 2024 个人工具集. 使用 Next.js 和 Tailwind CSS 构建</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
