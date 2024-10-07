'use client'

import { useState } from 'react'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet'
import { Chat } from './components/Chat'
import { Menu, Plus } from 'lucide-react'
import Image from 'next/image'
import favicon from './favicon.svg'
import AuthLayout from './layouts/AuthLayout'
import { useRouter } from 'next/navigation'
import {
  ChatSessionProvider,
  useChatSession,
} from './contexts/ChatSessionContext'
import { SettingsPopover } from './components/SettingsPopover'
import { FeedbackPopover } from './components/FeedbackPopover'
import { HistoryPopover } from './components/HistoryPopover'
import { NavButton } from './components/NavButton'
import { SessionType } from './types/ChatSession'

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
  const [newSessionType, setNewSessionType] =
    useState<SessionType>('text_assistant')

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
      createSession(newSessionName, newSystemPrompt, newSessionType)
      setNewSessionName('')
      setNewSystemPrompt('')
      setNewSessionType('text_assistant')
      setIsMobileMenuOpen(false)
    }
  }

  const sessionTypeOptions: { value: SessionType; label: string }[] = [
    { value: 'text_assistant', label: 'Text Assistant' },
    { value: 'mermaid_assistant', label: 'Mermaid Assistant' },
    { value: 'svg_card_assistant', label: 'SVG Card Assistant' },
    { value: 'development_assistant', label: 'Development Assistant' },
    { value: 'chatbot', label: 'Chatbot' },
  ]

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* 侧边栏 - PC 版本 */}
      <aside className="hidden w-16 flex-col items-center bg-gray-100 p-4 dark:bg-gray-800 lg:flex">
        <Logo />
        <NavButton
          icon={<Plus />}
          onClick={handleCreateSession}
          newSessionName={newSessionName}
          setNewSessionName={setNewSessionName}
          newSystemPrompt={newSystemPrompt}
          setNewSystemPrompt={setNewSystemPrompt}
          newSessionType={newSessionType}
          setNewSessionType={setNewSessionType}
          sessionTypeOptions={sessionTypeOptions}
          isMobile={true}
          onClose={() => setIsMobileMenuOpen(false)}
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
              onClick={handleCreateSession}
              newSessionName={newSessionName}
              setNewSessionName={setNewSessionName}
              newSystemPrompt={newSystemPrompt}
              setNewSystemPrompt={setNewSystemPrompt}
              newSessionType={newSessionType}
              setNewSessionType={setNewSessionType}
              sessionTypeOptions={sessionTypeOptions}
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
