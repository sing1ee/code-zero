import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { chatSessions } from './schema'
import { eq } from 'drizzle-orm'

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
