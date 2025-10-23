import { Client } from 'pg';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    console.log('✅ 连接到数据库成功');

    // 创建表
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ 创建 todos 表成功');

    // 创建更新时间触发器
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ 创建触发器函数成功');

    // 为 todos 表添加触发器
    await client.query(`
      DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
      CREATE TRIGGER update_todos_updated_at
          BEFORE UPDATE ON todos
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ 创建触发器成功');

    // 插入一些示例数据
    await client.query(`
      INSERT INTO todos (text, completed) VALUES 
        ('欢迎使用 Vercel Postgres Todo 应用！', false),
        ('点击复选框标记任务完成', false),
        ('双击任务文本可以编辑', false)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ 插入示例数据成功');

    console.log('🎉 数据库初始化完成！');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    await client.end();
  }
}

initDatabase();
