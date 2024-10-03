'use client'

import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import IconStop from './IconStop'
import IconRefresh from './IconRefresh'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/utils'
import { useCallback } from 'react'
import './markdown.css'
import IconSend from './IconSend'

interface ChatProps {
  systemPrompt?: string
}

export function Chat({ systemPrompt }: ChatProps) {
  const {
    messages,
    reload,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    initialMessages: systemPrompt
      ? [{ id: 'system', role: 'system', content: systemPrompt }]
      : undefined,
    keepLastMessageOnError: true,
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isLoading) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
      }
    },
    [handleSubmit, isLoading]
  )

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="relative flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'mb-4',
              message.role === 'user'
                ? 'flex justify-end'
                : 'flex justify-start'
            )}
          >
            <div
              className={cn(
                'flex max-w-[80%] flex-col overflow-x-auto rounded-lg p-4',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              )}
            >
              {message.role !== 'user' ? (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words p-0 font-mono text-sm">
                  {message.content}
                </div>
              )}
            </div>
            {message.role !== 'user' && (
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
