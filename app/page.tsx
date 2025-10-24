import Link from 'next/link';
import UnifiedHeader from './components/UnifiedHeader';

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
  },
  {
    id: 'global-clock',
    title: '全球时钟',
    description: '实时显示全球主要城市的当前时间',
    icon: '🌍',
    category: '实用工具',
    href: '/tools/global-clock',
    color: 'bg-indigo-500',
    features: ['实时更新', '多时区', '地区分组']
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Search */}
      <UnifiedHeader isHomePage={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 aspect-square flex flex-col items-center justify-center p-6"
            >
              {/* Tool Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-200 mb-4">
                <span className="text-3xl">{tool.icon}</span>
              </div>

              {/* Tool Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                {tool.title}
              </h3>

              {/* Tool Category */}
              <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {tool.category}
              </span>
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
