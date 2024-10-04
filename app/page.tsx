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
import { Chat } from './components/Chat'
import {
  Menu,
  Plus,
  History,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import favicon from './favicon.svg'
import AuthLayout from './layouts/AuthLayout'
import { useRouter } from 'next/navigation'
import {
  ChatSessionProvider,
  useChatSession,
} from './contexts/ChatSessionContext'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'

export default function Home() {
  return (
    <AuthLayout>
      <ChatSessionProvider>
        <HomeContent />
      </ChatSessionProvider>
    </AuthLayout>
  )
}

function HomeContent() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { currentSession, createSession } = useChatSession()

  const [newSessionName, setNewSessionName] = useState('')
  const [newSystemPrompt, setNewSystemPrompt] = useState('')

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // 在这里添加切换主题的逻辑
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  const handleCreateSession = () => {
    if (newSessionName && newSystemPrompt) {
      createSession(newSessionName, newSystemPrompt)
      setNewSessionName('')
      setNewSystemPrompt('')
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* 侧边栏 - PC 版本 */}
      <aside className="hidden w-16 flex-col items-center bg-gray-100 p-4 dark:bg-gray-800 lg:flex">
        <Logo />
        <NavButton
          icon={<Plus />}
          label="New Chat"
          onClick={handleCreateSession}
          newSessionName={newSessionName}
          setNewSessionName={setNewSessionName}
          newSystemPrompt={newSystemPrompt}
          setNewSystemPrompt={setNewSystemPrompt}
        />
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
              label="New Chat"
              onClick={handleCreateSession}
              newSessionName={newSessionName}
              setNewSessionName={setNewSessionName}
              newSystemPrompt={newSystemPrompt}
              setNewSystemPrompt={setNewSystemPrompt}
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

      {/* 主要内容区域 */}
      <main className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* 对话区域 */}
        <section className="flex-1 overflow-auto p-4">
          <Chat sessionId={currentSession?.id} />
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
  newSessionName: string
  setNewSessionName: (name: string) => void
  newSystemPrompt: string
  setNewSystemPrompt: (prompt: string) => void
}

function NavButton({
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

interface PopoverProps {
  isMobile: boolean
  onClose: () => void
}

function HistoryPopover({ isMobile, onClose }: PopoverProps) {
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
  isMobile: boolean
  onClose: () => void
  toggleTheme: () => void
  isDarkMode: boolean
  handleLogout: () => void
}

function SettingsPopover({
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
