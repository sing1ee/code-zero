import { NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { chatSessions, chatMessages } from '../../lib/db/schema'
import { eq } from 'drizzle-orm'
import { SessionType } from '../../types/ChatSession'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Create new session
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id

  const { name, systemPrompt, type } = await request.json()

  try {
    const [newSession] = await db
      .insert(chatSessions)
      .values({
        name,
        systemPrompt,
        type: type as SessionType,
        createdBy: userId, // get user id from token
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
    // 删除会话时，删除所有相关的对话记录
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, id))
    const [deletedSession] = await db
      .delete(chatSessions)
      .where(eq(chatSessions.id, id))
      .returning()

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
