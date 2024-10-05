import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  newSessionName: string
  setNewSessionName: (name: string) => void
  newSystemPrompt: string
  setNewSystemPrompt: (prompt: string) => void
}

export function NavButton({
  icon,
  label,
  onClick,
  newSessionName,
  setNewSessionName,
  newSystemPrompt,
  setNewSystemPrompt,
}: NavButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-full flex-col items-center"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div>
          <Label htmlFor="newSessionName">New Session Name</Label>
          <Input
            id="newSessionName"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            className="mb-2"
          />
        </div>
        <div>
          <Label htmlFor="newSystemPrompt">System Prompt</Label>
          <Textarea
            id="newSystemPrompt"
            value={newSystemPrompt}
            onChange={(e) => setNewSystemPrompt(e.target.value)}
            className="mb-2"
          />
        </div>
        <Button onClick={onClick} className="w-full">
          Create New Session
        </Button>
      </PopoverContent>
    </Popover>
  )
}
