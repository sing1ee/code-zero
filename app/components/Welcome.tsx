import { SessionType } from '../types/ChatSession'
import { useChatSession } from '../contexts/ChatSessionContext'
import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card'
import { useRouter } from 'next/navigation'
import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface SystemCommand {
  id: string
  name: string
  type: SessionType
  description?: string
}

export function Welcome() {
  const router = useRouter()
  const { createSession } = useChatSession()
  const [systemCommands, setSystemCommands] = useState<SystemCommand[]>([])

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
    const session = await createSession(
      command.name,
      '',
      command.type,
      command.id
    )
    router.push(`/chat/${session?.id}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl space-y-8">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
          Welcome to Chat App
        </h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {systemCommands.map((command) => (
              <Card
                key={command.id}
                className="cursor-pointer bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-800"
                onClick={() => handleQuickChat(command)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                      {command.name}
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary">{command.type}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Session Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {command.description || 'No description available.'}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
