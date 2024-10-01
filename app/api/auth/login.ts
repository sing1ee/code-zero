import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import { users } from '@/app/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email))
    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user[0].password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
