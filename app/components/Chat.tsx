'use client'
import { useEffect, useState } from 'react'
import { useChat, Message } from 'ai/react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import IconStop from './icon/IconStop'
import IconRefresh from './icon/IconRefresh'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/utils'
import { useCallback } from 'react'
import './markdown.css'
import IconSend from './icon/IconSend'
import { CollapsibleUserMessage } from './CollapsibleUserMessage'

interface ChatProps {
  sessionId?: string
  systemPrompt?: string
}

export function Chat({ sessionId }: ChatProps) {
  console.log('sessionId', sessionId)
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch(`/api/messages?sessionId=${sessionId}`, {
          method: 'GET',
        })
        if (!response.ok) throw new Error('Failed to fetch messages')
        const messages: Message[] = await response.json()
        setInitialMessages(messages)
      } catch (error) {
        console.error('Error fetching initial messages:', error)
        // Handle error (e.g., show error message to user)
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchInitialMessages()
  }, [sessionId])

  const {
    messages,
    reload,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    initialMessages,
    keepLastMessageOnError: true,
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e, {
      body: {
        sessionId: sessionId,
      },
    })
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isLoading) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, {
          body: {
            sessionId: sessionId,
          },
        })
      }
    },
    [handleSubmit, isLoading, sessionId]
  )

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="relative flex-grow p-4">
        {isInitialLoading && <div>Loading chat history...</div>}
        {messages.map((message, index) => (
          <div
            key={message.id || `message-${index}`}
            className={cn(
              'mb-4',
              message.role === 'user' || message.role === 'system'
                ? 'flex justify-end'
                : 'flex justify-start'
            )}
          >
            <div
              className={cn(
                'flex max-w-[80%] flex-col overflow-x-auto rounded-lg p-4',
                message.role === 'user' || message.role === 'system'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              )}
            >
              {message.role === 'assistant' && (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              {(message.role === 'user' || message.role === 'system') && (
                <CollapsibleUserMessage content={message.content} />
              )}
            </div>
            {message.role === 'assistant' && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  reload()
                }}
                variant="ghost"
                size="icon"
                className="ml-2 self-start p-0 hover:bg-gray-200"
              >
                <IconRefresh className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
            <button
              type="button"
              onClick={() => stop()}
              className="rounded-full p-2 transition-colors hover:bg-gray-200"
              aria-label="Stop generation"
            >
              <IconStop />
            </button>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleFormSubmit} className="border-t p-4">
        <div className="relative">
          <Textarea
            className="pr-12"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="absolute bottom-2 right-2 p-2"
            aria-label="Send message"
          >
            <IconSend />
          </Button>
        </div>
      </form>
    </div>
  )
}
