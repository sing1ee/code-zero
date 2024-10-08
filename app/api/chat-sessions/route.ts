import { NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { chatMessages, chatSessions, systemCommand } from '../../lib/db/schema'
import { eq } from 'drizzle-orm'
import { SessionType, ChatSession } from '../../types/ChatSession'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

// Create new session
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = session.user.id

  const { name, systemPrompt, type, systemCommandId } = await request.json()

  try {
    let sessionData: { name: string; systemPrompt: string; type: SessionType }

    if (systemCommandId) {
      const [systemCommandObj] = await db
        .select()
        .from(systemCommand)
        .where(eq(systemCommand.id, systemCommandId))
        .limit(1)

      if (!systemCommandObj) {
        return NextResponse.json(
          { error: 'System command not found' },
          { status: 404 }
        )
      }

      sessionData = {
        name: systemCommandObj.name,
        systemPrompt: systemCommandObj.systemPrompt,
        type: systemCommandObj.type as SessionType,
      }
    } else {
      sessionData = { name, systemPrompt, type: type as SessionType }
    }

    const [newSession] = await db
      .insert(chatSessions)
      .values({
        ...sessionData,
        createdBy: parseInt(userId, 10),
      })
      .returning()

    return NextResponse.json(removeSystemPrompt(newSession))
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the session' },
      { status: 500 }
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
    return NextResponse.json(sessions.map(removeSystemPrompt))
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

    return NextResponse.json(removeSystemPrompt(updatedSession))
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

function removeSystemPrompt(
  session: ChatSession
): Omit<ChatSession, 'systemPrompt'> {
  return Object.fromEntries(
    Object.entries(session).filter(([key]) => key !== 'systemPrompt')
  ) as Omit<ChatSession, 'systemPrompt'>
}
