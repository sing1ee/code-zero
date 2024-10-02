'use client'

import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import IconStop from './IconStop'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      keepLastMessageOnError: true,
    })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block rounded-lg p-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
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
          <Input
            className="flex-grow"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
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
