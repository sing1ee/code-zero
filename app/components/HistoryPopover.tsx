import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverProps } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { History, Trash2 } from 'lucide-react'
import { useChatSession } from '../contexts/ChatSessionContext'
import { ScrollArea } from './ui/scroll-area'
import { useRouter } from 'next/navigation'

interface HistoryPopoverProps extends PopoverProps {
  isMobile: boolean
  onClose: () => void
}

export function HistoryPopover({ isMobile, onClose }: HistoryPopoverProps) {
  const router = useRouter()
  const { sessions, deleteSession } = useChatSession()

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
        <ScrollArea className="h-[70vh] md:h-[80vh]">
          <div className="space-y-2 pl-2 pt-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center space-x-2">
                <span className="flex-grow">{session.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    router.push(`/chat/${session.id}`)
                    if (isMobile) onClose()
                  }}
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteSession(session.id)
                    router.push(`/welcome`)
                    if (isMobile) onClose()
                  }}
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
