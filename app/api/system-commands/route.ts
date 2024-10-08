import { NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { systemCommand } from '../../lib/db/schema'

export async function GET() {
  try {
    const commands = await db
      .select({
        id: systemCommand.id,
        name: systemCommand.name,
        type: systemCommand.type,
        createdAt: systemCommand.createdAt,
        updatedAt: systemCommand.updatedAt,
      })
      .from(systemCommand)

    return NextResponse.json(commands)
  } catch (error) {
    console.error('Error fetching system commands:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
