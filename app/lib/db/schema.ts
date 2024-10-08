import {
  pgTable,
  serial,
  varchar,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  integer,
  index,
} from 'drizzle-orm/pg-core'

// Add this enum definition
export const sessionTypeEnum = pgEnum('session_type', [
  'text_assistant',
  'mermaid_assistant',
  'svg_card_assistant',
  'development_assistant',
  'chatbot',
])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const chatSessions = pgTable(
  'chat_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    systemPrompt: text('system_prompt').notNull(),
    type: sessionTypeEnum('type').notNull().default('text_assistant'),
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      createdByIdx: index('created_by_idx').on(table.createdBy),
    }
  }
)

export const systemCommand = pgTable('system_cmds', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  type: sessionTypeEnum('type').notNull().default('text_assistant'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => chatSessions.id)
    .unique(),
  messages: jsonb('messages').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
