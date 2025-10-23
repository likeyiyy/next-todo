import TodoApp from '../../components/TodoApp';
import Link from 'next/link';
import ToolHeader from '../../components/ToolHeader';

export default function TodoToolPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToolHeader toolName="Todo 应用" toolIcon="📝" />

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        <TodoApp />
      </main>
    </div>
  );
}
