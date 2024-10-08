import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { systemCommand } from '../app/lib/db/schema'
import fs from 'fs'
import path from 'path'

// Initialize the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const db = drizzle(pool)

async function insertSystemCommands() {
  const promptsDir = path.join(__dirname, 'prompts')
  const files = fs.readdirSync(promptsDir)

  for (const file of files) {
    if (file.endsWith('.txt')) {
      const filePath = path.join(promptsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      if (lines.length < 3) {
        console.error(`Invalid file format: ${file}`)
        continue
      }

      const name = lines[0].trim()
      const type = lines[1].trim()
      const systemPrompt = lines.slice(2).join('\n').trim()
      try {
        await db.insert(systemCommand).values({
          name,
          type: type as
            | 'text_assistant'
            | 'mermaid_assistant'
            | 'svg_card_assistant'
            | 'development_assistant'
            | 'chatbot',
          systemPrompt,
        })
        console.log(`Inserted system command: ${name}`)
      } catch (error) {
        console.error(`Error inserting system command ${name}:`, error)
      }
    }
  }

  await pool.end()
}

insertSystemCommands().catch(console.error)
