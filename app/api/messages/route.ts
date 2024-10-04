import { NextResponse } from 'next/server'
import { getMessages } from '../../lib/db'
import { validate as uuidValidate } from 'uuid'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId || sessionId === 'undefined' || !uuidValidate(sessionId)) {
      return NextResponse.json(
        { error: 'Invalid or missing sessionId' },
        { status: 400 }
      )
    }

    const messages = await getMessages(sessionId)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
