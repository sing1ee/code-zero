import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { SessionType } from '../types/ChatSession'
import { useChatSession } from '../contexts/ChatSessionContext'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { sessionTypeOptions } from '../types/ChatSession'

interface SystemCommand {
  id: string
  name: string
  type: SessionType
}

export function Welcome() {
  const { sessions, switchSession, createSession } = useChatSession()
  const [systemCommands, setSystemCommands] = useState<SystemCommand[]>([])
  const [newSessionName, setNewSessionName] = useState('')
  const [newSystemPrompt, setNewSystemPrompt] = useState('')
  const [newSystemCommandId, setNewSystemCommandId] = useState('')
  const [newSessionType, setNewSessionType] =
    useState<SessionType>('text_assistant')

  useEffect(() => {
    async function fetchSystemCommands() {
      try {
        const response = await fetch('/api/system-commands')
        if (!response.ok) throw new Error('Failed to fetch system commands')
        const data = await response.json()
        setSystemCommands(data)
      } catch (error) {
        console.error('Error fetching system commands:', error)
      }
    }

    fetchSystemCommands()
  }, [])

  const handleQuickChat = async (command: SystemCommand) => {
    setNewSystemCommandId(command.id)
    setNewSessionName(command.name)
    setNewSessionType(command.type)
    createSession(
      newSessionName,
      newSystemPrompt,
      newSessionType,
      newSystemCommandId
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Welcome to Chat App
        </h1>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1 space-y-4">
            <h2 className="mb-4 text-xl font-semibold">Create New Session</h2>
            <Input
              placeholder="Session Name"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <Textarea
              placeholder="System Prompt"
              value={newSystemPrompt}
              onChange={(e) => setNewSystemPrompt(e.target.value)}
            />
            <Select
              value={newSessionType}
              onValueChange={(value: SessionType) => setNewSessionType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() =>
                createSession(
                  newSessionName,
                  newSystemPrompt,
                  newSessionType,
                  newSystemCommandId
                )
              }
              className="w-full"
            >
              Create New Session
            </Button>
          </div>

          {sessions.length > 0 && (
            <div className="flex-1">
              <h2 className="mb-4 text-xl font-semibold">Recent Sessions</h2>
              <ul className="space-y-2">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <Button
                      variant="outline"
                      className="w-full text-left"
                      onClick={() => switchSession(session.id)}
                    >
                      {session.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <h2 className="mb-4 text-xl font-semibold">Quick Access</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {systemCommands.map((command) => (
            <Card key={command.id}>
              <CardHeader>
                <CardTitle>{command.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{command.type}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => handleQuickChat(command)}>Chat</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
