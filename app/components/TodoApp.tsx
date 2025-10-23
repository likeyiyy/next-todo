'use client';

import { useState } from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // 生成唯一 ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // 添加新 Todo
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: generateId(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  // 切换完成状态
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 删除 Todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 编辑 Todo
  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  // 清除已完成的 Todo
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // 过滤 Todo
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // 统计信息
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  // 时间统计
  const getTimeStats = () => {
    if (todos.length === 0) return null;

    const sortedTodos = [...todos].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const earliest = sortedTodos[0];
    const latest = sortedTodos[sortedTodos.length - 1];

    return {
      earliest: earliest.createdAt,
      latest: latest.createdAt,
      total: todos.length
    };
  };

  const timeStats = getTimeStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            使用 Next.js 和 Tailwind CSS 构建的现代化 Todo 应用
          </p>
        </div>

        {/* 添加 Todo 输入框 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加新的待办事项..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        {/* 过滤器和统计 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {filterType === 'all' ? '全部' : filterType === 'active' ? '进行中' : '已完成'}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>总计: {todos.length}</span>
                <span>进行中: {activeCount}</span>
                <span>已完成: {completedCount}</span>
                {completedCount > 0 && (
                  <button
                    onClick={clearCompleted}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    清除已完成
                  </button>
                )}
              </div>
              {timeStats && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  📊 时间范围: {timeStats.earliest.toLocaleDateString('zh-CN')} 至 {timeStats.latest.toLocaleDateString('zh-CN')}
                  {timeStats.total > 1 && (
                    <span className="ml-2">
                      (跨度 {Math.ceil((timeStats.latest.getTime() - timeStats.earliest.getTime()) / (1000 * 60 * 60 * 24))} 天)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Todo 列表 */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? '还没有待办事项' :
                 filter === 'active' ? '没有进行中的任务' : '没有已完成的任务'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>双击任务可以编辑 • 悬停显示操作按钮</p>
        </div>
      </div>
    </div>
  );
}
