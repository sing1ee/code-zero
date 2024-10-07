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

interface WelcomeProps {
  onCreateSession: () => void
  newSessionName: string
  setNewSessionName: (name: string) => void
  newSystemPrompt: string
  setNewSystemPrompt: (prompt: string) => void
  newSessionType: SessionType
  setNewSessionType: (type: SessionType) => void
  sessionTypeOptions: { value: SessionType; label: string }[]
}

export function Welcome({
  onCreateSession,
  newSessionName,
  setNewSessionName,
  newSystemPrompt,
  setNewSystemPrompt,
  newSessionType,
  setNewSessionType,
  sessionTypeOptions,
}: WelcomeProps) {
  const { sessions, switchSession } = useChatSession()

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
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
            <Button onClick={onCreateSession} className="w-full">
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
    </div>
  )
}
