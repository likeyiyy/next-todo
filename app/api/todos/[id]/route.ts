import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// 更新 todo
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { text, completed } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid Todo ID' },
        { status: 400 }
      );
    }

    let query;

    if (text !== undefined) {
      // 更新文本
      query = sql`
        UPDATE todos
        SET text = ${text.trim()}, updated_at = NOW()
        WHERE id = ${todoId}
        RETURNING id, text, completed, created_at, updated_at
      `;
    } else if (completed !== undefined) {
      // 更新完成状态
      query = sql`
        UPDATE todos
        SET completed = ${completed}, updated_at = NOW()
        WHERE id = ${todoId}
        RETURNING id, text, completed, created_at, updated_at
      `;
    } else {
      return NextResponse.json(
        { error: 'Either text or completed status is required' },
        { status: 400 }
      );
    }

    const { rows } = await query;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// 删除 todo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: 'Invalid Todo ID' },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      DELETE FROM todos
      WHERE id = ${todoId}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
