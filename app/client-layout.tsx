'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from './components/ui/toaster'
import { ChatSessionProvider } from './contexts/ChatSessionContext'
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ChatSessionProvider>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </ChatSessionProvider>
  )
}
