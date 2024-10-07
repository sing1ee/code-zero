'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { SessionType } from '../types/ChatSession'
import { Message } from 'ai'
import dynamic from 'next/dynamic'

const MermaidWrapper = dynamic(() => import('./MermaidWrapper'), { ssr: false })

interface CollapsibleSidebarProps {
  sessionType: SessionType
  children: React.ReactNode
  lastAssistantMessage?: Message
}

const EXPANDABLE_SESSION_TYPES: SessionType[] = [
  'text_assistant',
  'mermaid_assistant',
  'svg_card_assistant',
  'development_assistant',
]

function CollapsibleSidebar({
  sessionType,
  children,
  lastAssistantMessage,
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState('')
  const [codeType, setCodeType] = useState<'svg' | 'mermaid' | null>(null)

  useEffect(() => {
    setIsOpen(EXPANDABLE_SESSION_TYPES.includes(sessionType))
  }, [sessionType])

  useEffect(() => {
    if (lastAssistantMessage) {
      const svgMatch = lastAssistantMessage.content.match(/<svg[\s\S]*<\/svg>/)
      const mermaidMatch = lastAssistantMessage.content.match(
        /```mermaid\n([\s\S]*?)```/
      )

      if (svgMatch) {
        setCode(svgMatch[0])
        setCodeType('svg')
      } else if (mermaidMatch) {
        setCode(mermaidMatch[1])
        setCodeType('mermaid')
      } else {
        setCode('')
        setCodeType(null)
      }
    }
  }, [lastAssistantMessage])

  const renderPreview = useCallback(() => {
    if (codeType === 'svg') {
      return <div dangerouslySetInnerHTML={{ __html: code }} />
    } else if (codeType === 'mermaid') {
      return <MermaidWrapper chart={code} />
    }
    return null
  }, [code, codeType])

  const canExpand = EXPANDABLE_SESSION_TYPES.includes(sessionType)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-1 transition-all duration-300 ease-in-out"
    >
      <div
        className={`flex flex-1 flex-col ${isOpen ? '' : 'items-center justify-center'}`}
      >
        {children}
      </div>
      {canExpand && (
        <>
          <CollapsibleContent className="flex-1 overflow-hidden bg-gray-50 p-4 dark:bg-gray-700">
            <Tabs defaultValue="source" className="h-[calc(100%-2rem)]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent
                value="source"
                className="h-[calc(100%-2rem)] overflow-auto"
              >
                <div className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  <pre className="h-full overflow-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent
                value="preview"
                className="h-[calc(100%-2rem)] space-y-4 overflow-auto"
              >
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  {renderPreview()}
                </div>
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-full rounded-none">
              {isOpen ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </CollapsibleTrigger>
        </>
      )}
    </Collapsible>
  )
}

export { CollapsibleSidebar }
