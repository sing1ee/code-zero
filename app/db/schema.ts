import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const chatSessions = pgTable('chat_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
