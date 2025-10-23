'use client';

import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { TodoAPI, Todo } from '@/lib/todo-api';

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载 todos
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TodoAPI.getAll();
      setTodos(data);
    } catch (err) {
      setError('加载待办事项失败');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新 Todo
  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        setError(null);
        const todo = await TodoAPI.create(newTodo.trim());
        setTodos([todo, ...todos]);
        setNewTodo('');
      } catch (err) {
        setError('添加待办事项失败');
        console.error('Error adding todo:', err);
      }
    }
  };

  // 切换完成状态
  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      setError(null);
      const updatedTodo = await TodoAPI.toggleComplete(id, !todo.completed);
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('更新待办事项失败');
      console.error('Error toggling todo:', err);
    }
  };

  // 删除 Todo
  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await TodoAPI.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('删除待办事项失败');
      console.error('Error deleting todo:', err);
    }
  };

  // 编辑 Todo
  const editTodo = async (id: number, newText: string) => {
    try {
      setError(null);
      const updatedTodo = await TodoAPI.updateText(id, newText);
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('编辑待办事项失败');
      console.error('Error editing todo:', err);
    }
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

    const sortedTodos = [...todos].sort((a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const earliest = sortedTodos[0];
    const latest = sortedTodos[sortedTodos.length - 1];

    return {
      earliest: new Date(earliest.created_at),
      latest: new Date(latest.created_at),
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
            使用 Next.js、Tailwind CSS 和 Vercel Postgres 构建的现代化 Todo 应用
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

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
          {loading ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">加载中...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
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
          <p className="mt-2 text-xs">🕒 现在支持显示创建时间了！</p>
        </div>
      </div>
    </div>
  );
}
