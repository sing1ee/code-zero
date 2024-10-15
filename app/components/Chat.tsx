'use client'
import { useCallback, useEffect, useState } from 'react'
import { Message, useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import clipboardCopy from 'clipboard-copy'
import { RefreshCw, Send, StopCircle, Copy } from 'lucide-react'

import { cn } from '../lib/utils'
import { EXPANDABLE_SESSION_TYPES, SessionType } from '../types/ChatSession'
import { CollapsibleSidebar } from './CollapsibleSidebar'
import { CollapsibleUserMessage } from './CollapsibleUserMessage'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'
import { Textarea } from './ui/textarea'
import { useToast } from '../hooks/use-toast'

import './markdown.css'

interface ChatProps {
  sessionId?: string
  systemPrompt?: string
  sessionName?: string // Add this line
  sessionType?: SessionType
}

export function Chat({ sessionId, sessionName, sessionType }: ChatProps) {
  const { toast } = useToast()
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  useEffect(() => {
    setInitialMessages([]) // Reset messages when sessionId changes
    setIsInitialLoading(true)

    const fetchInitialMessages = async () => {
      if (!sessionId) {
        setIsInitialLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/messages/${sessionId}`, {
          method: 'GET',
        })
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setInitialMessages(data.messages)
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
    id: sessionId, // Add this line to ensure chat state resets when sessionId changes
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

  const assistantMessages = messages.filter((m) => m.role === 'assistant')

  const isExpanded = sessionType
    ? EXPANDABLE_SESSION_TYPES.includes(sessionType)
    : false

  function handleCopy(content: string) {
    clipboardCopy(content)
      .then(() => {
        // Optionally, you can show a toast notification here
        console.log('Content copied to clipboard')
        toast({
          title: 'OK!',
          description: 'Content copied to clipboard',
        })
      })
      .catch((err) => {
        console.error('Failed to copy content: ', err)
      })
  }

  return (
    <CollapsibleSidebar
      sessionType={sessionType as SessionType}
      assistantMessages={assistantMessages}
    >
      <div className={`flex h-full flex-col ${isExpanded ? '' : 'w-1/2'}`}>
        <ScrollArea className="relative flex-grow p-4">
          {isInitialLoading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-8 w-48" />
            </div>
          ) : (
            <>
              {sessionName && (
                <h2 className="mb-4 text-center text-xl font-semibold">
                  {sessionName}
                </h2>
              )}
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
                  <div className="ml-2 flex flex-col">
                    <Button
                      onClick={() => handleCopy(message.content)}
                      variant="ghost"
                      size="icon"
                      className="mb-2 p-0 hover:bg-gray-200"
                      aria-label="Copy message"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {message.role === 'assistant' && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          reload({
                            body: {
                              sessionId: sessionId,
                            },
                          })
                        }}
                        variant="ghost"
                        size="icon"
                        className="p-0 hover:bg-gray-200"
                        aria-label="Regenerate response"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          {isLoading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
              <button
                type="button"
                onClick={() => stop()}
                className="rounded-full p-2 transition-colors hover:bg-gray-200"
                aria-label="Stop generation"
              >
                <StopCircle className="h-4 w-4" />
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
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </CollapsibleSidebar>
  )
}
