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
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

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
  const [isCreating, setIsCreating] = useState(false)
  const [newCommand, setNewCommand] = useState({
    name: '',
    type: 'text_assistant' as SessionType,
    systemPrompt: '',
  })

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

  const handleCreateCommand = async () => {
    try {
      const response = await fetch('/api/system-commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommand),
      })

      if (!response.ok) throw new Error('Failed to create system command')

      // Refresh commands list
      const updatedCommands = await fetch('/api/system-commands').then((res) =>
        res.json()
      )
      setSystemCommands(updatedCommands)

      // Reset form
      setNewCommand({
        name: '',
        type: 'text_assistant',
        systemPrompt: '',
      })
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating system command:', error)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl space-y-8">
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
          Welcome to Chat App
        </h1>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Quick Access
            </h2>

            <Popover open={isCreating} onOpenChange={setIsCreating}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      New System Command
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Create a new system command for quick access.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCommand.name}
                      onChange={(e) =>
                        setNewCommand((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newCommand.type}
                      onValueChange={(value) =>
                        setNewCommand((prev) => ({
                          ...prev,
                          type: value as SessionType,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text_assistant">
                          Text Assistant
                        </SelectItem>
                        <SelectItem value="mermaid_assistant">
                          Mermaid Assistant
                        </SelectItem>
                        <SelectItem value="svg_card_assistant">
                          SVG Card Assistant
                        </SelectItem>
                        <SelectItem value="development_assistant">
                          Development Assistant
                        </SelectItem>
                        <SelectItem value="chatbot">Chatbot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <Input
                      id="systemPrompt"
                      value={newCommand.systemPrompt}
                      onChange={(e) =>
                        setNewCommand((prev) => ({
                          ...prev,
                          systemPrompt: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={handleCreateCommand}>Create Command</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
