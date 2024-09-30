'use client'

import { useState } from 'react'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover'
import { Textarea } from './components/ui/textarea'
import { ScrollArea } from './components/ui/scroll-area'
import {
  Menu,
  Plus,
  History,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'
import Image from 'next/image'
import favicon from './favicon.svg'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // 在这里添加切换主题的逻辑
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* 侧边栏 - PC 版本 */}
      <aside className="hidden w-16 flex-col items-center bg-gray-100 p-4 dark:bg-gray-800 lg:flex">
        <Logo />
        <NavButton icon={<Plus />} label="New Thinking" onClick={() => {}} />
        <HistoryPopover isMobile={false} onClose={() => {}} />
        <FeedbackPopover isMobile={false} onClose={() => {}} />
        <SettingsPopover
          isMobile={false}
          onClose={() => {}}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
      </aside>

      {/* 移动端菜单 */}
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
              icon={<Plus />}
              label="New Thinking"
              onClick={() => setIsMobileMenuOpen(false)}
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
            />
          </nav>
        </SheetContent>
      </Sheet>

      {/* 主要内容区域 */}
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* 对话区域 */}
        <section className="flex-1 overflow-auto p-4">
          <h2 className="mb-4 text-2xl font-bold">Thinking Session</h2>
          <div className="space-y-4">
            {/* 这里可以添加对话内容 */}
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-800">
              <p>User: How can I improve my productivity?</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-800">
              <p>AI: Let&apos;s break this down into steps...</p>
            </div>
          </div>
          <div className="mt-4">
            <Textarea
              placeholder="Type your thoughts here..."
              className="w-full"
            />
            <Button className="mt-2">Send</Button>
          </div>
        </section>

        {/* 图形展示区域 */}
        <section className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-700">
          <h2 className="mb-4 text-2xl font-bold">Visualization</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
              <h3 className="mb-2 text-lg font-semibold">
                Relationship Diagram
              </h3>
              {/* 这里可以添加 Mermaid 图表 */}
              <div className="flex h-40 items-center justify-center bg-gray-200 dark:bg-gray-500">
                Mermaid Diagram Placeholder
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-600">
              <h3 className="mb-2 text-lg font-semibold">Inspiration Map</h3>
              {/* 这里可以添加 SVG 图表 */}
              <div className="flex h-40 items-center justify-center bg-gray-200 dark:bg-gray-500">
                SVG Inspiration Map Placeholder
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div className="mb-8 text-2xl font-bold">
      <Image src={favicon.src} alt="favicon" width={32} height={32} />
    </div>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function NavButton({ icon, label, onClick }: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="flex w-full flex-col items-center"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )
}

interface PopoverProps {
  isMobile: boolean
  onClose: () => void
}

function HistoryPopover({ isMobile, onClose }: PopoverProps) {
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
          {/* 这里可以添加历史记录列表 */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Productivity Improvement
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Career Planning
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Personal Finance
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function FeedbackPopover({ isMobile, onClose }: PopoverProps) {
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

interface SettingsPopoverProps extends PopoverProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

function SettingsPopover({
  isMobile,
  onClose,
  toggleTheme,
  isDarkMode,
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
          <Button variant="outline" className="w-full justify-start">
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
