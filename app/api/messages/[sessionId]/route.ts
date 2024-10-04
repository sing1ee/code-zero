import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '../../../lib/db'
import { validate as uuidValidate } from 'uuid'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId || !uuidValidate(sessionId)) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 })
    }

    const messages = await getMessages(sessionId)

    const response = NextResponse.json({ messages })

    // Set cache control headers
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, stale-while-revalidate=30'
    )

    return response
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
