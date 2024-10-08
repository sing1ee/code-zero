import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { chatSessions } from '@/app/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId

    const session = await db
      .select({
        id: chatSessions.id,
        name: chatSessions.name,
        type: chatSessions.type,
      })
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1)

    if (session.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session[0])
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
