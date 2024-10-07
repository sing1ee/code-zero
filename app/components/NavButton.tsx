import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { SessionType } from '../types/ChatSession'

interface NavButtonProps {
  icon: React.ReactNode
  onClick: () => void
  newSessionName: string
  setNewSessionName: (name: string) => void
  newSystemPrompt: string
  setNewSystemPrompt: (prompt: string) => void
  newSessionType: SessionType
  setNewSessionType: (type: SessionType) => void
  sessionTypeOptions: { value: SessionType; label: string }[]
  isMobile: boolean
  onClose: () => void
}

export function NavButton({
  icon,
  onClick,
  newSessionName,
  setNewSessionName,
  newSystemPrompt,
  setNewSystemPrompt,
  newSessionType,
  setNewSessionType,
  sessionTypeOptions,
  isMobile,
  onClose,
}: NavButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-full flex-col items-center"
          onClick={isMobile ? onClose : undefined}
        >
          {icon}
          <span className="sr-only">New Session</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Session</h4>
            <p className="text-sm text-muted-foreground">
              Enter details for the new chat session.
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="name"
              placeholder="Session Name"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
            />
            <Textarea
              id="systemPrompt"
              placeholder="System Prompt"
              value={newSystemPrompt}
              onChange={(e) => setNewSystemPrompt(e.target.value)}
            />
            <RadioGroup
              value={newSessionType}
              onValueChange={(value) => setNewSessionType(value as SessionType)}
            >
              {sessionTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={onClick}>Create Session</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
