export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE = '/api/todos';

export class TodoAPI {
  // 获取所有 todos
  static async getAll(): Promise<Todo[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  }

  // 创建新 todo
  static async create(text: string): Promise<Todo> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  }

  // 更新 todo 文本
  static async updateText(id: number, text: string): Promise<Todo> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  }

  // 切换完成状态
  static async toggleComplete(id: number, completed: boolean): Promise<Todo> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle todo');
    }
    return response.json();
  }

  // 删除 todo
  static async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  }
}
