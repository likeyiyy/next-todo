import TodoApp from '../../components/TodoApp';
import Link from 'next/link';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function TodoToolPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)]">
        <TodoApp />
      </main>
    </div>
  );
}
