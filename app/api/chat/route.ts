import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import { NextResponse } from 'next/server'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai(process.env.MODEL_ID as string),
      system: 'You are a helpful assistant.',
      messages: convertToCoreMessages(messages),
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
