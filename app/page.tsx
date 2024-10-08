'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/welcome')
    } else if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-xl font-semibold">Loading...</div>
    </div>
  )
}
