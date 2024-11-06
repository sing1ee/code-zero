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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { SessionType, EXPANDABLE_SESSION_TYPES } from '../types/ChatSession'
import { Message } from 'ai'
import dynamic from 'next/dynamic'
import mermaid from 'mermaid'

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
  const [selectedVersion, setSelectedVersion] = useState<string>('')

  useEffect(() => {
    setIsOpen(EXPANDABLE_SESSION_TYPES.includes(sessionType))
  }, [sessionType])

  useEffect(() => {
    const versions: DiagramVersion[] = []
    assistantMessages.forEach((message, index) => {
      const svgMatch = message.content.match(/<svg[\s\S]*<\/svg>/)
      const mermaidMatch = message.content.match(/```mermaid\n([\s\S]*?)```/)

      if (svgMatch) {
        versions.push({
          version: `V${index + 1}`,
          code: svgMatch[0],
          type: 'svg',
        })
      } else if (mermaidMatch) {
        versions.push({
          version: `V${index + 1}`,
          code: mermaidMatch[1],
          type: 'mermaid',
        })
      }
    })

    setDiagramVersions(versions.reverse())
    if (versions.length > 0) {
      setSelectedVersion(versions[0].version)
    }
  }, [assistantMessages])

  const handleDownload = useCallback(() => {
    if (
      diagramVersions.find((v) => v.version === selectedVersion)?.type === 'svg'
    ) {
      const currentVersion = diagramVersions.find(
        (v) => v.version === selectedVersion
      )
      if (!currentVersion?.code) {
        console.error('No valid diagram code found')
        return
      }

      const tempSvg = document.createElement('div')
      tempSvg.innerHTML = currentVersion.code
      const svgElement = tempSvg.firstChild as SVGSVGElement

      if (!svgElement || !(svgElement instanceof SVGSVGElement)) {
        console.error('Invalid SVG element')
        return
      }

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
      img.src =
        'data:image/svg+xml,' +
        encodeURIComponent(
          diagramVersions.find((v) => v.version === selectedVersion)?.code || ''
        )
    } else if (
      diagramVersions.find((v) => v.version === selectedVersion)?.type ===
      'mermaid'
    ) {
      mermaid
        .render(
          'mermaid-svg',
          diagramVersions.find((v) => v.version === selectedVersion)?.code || ''
        )
        .then(({ svg }) => {
          console.log(svg)
          // 创建一个临时的 SVG 元素来获取尺寸
          const tempSvg = document.createElement('div')
          tempSvg.innerHTML = svg
          const svgElement = tempSvg.firstChild as SVGSVGElement

          // 获取 SVG 的宽高
          const svgWidth = svgElement.viewBox.baseVal.width
          const svgHeight = svgElement.viewBox.baseVal.height
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
        })
    }
  }, [diagramVersions, selectedVersion])

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Sharing functionality to be implemented')
  }, [])

  const renderPreview = useCallback(() => {
    const currentVersion = diagramVersions.find(
      (v) => v.version === selectedVersion
    )
    if (!currentVersion) return null

    if (currentVersion.type === 'svg') {
      return <div dangerouslySetInnerHTML={{ __html: currentVersion.code }} />
    } else if (currentVersion.type === 'mermaid') {
      // 添加 key 属性，使用 selectedVersion 作为唯一标识符
      return (
        <MermaidWrapper key={selectedVersion} chart={currentVersion.code} />
      )
    }
    return null
  }, [selectedVersion, diagramVersions])

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
            <Tabs defaultValue="source" className="h-full">
              <div className="mb-2 flex items-center justify-between">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <Select
                  value={selectedVersion}
                  onValueChange={setSelectedVersion}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>
                  <SelectContent>
                    {diagramVersions.map((version) => (
                      <SelectItem key={version.version} value={version.version}>
                        {version.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TabsContent
                value="source"
                className="h-[calc(100%-2.5rem)] overflow-auto"
              >
                <div className="h-full rounded-lg bg-white p-4 shadow dark:bg-gray-600">
                  <pre className="h-full overflow-auto">
                    <code>
                      {diagramVersions.find(
                        (v) => v.version === selectedVersion
                      )?.code || ''}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent
                value="preview"
                className="relative h-[calc(100%-2.5rem)] space-y-4 overflow-auto"
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
