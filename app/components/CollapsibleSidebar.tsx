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
  Download,
  Share2,
  Check,
  Copy,
} from 'lucide-react'
import { Button } from './ui/button'
import { SessionType, EXPANDABLE_SESSION_TYPES } from '../types/ChatSession'
import { Message } from 'ai'
import dynamic from 'next/dynamic'
import mermaid from 'mermaid'
import { ensureMatchedTags } from '../lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
const MermaidWrapper = dynamic(() => import('./MermaidWrapper'), { ssr: false })

interface CollapsibleSidebarProps {
  sessionType: SessionType
  children: React.ReactNode
  assistantMessages: Message[]
}

interface DiagramVersion {
  version: string
  code: string
  type: 'svg' | 'mermaid'
}

function CollapsibleSidebar({
  sessionType,
  children,
  assistantMessages,
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [diagramVersions, setDiagramVersions] = useState<DiagramVersion[]>([])
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null)

  useEffect(() => {
    setIsOpen(EXPANDABLE_SESSION_TYPES.includes(sessionType))
  }, [sessionType])

  useEffect(() => {
    const versions: DiagramVersion[] = []
    assistantMessages.forEach((message, index) => {
      // Using a more compatible SVG matching pattern
      const svgMatches = message.content.match(/<svg[^>]*>[\s\S]*?<\/svg>/g)

      // Using a more compatible Mermaid matching pattern
      const mermaidMatches = message.content.match(/```mermaid\n[\s\S]*?```/g)

      if (svgMatches) {
        svgMatches.forEach((svgCode) => {
          versions.push({
            version: `V${index + 1}-${versions.length + 1}`,
            code: svgCode,
            type: 'svg',
          })
        })
      }

      if (mermaidMatches) {
        mermaidMatches.forEach((mermaidBlock) => {
          const mermaidCode = mermaidBlock
            .replace(/```mermaid\n|```/g, '')
            .trim()
          versions.push({
            version: `V${index + 1}-${versions.length + 1}`,
            code: mermaidCode,
            type: 'mermaid',
          })
        })
      }
    })

    // Reverse to show most recent versions first
    const reversedVersions = versions.reverse()

    setDiagramVersions(reversedVersions)
  }, [assistantMessages])

  const handleDownload = useCallback((version: DiagramVersion) => {
    if (version.type === 'svg') {
      const tempSvg = document.createElement('div')
      tempSvg.innerHTML = version.code
      const svgElement = tempSvg.firstChild as SVGSVGElement

      let svgWidth = 0
      let svgHeight = 0

      if (svgElement.viewBox.baseVal && svgElement.viewBox.baseVal.width > 0) {
        svgWidth = svgElement.viewBox.baseVal.width
        svgHeight = svgElement.viewBox.baseVal.height
      } else {
        // 检查 width/height 属性
        const widthAttr = svgElement.getAttribute('width')
        const heightAttr = svgElement.getAttribute('height')

        if (widthAttr && heightAttr) {
          // 移除单位(px, em等)，只保留数字
          svgWidth = parseFloat(widthAttr)
          svgHeight = parseFloat(heightAttr)
        } else {
          // 如果都没有，使用 client 尺寸
          svgWidth = svgElement.clientWidth || 800 // 设置默认宽度
          svgHeight = svgElement.clientHeight || 600 // 设置默认高度
        }
      }

      if (!svgWidth || !svgHeight) {
        console.error('Could not determine SVG dimensions')
        return
      }
      // Convert SVG to PNG and download
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.width = svgWidth
      img.height = svgHeight
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
      img.src = 'data:image/svg+xml,' + encodeURIComponent(version.code)
    } else if (version.type === 'mermaid') {
      mermaid.render('mermaid-svg', version.code).then(({ svg }) => {
        svg = ensureMatchedTags(svg)
        // 创建一个临时的 SVG 元素来获取尺寸
        const tempSvg = document.createElement('div')
        tempSvg.innerHTML = svg
        const svgElement = tempSvg.firstChild as SVGSVGElement

        let svgWidth = 0
        let svgHeight = 0

        if (
          svgElement.viewBox.baseVal &&
          svgElement.viewBox.baseVal.width > 0
        ) {
          svgWidth = svgElement.viewBox.baseVal.width
          svgHeight = svgElement.viewBox.baseVal.height
        } else {
          // 检查 width/height 属性
          const widthAttr = svgElement.getAttribute('width')
          const heightAttr = svgElement.getAttribute('height')

          if (widthAttr && heightAttr) {
            // 移除单位(px, em等)，只保留数字
            svgWidth = parseFloat(widthAttr)
            svgHeight = parseFloat(heightAttr)
          } else {
            // 如果都没有，使用 client 尺寸
            svgWidth = svgElement.clientWidth || 800 // 设置默认宽度
            svgHeight = svgElement.clientHeight || 600 // 设置默认高度
          }
        }

        if (!svgWidth || !svgHeight) {
          console.error('Could not determine SVG dimensions')
          return
        }
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.width = svgWidth
        img.height = svgHeight
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          const pngFile = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.download = 'mermaid-diagram.png'
          downloadLink.href = pngFile
          downloadLink.click()
        }
        img.src = 'data:image/svg+xml,' + encodeURIComponent(svg)
        console.log(img.src)
      })
    }
  }, [])

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Sharing functionality to be implemented')
  }, [])

  const handleCopyCode = useCallback((version: DiagramVersion) => {
    navigator.clipboard.writeText(version.code)
    setCopiedVersion(version.version)
    setTimeout(() => setCopiedVersion(null), 2000)
  }, [])

  const renderDiagramCard = useCallback(
    (version: DiagramVersion) => {
      return (
        <div
          key={version.version}
          className="flex flex-col rounded-lg bg-white shadow-md dark:bg-gray-600"
        >
          <div className="flex items-center justify-between border-b p-3 dark:border-gray-500">
            <span className="font-medium">{version.version}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(version)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="p-4">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Preview
              </div>
              <div className="mt-2">
                {version.type === 'svg' ? (
                  <div dangerouslySetInnerHTML={{ __html: version.code }} />
                ) : (
                  <MermaidWrapper key={version.version} chart={version.code} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="source" className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Source
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(version)}
                  className="h-8 px-2"
                >
                  {copiedVersion === version.version ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="mt-2 max-h-[300px] overflow-auto">
                <code>{version.code}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </div>
      )
    },
    [handleDownload, handleShare, handleCopyCode, copiedVersion]
  )

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
          <CollapsibleContent className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-700">
            <div className="grid grid-cols-1 gap-6">
              {diagramVersions.map(renderDiagramCard)}
            </div>
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
