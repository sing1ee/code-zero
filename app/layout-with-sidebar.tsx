'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'
import { FeedbackPopover } from './components/FeedbackPopover'
import { HistoryPopover } from './components/HistoryPopover'
import { NavButton } from './components/NavButton'
import { SettingsPopover } from './components/SettingsPopover'
import { Logo } from '@/app/components/Logo'

export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Add theme toggle logic here
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - PC version */}
      <aside className="hidden w-16 flex-col items-center bg-gray-100 p-4 dark:bg-gray-800 lg:flex">
        <Logo />
        <NavButton isMobile={false} onClose={() => {}} />
        <HistoryPopover isMobile={false} onClose={() => {}} />
        <FeedbackPopover isMobile={false} onClose={() => {}} />
        <SettingsPopover
          isMobile={false}
          onClose={() => {}}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-50 lg:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <nav className="flex flex-col space-y-4">
            <Logo />
            <NavButton
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <HistoryPopover
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <FeedbackPopover
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
            />
            <SettingsPopover
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
              handleLogout={handleLogout}
            />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      {children}
    </div>
  )
}
