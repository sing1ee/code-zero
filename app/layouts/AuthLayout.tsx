'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthLayoutProps {
  children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  return <>{children}</>
}

export default AuthLayout
