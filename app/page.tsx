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
      {/* Header with Search */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                🛠️ 个人工具集
              </h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索工具..."
                  className="w-full px-4 py-2 pl-10 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                3 个工具
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4">
                {/* Tool Icon and Title */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:scale-105 transition-transform duration-200">
                    <span className="text-xl">{tool.icon}</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tool.category}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors duration-200">
                  使用
                </button>
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
