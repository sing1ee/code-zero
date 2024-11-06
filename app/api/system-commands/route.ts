import { NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { systemCommand } from '../../lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    // order by createdAt desc
    const commands = await db
      .select({
        id: systemCommand.id,
        name: systemCommand.name,
        type: systemCommand.type,
        createdAt: systemCommand.createdAt,
        updatedAt: systemCommand.updatedAt,
      })
      .from(systemCommand)
      .orderBy(desc(systemCommand.createdAt))
    return NextResponse.json(commands)
  } catch (error) {
    console.error('Error fetching system commands:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, type, systemPrompt } = body

    if (!name || !type || !systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const command = await db
      .insert(systemCommand)
      .values({
        name,
        type,
        systemPrompt,
      })
      .returning()

    return NextResponse.json(command[0])
  } catch (error) {
    console.error('Error creating system command:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
