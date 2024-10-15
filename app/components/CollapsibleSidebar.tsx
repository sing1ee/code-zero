'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Download,
  Share2,
} from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { SessionType, EXPANDABLE_SESSION_TYPES } from '../types/ChatSession'
import { Message } from 'ai'
import dynamic from 'next/dynamic'

const MermaidWrapper = dynamic(() => import('./MermaidWrapper'), { ssr: false })

interface CollapsibleSidebarProps {
  sessionType: SessionType
  children: React.ReactNode
  lastAssistantMessage?: Message
}

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

  const handleDownload = useCallback(() => {
    if (codeType === 'svg') {
      // Convert SVG to PNG and download
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = 'diagram.png'
        downloadLink.href = pngFile
        downloadLink.click()
      }
      img.src = 'data:image/svg+xml,' + encodeURIComponent(code)
    } else if (codeType === 'mermaid') {
      // For Mermaid, we'll need to use mermaid.js API to render and download
      // This is a placeholder and needs to be implemented
      console.log('Downloading Mermaid diagram as PNG')
    }
  }, [codeType, code])

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Sharing functionality to be implemented')
  }, [])

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
                className="relative h-[calc(100%-2rem)] space-y-4 overflow-auto"
              >
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  <div className="absolute right-2 top-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            onClick={handleDownload}
                            className="w-full justify-start"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={handleShare}
                            className="w-full justify-start"
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
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
