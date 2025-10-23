import TodoApp from '../../components/TodoApp';
import Link from 'next/link';

export default function TodoToolPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ← 返回
              </Link>
              <div className="flex items-center">
                <span className="text-lg mr-2">📝</span>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Todo 应用
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-3rem)]">
        <TodoApp />
      </main>
    </div>
  );
}
