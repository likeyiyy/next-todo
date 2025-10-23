import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// 获取所有 todos
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, text, completed, created_at, updated_at
      FROM todos
      ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// 创建新 todo
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO todos (text, completed)
      VALUES (${text.trim()}, false)
      RETURNING id, text, completed, created_at, updated_at
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
