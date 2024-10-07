'use client'

import { useState, useEffect } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { SessionType } from '../types/ChatSession'

interface CollapsibleSidebarProps {
  sessionType: SessionType
  children: React.ReactNode
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
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(EXPANDABLE_SESSION_TYPES.includes(sessionType))
  }, [sessionType])

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
                    <code>
                      {`// Source code will be displayed here
function example() {
  console.log("Hello, World!");
}`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent
                value="preview"
                className="h-[calc(100%-2rem)] space-y-4 overflow-auto"
              >
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  <h3 className="mb-2 text-lg font-semibold">
                    Relationship Diagram
                  </h3>
                  <div className="flex h-40 items-center justify-center bg-gray-200 dark:bg-gray-500">
                    Mermaid Diagram Placeholder
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  <h3 className="mb-2 text-lg font-semibold">
                    Inspiration Map
                  </h3>
                  <div className="flex h-40 items-center justify-center bg-gray-200 dark:bg-gray-500">
                    SVG Inspiration Map Placeholder
                  </div>
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
