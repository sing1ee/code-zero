'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        router.push('/') // Redirect to home page
      } else {
        const data = await response.json()
        alert(data.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <CardFooter className="mt-4 flex flex-col items-center">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="mt-4 text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
