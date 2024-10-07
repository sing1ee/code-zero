import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidWrapperProps {
  chart: string
}

function MermaidWrapper({ chart }: MermaidWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.init(undefined, ref.current)
    }
  }, [chart])

  return <div ref={ref}>{chart}</div>
}

export default MermaidWrapper
