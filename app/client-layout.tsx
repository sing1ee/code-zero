'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from './components/ui/toaster'

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}
