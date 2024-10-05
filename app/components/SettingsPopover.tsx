import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { PopoverProps } from '@radix-ui/react-popover'
import { Button } from './ui/button'
import { Settings, LogOut, Sun, Moon } from 'lucide-react'

interface SettingsPopoverProps extends PopoverProps {
  isMobile: boolean
  onClose: () => void
  toggleTheme: () => void
  isDarkMode: boolean
  handleLogout: () => void
}

export function SettingsPopover({
  isMobile,
  onClose,
  toggleTheme,
  isDarkMode,
  handleLogout,
}: SettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex w-full flex-col items-center"
          onClick={isMobile ? onClose : undefined}
        >
          <Settings />
          <span className="sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-2 font-semibold">Settings</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            Account Information
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Billing Information
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Pricing
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
