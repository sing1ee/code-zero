import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverProps } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { MessageSquare } from 'lucide-react'

interface FeedbackPopoverProps extends PopoverProps {
  isMobile: boolean
  onClose: () => void
}

export function FeedbackPopover({ isMobile, onClose }: FeedbackPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-full flex-col items-center"
          onClick={isMobile ? onClose : undefined}
        >
          <MessageSquare />
          <span className="sr-only">Feedback</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-2 font-semibold">Provide Feedback</h3>
        <Textarea placeholder="Your feedback..." className="mb-2" />
        <Button className="w-full">Submit</Button>
      </PopoverContent>
    </Popover>
  )
}
