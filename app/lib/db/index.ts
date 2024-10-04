import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { chatSessions, chatMessages } from './schema'
import { eq, sql } from 'drizzle-orm'
import { CoreMessage } from 'ai'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool)

export const getSession = async (id: string) => {
  const sessions = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.id, id))
    .limit(1)

  return sessions[0] || null
}

export const saveMessages = async (
  sessionId: string,
  messages: CoreMessage[]
) => {
  await db
    .insert(chatMessages)
    .values({
      sessionId,
      messages,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: chatMessages.sessionId,
      set: {
        messages: sql`${messages}::jsonb`,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    })
}
