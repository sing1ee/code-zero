import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverProps } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { History, Trash2 } from 'lucide-react'
import { useChatSession } from '../contexts/ChatSessionContext'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface HistoryPopoverProps extends PopoverProps {
  isMobile: boolean
  onClose: () => void
}

export function HistoryPopover({ isMobile, onClose }: HistoryPopoverProps) {
  const { sessions, switchSession, updateSessionName, deleteSession } =
    useChatSession()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-full flex-col items-center"
          onClick={isMobile ? onClose : undefined}
        >
          <History />
          <span className="sr-only">History</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-2 font-semibold">Thinking History</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="flex-grow justify-start"
                  onClick={() => {
                    switchSession(session.id)
                    if (isMobile) onClose()
                  }}
                >
                  {session.name}
                </Button>
                <Input
                  value={session.name}
                  onChange={(e) =>
                    updateSessionName(session.id, e.target.value)
                  }
                  className="w-1/2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSession(session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
