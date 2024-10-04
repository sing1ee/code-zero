'use client'

import { useState } from 'react'
import { Button } from './ui/button'

interface CollapsibleUserMessageProps {
  content: string
}

export function CollapsibleUserMessage({
  content,
}: CollapsibleUserMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative">
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-full' : 'max-h-24'
        }`}
      >
        <p className={`whitespace-pre-wrap ${!isExpanded && 'line-clamp-5'}`}>
          {content}
        </p>
      </div>
      {content.split('\n').length > 5 && (
        <Button
          variant="link"
          className="mt-2 p-0 text-sm text-blue-300 hover:text-blue-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  )
}
