'use client'

import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import IconStop from './IconStop'
import IconDelete from './IconDelete'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/utils'
import { useCallback } from 'react'
import './markdown.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { ComponentProps } from 'react'

export function Chat() {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({
    keepLastMessageOnError: true,
  })
  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id))
  }

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
      <ScrollArea className="flex-grow p-4">
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
                'flex max-w-[80%] flex-col rounded-lg p-4',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="markdown-content"
                components={{
                  code({
                    className,
                    children,
                    ...props
                  }: ComponentProps<'code'> & { inline?: boolean }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !props.inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role !== 'user' && (
              <button
                onClick={() => handleDelete(message.id)}
                className="ml-2 self-start"
              >
                <IconDelete className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleFormSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          {isLoading && (
            <div className="flex items-center justify-center">
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
          <Textarea
            className="flex-grow"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  )
}
