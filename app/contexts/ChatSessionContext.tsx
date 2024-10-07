'use client'

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react'
import { ChatSession, SessionType } from '../types/ChatSession'

interface ChatSessionContextType {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  createSession: (
    name: string,
    systemPrompt: string,
    type: SessionType
  ) => Promise<void>
  switchSession: (id: string) => void
  updateSessionName: (id: string, name: string) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(
  undefined
)

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    const response = await fetch('/api/chat-sessions')
    if (response.ok) {
      const data = await response.json()
      setSessions(data)
    }
  }

  const createSession = useCallback(
    async (name: string, systemPrompt: string, type: SessionType) => {
      const response = await fetch('/api/chat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, systemPrompt, type }),
      })
      if (response.ok) {
        const newSession = await response.json()
        setSessions((prev) => [...prev, newSession])
        setCurrentSession(newSession)
      }
    },
    []
  )

  const switchSession = useCallback(
    (id: string) => {
      const session = sessions.find((s) => s.id === id)
      if (session) {
        setCurrentSession(session)
      }
    },
    [sessions]
  )

  const updateSessionName = useCallback(
    async (id: string, name: string) => {
      const response = await fetch('/api/chat-sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      })
      if (response.ok) {
        const updatedSession = await response.json()
        setSessions((prev) =>
          prev.map((session) => (session.id === id ? updatedSession : session))
        )
        if (currentSession?.id === id) {
          setCurrentSession(updatedSession)
        }
      }
    },
    [currentSession]
  )

  const deleteSession = useCallback(
    async (id: string) => {
      const response = await fetch('/api/chat-sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setSessions((prev) => prev.filter((session) => session.id !== id))
        if (currentSession?.id === id) {
          setCurrentSession(null)
        }
      }
    },
    [currentSession]
  )

  return (
    <ChatSessionContext.Provider
      value={{
        sessions,
        currentSession,
        createSession,
        switchSession,
        updateSessionName,
        deleteSession,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  )
}

export function useChatSession() {
  const context = useContext(ChatSessionContext)
  if (context === undefined) {
    throw new Error('useChatSession must be used within a ChatSessionProvider')
  }
  return context
}
