'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import LayoutWithSidebar from '../../layout-with-sidebar'
import { Chat } from '../../components/Chat'
import { SessionType } from '../../types/ChatSession'

interface SessionInfo {
  id: string
  name: string
  type: SessionType
}

export default function ChatPage() {
  const { sessionId } = useParams()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  useEffect(() => {
    async function fetchSessionInfo() {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}`)
        if (!response.ok) throw new Error('Failed to fetch session info')
        const data = await response.json()
        setSessionInfo(data)
      } catch (error) {
        console.error('Error fetching session info:', error)
      }
    }

    if (sessionId) {
      fetchSessionInfo()
    }
  }, [sessionId])

  if (!sessionInfo) {
    return <div>Loading...</div>
  }

  return (
    <LayoutWithSidebar>
      <Chat
        sessionId={sessionInfo.id}
        sessionName={sessionInfo.name}
        sessionType={sessionInfo.type}
      />
    </LayoutWithSidebar>
  )
}
