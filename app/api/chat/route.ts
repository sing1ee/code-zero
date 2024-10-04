import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText, CoreMessage } from 'ai'
import { NextResponse } from 'next/server'
import { getSession, saveMessages } from '../../lib/db'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL,
})

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json()
    const session = await getSession(sessionId)
    const newMessages = convertToCoreMessages(messages)
    const result = await streamText({
      model: openai(process.env.MODEL_ID as string),
      system: session?.systemPrompt || 'You are a helpful assistant.',
      messages: newMessages,
      async onFinish({ text }) {
        const updatedMessages: CoreMessage[] = [
          ...newMessages,
          { role: 'assistant', content: text },
        ]
        await saveMessages(sessionId, updatedMessages)
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
