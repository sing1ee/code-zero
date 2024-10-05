import { NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { chatSessions } from '../../lib/db/schema'
import { eq } from 'drizzle-orm'
import { chatMessages } from '../../lib/db/schema'
// 创建新会话
export async function POST(request: Request) {
  const { name, systemPrompt } = await request.json()

  try {
    const [newSession] = await db
      .insert(chatSessions)
      .values({
        name,
        systemPrompt,
      })
      .returning()

    return NextResponse.json(newSession)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

// 获取会话列表
export async function GET() {
  try {
    const sessions = await db
      .select()
      .from(chatSessions)
      .orderBy(chatSessions.createdAt)
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

// 更新会话
export async function PUT(request: Request) {
  const { id, name } = await request.json()

  try {
    const [updatedSession] = await db
      .update(chatSessions)
      .set({ name, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning()

    if (!updatedSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSession)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}

// 删除会话
export async function DELETE(request: Request) {
  const { id } = await request.json()

  try {
    const [deletedSession] = await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, id))
      .returning()
    // 删除会话时，删除所有相关的对话记录
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, id))
    if (!deletedSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
